// Renders every page of the site.
const products = require('../data/products.json');
const posts = require('../data/posts.json');
const { sprite, shape } = require('./shapes');

const SHIPPING = 6;

// A few decorative shapes are swapped here (see BUGS.md).
const drift = (mode, correct, wrong) => wrong;

const money = (n) => `$${n.toFixed(2)}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function href(mode, key, slug) {
  return {
    home: '/', shop: '/shop', product: `/product/${slug}`, cart: '/cart', about: '/about',
    journal: '/journal', article: `/journal/${slug}`, faq: '/faq', contact: '/contact', signin: '/signin',
  }[key];
}

function layout({ mode, page, title, cart, body }) {
    const count = cart.reduce((n, i) => n + i.qty, 0);
  const nav = [
    ['shop', 'Shop'], ['about', 'About'], ['journal', 'Journal'], ['faq', 'FAQ'], ['contact', 'Contact'],
  ];
  const current = (key) => (key === page || (key === 'shop' && page === 'product') || (key === 'journal' && page === 'article') ? ' aria-current="page"' : '');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Saltmeadow</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
</head>
<body class="page-${page}">
${sprite()}
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="${href(mode, 'home')}">${shape('flower', 'logo-mark')}<span>Saltmeadow</span></a>
    <nav class="nav" aria-label="Main">
      ${nav.map(([k, label]) => `<a href="${href(mode, k)}"${current(k)}>${label}</a>`).join('\n      ')}
    </nav>
    <div class="header-actions">
      <a class="signin-link" href="${href(mode, 'signin')}"${current('signin')}>Sign in</a>
      <a class="cart-pill" href="${href(mode, 'cart')}"${current('cart')}>Cart <span class="cart-count" data-cart-count>${count}</span></a>
    </div>
  </div>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <a class="logo logo-light" href="${href(mode, 'home')}">${shape('flower', 'logo-mark')}<span>Saltmeadow</span></a>
      <p class="footer-note">Coastal plants, grown slowly on a windy headland.</p>
    </div>
    <div>
      <h4>Shop</h4>
      <a href="${href(mode, 'shop')}">All plants</a>
      <a href="${href(mode, 'shop')}">Flowers</a>
      <a href="${href(mode, 'shop')}">Herbs</a>
    </div>
    <div>
      <h4>Help</h4>
      <a href="${href(mode, 'faq')}">FAQ</a>
      <a href="${href(mode, 'contact')}">Contact</a>
      <a href="${href(mode, 'signin')}">Your account</a>
    </div>
    <div>
      <h4>Company</h4>
      <a href="${href(mode, 'about')}">About us</a>
      <a href="${href(mode, 'journal')}">Journal</a>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span>© 2026 Saltmeadow Nursery</span>
    <span class="footer-shapes">${shape('circle', '', 'var(--sage)')}${shape('circle', '', 'var(--mist)')}${shape('circle', '', 'var(--sky)')}</span>
  </div>
</footer>
<div class="toast" role="status" aria-live="polite" data-toast></div>
<script src="/js/app.js"></script>
</body>
</html>`;
}

function productCard(mode, p) {
  return `<article class="product-card" data-category="${p.category}">
      <a class="product-art" href="${href(mode, 'product', p.slug)}" style="background:${p.bg}">${shape(p.slug === 'beach-rose' ? drift(mode, p.shape, 'sparkle') : p.shape, '', p.color)}</a>
      <div class="product-info">
        <div>
          <h3><a href="${href(mode, 'product', p.slug)}">${esc(p.name)}</a></h3>
          <p class="latin">${esc(p.latin)}</p>
        </div>
        <p class="price">${money(p.price)}</p>
      </div>
    </article>`;
}

function postCard(mode, post) {
  return `<article class="post-card">
      <a class="post-art" href="${href(mode, 'article', post.slug)}" style="background:${post.bg}">${shape(post.slug === 'notes-from-the-headland' ? drift(mode, post.shape, 'blob') : post.shape, '', post.color)}</a>
      <div class="post-body">
        <span class="tag">${esc(post.tag)}</span>
        <h3><a href="${href(mode, 'article', post.slug)}">${esc(post.title)}</a></h3>
        <p>${esc(post.excerpt)}</p>
        <p class="post-meta">${post.date} · ${post.readTime}</p>
      </div>
    </article>`;
}

