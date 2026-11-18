// Front-end behaviour for the live site: filters, cart and forms.
(function () {
  const toastEl = document.querySelector('[data-toast]');
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  async function api(method, url, body) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }

  function setCount(n) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = n));
  }

  // Shop filters
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      const f = chip.dataset.filter;
      document.querySelectorAll('.shop-grid .product-card').forEach((card) => {
        card.classList.toggle('is-hidden', f !== 'All' && card.dataset.category !== f);
      });
    })
  );

  // Product page quantity + add to cart
  const qtyBox = document.querySelector('[data-qty]');
  if (qtyBox) {
    const val = qtyBox.querySelector('[data-qty-value]');
    qtyBox.querySelectorAll('[data-step]').forEach((b) =>
      b.addEventListener('click', () => {
        val.textContent = Math.max(1, Number(val.textContent) + Number(b.dataset.step));
      })
    );
  }
  document.querySelectorAll('[data-add]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const qty = Number(document.querySelector('[data-qty-value]')?.textContent || 1);
      try {
        const cart = await api('POST', '/api/cart', { slug: btn.dataset.add, qty });
        setCount(cart.count);
        toast(`Added ${qty} to your cart`);
      } catch (e) { toast(e.message); }
    })
  );

  // Cart page
  document.querySelectorAll('.cart-row').forEach((row) => {
    const slug = row.dataset.slug;
    const current = () => Number(row.querySelector('.qty span').textContent);
    row.querySelectorAll('[data-cart-step]').forEach((b) =>
      b.addEventListener('click', async () => {
        await api('PATCH', `/api/cart/${slug}`, { qty: current() + Number(b.dataset.cartStep) });
        location.reload();
      })
    );
    row.querySelector('[data-remove]')?.addEventListener('click', async () => {
      await api('DELETE', `/api/cart/${slug}`);
      location.reload();
    });
  });
  document.querySelector('[data-checkout]')?.addEventListener('click', async () => {
    try {
      const r = await api('POST', '/api/checkout');
      toast(`Order ${r.orderId} placed (mock)`);
      setTimeout(() => location.reload(), 1400);
    } catch (e) { toast(e.message); }
  });

  // Forms: subscribe, contact, sign in
  document.querySelectorAll('form[data-form]').forEach((form) =>
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = Object.fromEntries(new FormData(form));
      try {
        const r = await api('POST', `/api/${form.dataset.form}`, body);
        toast(r.message);
        form.reset();
      } catch (err) { toast(err.message); }
    })
  );
})();
