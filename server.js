// Saltmeadow server – plain Node, no dependencies.
//   http://localhost:4000/  (3000 is left free for the Parity backend)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { renderPage, products, posts, SHIPPING } = require('./src/render');
const db = require('./src/db');

const PORT = process.env.PORT || 4000;
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

/* ---------- helpers ---------- */
const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function html(res, status, body) {
  res.writeHead(status, { 'Content-Type': TYPES['.html'] });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

function serveFile(res, root, rel) {
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) return false;
  let target = file;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) return false;
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
  return true;
}

function page(res, name, opts = {}) {
  html(res, 200, renderPage(name, { mode: 'app', cart: db.read().cart, ...opts }));
}

function cartSummary(cart) {
  const items = cart
    .map((i) => {
      const p = products.find((x) => x.slug === i.slug);
      return p && { slug: i.slug, name: p.name, price: p.price, qty: i.qty, lineTotal: p.price * i.qty };
    })
    .filter(Boolean);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const shipping = items.length ? SHIPPING : 0;
  return { items, count: items.reduce((n, i) => n + i.qty, 0), subtotal, shipping, total: subtotal + shipping };
}

/* ---------- routes ---------- */
const pages = {
  '/': 'home', '/shop': 'shop', '/cart': 'cart', '/about': 'about', '/journal': 'journal',
  '/faq': 'faq', '/contact': 'contact', '/signin': 'signin',
};

async function api(req, res, pathname, query) {
  const m = req.method;
  let match;

  if (m === 'GET' && pathname === '/api/products') {
    const c = query.get('category');
    return json(res, 200, c ? products.filter((p) => p.category === c) : products);
  }
  if (m === 'GET' && (match = pathname.match(/^\/api\/products\/([\w-]+)$/))) {
    const p = products.find((x) => x.slug === match[1]);
    return p ? json(res, 200, p) : json(res, 404, { error: 'Not found' });
  }
  if (m === 'GET' && pathname === '/api/posts') return json(res, 200, posts);
  if (m === 'GET' && pathname === '/api/cart') return json(res, 200, cartSummary(db.read().cart));

  const body = await readBody(req);

  if (m === 'POST' && pathname === '/api/cart') {
    const qty = Math.max(1, parseInt(body.qty, 10) || 1);
    if (!products.some((p) => p.slug === body.slug)) return json(res, 400, { error: 'Unknown plant' });
    const cart = db.update((d) => {
      const line = d.cart.find((i) => i.slug === body.slug);
      line ? (line.qty += qty) : d.cart.push({ slug: body.slug, qty });
      return d.cart;
    });
    return json(res, 201, cartSummary(cart));
  }
  if ((m === 'PATCH' || m === 'DELETE') && (match = pathname.match(/^\/api\/cart\/([\w-]+)$/))) {
    const slug = match[1];
    const qty = m === 'DELETE' ? 0 : parseInt(body.qty, 10);
    if (Number.isNaN(qty)) return json(res, 400, { error: 'qty is required' });
    const cart = db.update((d) => {
      d.cart = qty <= 0 ? d.cart.filter((i) => i.slug !== slug) : d.cart.map((i) => (i.slug === slug ? { ...i, qty } : i));
      return d.cart;
    });
    return json(res, 200, cartSummary(cart));
  }
  if (m === 'POST' && pathname === '/api/checkout') {
    const summary = db.update((d) => { const s = cartSummary(d.cart); d.cart = []; return s; });
    if (!summary.items.length) return json(res, 400, { error: 'Your cart is empty' });
    return json(res, 200, { ok: true, orderId: `SM-${Date.now().toString().slice(-6)}`, total: summary.total });
  }
  if (m === 'POST' && pathname === '/api/subscribe') {
    if (!isEmail(body.email)) return json(res, 400, { error: 'Please enter a valid email.' });
    db.update((d) => { if (!d.subscribers.includes(body.email)) d.subscribers.push(body.email); });
    return json(res, 201, { ok: true, message: 'Thanks! See you next month.' });
  }
  if (m === 'POST' && pathname === '/api/messages') {
    const { name, email, topic, message } = body;
    if (!name || !isEmail(email) || !message) return json(res, 400, { error: 'Name, email and message are required.' });
    db.update((d) => d.messages.push({ name, email, topic, message, at: new Date().toISOString() }));
    return json(res, 201, { ok: true, message: `Thanks ${name}, we'll be in touch.` });
  }
  if (m === 'POST' && pathname === '/api/signin') {
    if (!isEmail(body.email) || !body.password) return json(res, 400, { error: 'Email and password are required.' });
    db.update((d) => d.signins.push({ email: body.email, at: new Date().toISOString() }));
    return json(res, 200, { ok: true, message: `Signed in as ${body.email} (mock).` });
  }
  return json(res, 404, { error: 'Unknown endpoint' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';

  try {
    if (pathname.startsWith('/api/')) return await api(req, res, pathname, url.searchParams);

    if (req.method === 'GET') {
      if (pages[pathname]) return page(res, pages[pathname]);

      let match;
      if ((match = pathname.match(/^\/product\/([\w-]+)$/)) && products.some((p) => p.slug === match[1])) {
        return page(res, 'product', { slug: match[1] });
      }
      if ((match = pathname.match(/^\/journal\/([\w-]+)$/)) && posts.some((p) => p.slug === match[1])) {
        return page(res, 'article', { slug: match[1] });
      }
      if (serveFile(res, PUBLIC, pathname)) return;
    }
    html(res, 404, '<h1 style="font-family:sans-serif">Not found</h1>');
  } catch (err) {
    console.error(err);
    json(res, 500, { error: 'Server error' });
  }
});

server.listen(PORT, () => {
  console.log(`\n  Saltmeadow is running\n`);
  console.log(`  Open http://localhost:${PORT}/\n`);
});