/* ---------------- pages ---------------- */

function home(mode) {
  return `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">New autumn plants are in</p>
      <h1>Plants that love the wind and the salt.</h1>
      <p class="lead">We grow tough, pretty coastal plants on a headland by the sea, then send them to gardens, balconies and window boxes everywhere.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${href(mode, 'shop')}">Shop plants</a>
        <a class="btn btn-secondary" href="${href(mode, 'about')}">Our story</a>
      </div>
    </div>
    <div class="hero-art" aria-hidden="true">
      ${shape('arch', 'ha-arch', 'var(--sky)')}
      ${shape('flower', 'ha-flower', 'var(--sage)')}
      ${shape('sparkle', 'ha-sparkle', 'var(--deep)')}
      ${shape('clover', 'ha-clover', 'var(--mist)')}
      ${shape('pill', 'ha-pill', 'var(--peach)')}
      ${shape('circle', 'ha-dot', 'var(--olive)')}
    </div>
  </div>
</section>

<section class="features">
  <div class="wrap features-grid">
    <div class="card feature-card">
      ${shape('scallop', 'feature-icon', 'var(--sage)')}
      <h3>Grown outdoors</h3>
      <p>Every plant spends a full season in the open, so it arrives already used to weather.</p>
    </div>
    <div class="card feature-card">
      ${shape('quarter', 'feature-icon', 'var(--mist)')}
      <h3>Peat-free pots</h3>
      <p>Our compost is made from bark, wool and seaweed. Pots are recycled and recyclable.</p>
    </div>
    <div class="card feature-card">
      ${shape('blob', 'feature-icon', 'var(--deep)')}
      <h3>Happy-plant promise</h3>
      <p>If something fails in its first month, tell us and we will replace it. No forms.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>This week's favourites</h2>
      <a class="text-link" href="${href(mode, 'shop')}">See all plants →</a>
    </div>
    <div class="product-grid">
      ${products.slice(0, 3).map((p) => productCard(mode, p)).join('\n    ')}
    </div>
  </div>
</section>

<section class="newsletter">
  <div class="wrap newsletter-inner">
    ${shape('sparkle', 'nl-sparkle', 'var(--deep)')}
    ${shape('clover', 'nl-clover', 'var(--sage)')}
    <div>
      <h2>Letters from the headland</h2>
      <p>One short email a month: what is flowering, what to plant, and the odd discount.</p>
    </div>
    <form class="newsletter-form" data-form="subscribe">
      <label class="sr-only" for="nl-email">Email address</label>
      <input id="nl-email" name="email" type="email" placeholder="you@example.com" required>
      <button class="btn btn-primary" type="submit">Subscribe</button>
    </form>
  </div>
</section>`;
}

function shop(mode) {
  const cats = ['All', 'Flowers', 'Herbs', 'Shrubs'];
  return `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">The nursery</p>
    <h1>All plants</h1>
    <p class="lead">Six hardy favourites, ready to ship this week.</p>
  </div>
</section>
<section class="section section-tight">
  <div class="wrap">
    <div class="chips" role="group" aria-label="Filter by category">
      ${cats.map((c, i) => `<button class="chip${i === 0 ? ' is-active' : ''}" data-filter="${c}" type="button">${c}</button>`).join('\n      ')}
    </div>
    <div class="product-grid shop-grid">
      ${products.map((p) => productCard(mode, p)).join('\n    ')}
    </div>
  </div>
</section>`;
}

