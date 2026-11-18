# Saltmeadow 🌿

A small, deliberately imperfect plant shop used to demo **Parity**, our Chrome DevTools
design-drift checker. The site has 62 styling mistakes compared with its Figma design
(see [BUGS.md](BUGS.md)), so Parity has plenty to find and fix. The **home page** ones are loud on purpose:
a red arch, Courier headings, a yellow newsletter box, a red "Shop plants" button.

## Run it

Needs Node 18 or newer. There is nothing to install.

```bash
npm start            # http://localhost:4000
```

It runs on port 4000 so the Parity backend can keep port 3000. To use another port:

```bash
PORT=5000 npm start              # Mac / Linux
$env:PORT=5000; npm start        # Windows PowerShell
```

## Demo with Parity

1. Start the Parity backend (port 3000) and this site (`npm start`, port 4000).
2. Open http://localhost:4000, press F12, open the **Parity** tab.
3. Figma Link tab: paste the Saltmeadow Figma link, then pick **Index** from the list.
4. Use the inspect arrow to click something in the hero (the big red arch is a good start).
   Parity lists every fix for that part of the page, one per row.
5. **Preview all recommended changes** to see the page snap back to the design, then
   **Stage all recommended changes**, then **Review & commit**.
6. Pick this repository and `public/css/styles.css`. Parity deletes the wrong lines on a new
   `parity/...` branch. It never touches `main`.

Other scripts:

```bash
npm run dev          # restarts on file changes
npm run reset        # put the cart and form data back to the starting state
```

## Pages

| # | Page | URL |
|---|------|-----|
| 1 | Home | `/` |
| 2 | Shop | `/shop` |
| 3 | Product | `/product/sea-thrift` |
| 4 | Cart | `/cart` |
| 5 | About | `/about` |
| 6 | Journal | `/journal` |
| 7 | Article | `/journal/tending-a-salt-garden` |
| 8 | FAQ | `/faq` |
| 9 | Contact | `/contact` |
| 10 | Sign in | `/signin` |

## What makes it full stack

- **Server:** plain Node `http` server (`server.js`) that renders pages on the server.
- **Data:** products and posts in `data/*.json`; the cart, newsletter sign-ups, contact messages
  and sign-ins are saved to `data/db.json` (created from `data/seed.json`, git-ignored).
- **API:**

| Method | Path | Does |
|--------|------|------|
| GET | `/api/products` (`?category=Herbs`) | List plants |
| GET | `/api/products/:slug` | One plant |
| GET | `/api/posts` | Journal posts |
| GET | `/api/cart` | Cart with totals |
| POST | `/api/cart` `{slug, qty}` | Add to cart |
| PATCH | `/api/cart/:slug` `{qty}` | Change quantity (0 removes) |
| DELETE | `/api/cart/:slug` | Remove line |
| POST | `/api/checkout` | Mock order, empties cart |
| POST | `/api/subscribe` `{email}` | Newsletter |
| POST | `/api/messages` `{name, email, topic, message}` | Contact form |
| POST | `/api/signin` `{email, password}` | Mock sign-in |

## Project layout

```
server.js              server + API
src/render.js          the 10 page templates
src/shapes.js          the little SVG shape library
src/db.js              JSON-file storage
public/css/styles.css  styles (mistakes are one line each in the "page tweaks" block at the bottom)
public/js/app.js       cart, filters, forms
data/                  products, posts, seed data
```