function product(mode, p) {
  return `
<section class="section product-page">
  <div class="wrap product-grid-detail">
    <div class="product-hero-art" style="background:${p.bg}">
      ${shape(p.shape, 'ph-main', p.color)}
      ${shape('sparkle', 'ph-sparkle', 'var(--sage)')}
    </div>
    <div class="product-detail">
      <a class="back-link" href="${href(mode, 'shop')}">← Back to shop</a>
      <p class="eyebrow">${p.category}</p>
      <h1>${esc(p.name)}</h1>
      <p class="latin latin-lg">${esc(p.latin)}</p>
      <p class="product-price">${money(p.price)}</p>
      <p class="product-desc">${esc(p.description)}</p>
      <div class="buy-row">
        <div class="qty" data-qty>
          <button type="button" data-step="-1" aria-label="Decrease">−</button>
          <span data-qty-value>1</span>
          <button type="button" data-step="1" aria-label="Increase">+</button>
        </div>
        <button class="btn btn-primary add-to-cart" type="button" data-add="${p.slug}">Add to cart</button>
      </div>
      <div class="badge-row">
        <div class="badge">
          ${shape(drift(mode, 'scallop', 'square'), 'badge-shape', 'var(--sage)')}
          <span>Coast<br>hardy</span>
        </div>
        <ul class="detail-list">
          ${p.details.map((d) => `<li>${esc(d)}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

function cartPage(mode, cart) {
  const lines = cart
    .map((i) => ({ ...i, p: products.find((p) => p.slug === i.slug) }))
    .filter((i) => i.p);
  const subtotal = lines.reduce((s, i) => s + i.p.price * i.qty, 0);
  const shipping = lines.length ? SHIPPING : 0;

  const rows = lines.length
    ? lines.map((i) => `<li class="cart-row" data-slug="${i.slug}">
          <div class="cart-thumb" style="background:${i.p.bg}">${shape(i.p.shape, '', i.p.color)}</div>
          <div class="cart-name">
            <a href="${href(mode, 'product', i.slug)}">${esc(i.p.name)}</a>
            <span class="latin">${esc(i.p.latin)}</span>
          </div>
          <div class="qty qty-sm">
            <button type="button" data-cart-step="-1" aria-label="Decrease">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cart-step="1" aria-label="Increase">+</button>
          </div>
          <span class="cart-line">${money(i.p.price * i.qty)}</span>
          <button class="remove" type="button" data-remove aria-label="Remove ${esc(i.p.name)}">Remove</button>
        </li>`).join('\n        ')
    : `<li class="cart-empty">${shape('clover', '', 'var(--sky)')}<p>Your cart is empty.</p><a class="btn btn-primary" href="${href(mode, 'shop')}">Browse plants</a></li>`;

  return `
<section class="page-head">
  <div class="wrap"><h1>Your cart</h1></div>
</section>
<section class="section section-tight">
  <div class="wrap cart-grid">
    <ul class="cart-list">
        ${rows}
    </ul>
    <aside class="card summary">
      <h2>Order summary</h2>
      <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${money(shipping)}</span></div>
      <div class="summary-row summary-total"><span>Total</span><span>${money(subtotal + shipping)}</span></div>
      <button class="btn checkout-btn" type="button" data-checkout>Checkout</button>
      <p class="summary-note">${shape('sparkle', '', 'var(--sage)')} Free returns within 30 days</p>
    </aside>
  </div>
</section>`;
}

function about(mode) {
  return `
<section class="page-head about-head">
  <div class="wrap about-head-grid">
    <div>
      <p class="eyebrow">About us</p>
      <h1>A small nursery at the edge of the land.</h1>
      <p class="lead">Saltmeadow started as two raised beds and a stubborn idea: that the plants growing wild on our cliffs deserved a place in more gardens. Ten years on we grow around forty species, all outdoors and all peat-free.</p>
    </div>
    <div class="about-art" aria-hidden="true">
      ${shape('circle', 'aa-sun', 'var(--peach)')}
      ${shape('arch', 'aa-arch', 'var(--mist)')}
      ${shape('scallop', 'aa-scallop', 'var(--sage)')}
    </div>
  </div>
</section>
<section class="section values">
  <div class="wrap">
    <h2>What we care about</h2>
    <div class="values-grid">
      <div class="card value-card">
        ${shape('arch', 'value-icon', 'var(--olive)')}
        <h3>Slow growing</h3>
        <p>We do not force plants under glass. They grow at the pace of the seasons.</p>
      </div>
      <div class="card value-card">
        ${shape('clover', 'value-icon', 'var(--mist)')}
        <h3>Local seed</h3>
        <p>Most of our stock starts from seed collected within ten miles of the nursery.</p>
      </div>
      <div class="card value-card">
        ${shape(drift(mode, 'quarter', 'diamond'), 'value-icon', 'var(--deep)')}
        <h3>Less plastic</h3>
        <p>Recycled pots, paper tape and wool padding. Send old pots back and we reuse them.</p>
      </div>
    </div>
  </div>
</section>
<section class="section about-quote">
  <div class="wrap">
    <blockquote>"Anything that thrives up here will be happy almost anywhere."</blockquote>
    <p class="quote-by">— Ines, head grower</p>
  </div>
</section>`;
}

function journal(mode) {
  return `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Journal</p>
    <h1>Notes, guides and small stories</h1>
  </div>
</section>
<section class="section section-tight">
  <div class="wrap post-grid">
    ${posts.map((p) => postCard(mode, p)).join('\n    ')}
  </div>
</section>`;
}

function article(mode, post) {
  return `
<article class="article">
  <header class="article-head">
    <div class="wrap-narrow">
      <a class="back-link" href="${href(mode, 'journal')}">← All posts</a>
      <span class="tag">${esc(post.tag)}</span>
      <h1>${esc(post.title)}</h1>
      <p class="post-meta">${post.date} · ${post.readTime}</p>
    </div>
  </header>
  <div class="article-banner" style="background:${post.bg}" aria-hidden="true">
    ${shape(post.shape, 'ab-main', post.color)}
    ${shape('sparkle', 'ab-sparkle', 'var(--deep)')}
    ${shape('circle', 'ab-dot', 'var(--peach)')}
  </div>
  <div class="wrap-narrow article-body">
    <p>${esc(post.excerpt)}</p>
    <p>The first thing a coastal garden teaches you is patience. Wind dries leaves faster than sun does, and salt finds its way into every crack. Plants that look happy in a sheltered nursery can sulk for a whole season once they meet the real weather.</p>
    <h2>Start with the toughest plants</h2>
    <p>We always begin a new bed with a backbone of shrubs that shrug off spray: beach rose, bayberry and a few clumps of sea thrift along the edge. Once they are settled they slow the wind enough for softer plants to move in behind them.</p>
    <blockquote class="pull-quote">Shelter is something you grow, not something you buy.</blockquote>
    <p>Water deeply but rarely. Shallow daily watering keeps roots near the surface, where they dry out first. A long soak once a week in the first summer is usually enough.</p>
    <h2>Let things self-seed</h2>
    <p>Sweet alyssum, sea kale and thrift will all scatter seed if you let them. Leave the seedheads until late autumn and you will find small plants turning up exactly where conditions suit them best.</p>
  </div>
</article>`;
}

function faq(mode) {
  const items = [
    ['When will my plants arrive?', 'We ship on Mondays and Tuesdays so nothing sits in a depot over the weekend. Most orders arrive within three working days.'],
    ['How are plants packed?', 'Pots are wrapped in paper and padded with sheep wool, then boxed upright with a little card telling you what to do first.'],
    ['Do you ship outside the country?', 'Not yet. Plant health rules make it tricky, but we hope to offer it for seeds next year.'],
    ['What if a plant arrives damaged?', 'Send us a photo within seven days and we will replace it or refund you, whichever you prefer.'],
    ['Can I visit the nursery?', 'Yes. We open the gates on the first Saturday of every month from April to October.'],
  ];
  return `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Help</p>
    <h1>Questions we hear a lot</h1>
  </div>
</section>
<section class="section section-tight">
  <div class="wrap faq-grid">
    <div class="faq-list">
      ${items.map(([q, a], i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary><span>${q}</span><span class="faq-icon" aria-hidden="true">+</span></summary>
        <p>${a}</p>
      </details>`).join('\n      ')}
    </div>
    <aside class="card faq-aside">
      ${shape('blob', 'faq-aside-shape', 'var(--sage)')}
      <h3>Still stuck?</h3>
      <p>Write to us and a real person will reply within a day.</p>
      <a class="btn btn-secondary" href="${href(mode, 'contact')}">Contact us</a>
    </aside>
  </div>
</section>`;
}

function contact(mode) {
  return `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow">Contact</p>
    <h1>Say hello</h1>
    <p class="lead">Questions about a plant, an order or a visit. We read everything.</p>
  </div>
</section>
<section class="section section-tight">
  <div class="wrap contact-grid">
    <aside class="contact-card">
      ${shape(drift(mode, 'quarter', 'arch'), 'cc-quarter', 'var(--sage)')}
      ${shape('circle', 'cc-dot', 'var(--sky)')}
      <h3>Saltmeadow Nursery</h3>
      <p>Headland Lane<br>Cliffside, CS4 7PL</p>
      <p>hello@saltmeadow.test<br>01234 567 890</p>
      <p class="contact-hours">Mon–Fri, 9am–4pm</p>
    </aside>
    <form class="contact-form" data-form="messages">
      <div class="field-row">
        <div class="field">
          <label for="c-name">Your name</label>
          <input id="c-name" name="name" type="text" placeholder="Ada Lovelace" required>
        </div>
        <div class="field">
          <label for="c-email">Email</label>
          <input id="c-email" name="email" type="email" placeholder="you@example.com" required>
        </div>
      </div>
      <div class="field">
        <label for="c-topic">Topic</label>
        <select id="c-topic" name="topic">
          <option>A plant question</option>
          <option>My order</option>
          <option>Visiting</option>
          <option>Something else</option>
        </select>
      </div>
      <div class="field">
        <label for="c-msg">Message</label>
        <textarea id="c-msg" name="message" rows="6" placeholder="What can we help with?" required></textarea>
      </div>
      <button class="btn btn-primary" type="submit">Send message</button>
    </form>
  </div>
</section>`;
}

function signin(mode) {
  return `
<section class="signin-section">
  ${shape(drift(mode, 'flower', 'clover'), 'si-flower', 'var(--sage)')}
  ${shape('arch', 'si-arch', 'var(--sky)')}
  ${shape('sparkle', 'si-sparkle', 'var(--deep)')}
  ${shape('pill', 'si-pill', 'var(--mist)')}
  <div class="signin-card">
    <h1>Welcome back</h1>
    <p class="signin-sub">Sign in to see your orders and saved plants.</p>
    <form data-form="signin">
      <div class="field">
        <label for="s-email">Email</label>
        <input id="s-email" name="email" type="email" placeholder="you@example.com" required>
      </div>
      <div class="field">
        <label for="s-pass">Password</label>
        <input id="s-pass" name="password" type="password" placeholder="••••••••" required>
      </div>
      <button class="btn signin-btn" type="submit">Sign in</button>
    </form>
    <p class="signin-foot">New here? <a class="text-link" href="${href(mode, 'signin')}">Create an account</a></p>
  </div>
</section>`;
}

/* ---------------- entry ---------------- */

function renderPage(page, { mode = 'app', cart = [], slug } = {}) {
  let title, body;
  switch (page) {
    case 'home': title = 'Coastal plants'; body = home(mode); break;
    case 'shop': title = 'Shop'; body = shop(mode); break;
    case 'product': {
      const p = products.find((x) => x.slug === slug) || products[0];
      title = p.name; body = product(mode, p); break;
    }
    case 'cart': title = 'Cart'; body = cartPage(mode, cart); break;
    case 'about': title = 'About'; body = about(mode); break;
    case 'journal': title = 'Journal'; body = journal(mode); break;
    case 'article': {
      const post = posts.find((x) => x.slug === slug) || posts[0];
      title = post.title; body = article(mode, post); break;
    }
    case 'faq': title = 'FAQ'; body = faq(mode); break;
    case 'contact': title = 'Contact'; body = contact(mode); break;
    case 'signin': title = 'Sign in'; body = signin(mode); break;
    default: return null;
  }
  return layout({ mode, page, title, cart, body });
}

module.exports = { renderPage, products, posts, SHIPPING };
