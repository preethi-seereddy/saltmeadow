# Answer key: intentional design drift

The site differs from the Figma design in **63 CSS places** plus a few swapped decorative shapes.
The **home page** mistakes are the loudest (red arch, Courier headings, yellow newsletter) so they jump out in a demo.

- Every CSS mistake is one line in the "page tweaks" block at the bottom of [`public/css/styles.css`](public/css/styles.css).
  Deleting that line fixes it. Parity's "Stage" + commit does exactly that on a new branch.
- Shape swaps (not fixable from CSS) are the `drift(...)` calls in [`src/render.js`](src/render.js): Shop (Beach Rose), Product (badge),
  About ("Less plastic" icon), Journal (4th post), Contact (address card), Sign in (top-left shape).

## Every page (5)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S01 | header | Logo text color | `.site-header .logo` | `color` | `#4D6A7A` | `#D62828` |
| S02 | header | Cart pill background | `.cart-pill` | `background-color` | `#C7D7E5` | `#E9BFA0` |
| S03 | header | Active nav underline color | `.nav a[aria-current]` | `border-bottom-color` | `#A7B69A` | `#D98B6A` |
| S04 | header | Active nav underline thickness | `.nav a[aria-current]` | `border-bottom-width` | `2px` | `4px` |
| S05 | footer | Footer background | `.site-footer` | `background-color` | `#4D6A7A` | `#6B7F6B` |

## Home (19)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S06 | hero | Big arch color | `.ha-arch` | `color` | `#C7D7E5` | `#D62828` |
| S07 | hero | Flower shape color | `.ha-flower` | `color` | `#A7B69A` | `#FFC300` |
| S08 | hero | Eyebrow text color | `.hero .eyebrow` | `color` | `#6B7F6B` | `#FF3D7F` |
| S09 | hero | Heading font | `.hero h1` | `font-family` | `'Fraunces', Georgia, serif` | `'Courier New', Courier, monospace` |
| S10 | hero | Heading size | `.hero h1` | `font-size` | `64px` | `44px` |
| S11 | hero | Heading color | `.hero h1` | `color` | `#4D6A7A` | `#D62828` |
| S12 | hero | Intro text size | `.hero .lead` | `font-size` | `19px` | `14px` |
| S13 | hero | “Shop plants” button color | `.hero .btn-primary` | `background-color` | `#6B7F6B` | `#D62828` |
| S14 | hero | Space between the buttons | `.hero-actions` | `gap` | `14px` | `40px` |
| S15 | hero | Space above the buttons | `.hero-actions` | `margin-top` | `32px` | `12px` |
| S16 | hero | “Our story” button corners | `.hero .btn-secondary` | `border-radius` | `999px` | `0px` |
| S17 | features | Feature title font | `.feature-card h3` | `font-family` | `'Fraunces', Georgia, serif` | `'Courier New', Courier, monospace` |
| S18 | features | “Peat-free pots” card corners | `.features-grid .feature-card:nth-child(2)` | `border-radius` | `24px` | `0px` |
| S19 | favourites | “This week’s favourites” color | `.section-head h2` | `color` | `#4D6A7A` | `#D62828` |
| S20 | favourites | Plant name size | `.page-home .product-card h3` | `font-size` | `20px` | `30px` |
| S21 | favourites | Price color | `.page-home .price` | `color` | `#4D6A7A` | `#FF3D7F` |
| S22 | newsletter | Newsletter background | `.newsletter-inner` | `background-color` | `#C7D7E5` | `#FFC300` |
| S23 | newsletter | Newsletter text color | `.newsletter p` | `color` | `#4A5A55` | `#D62828` |
| S24 | newsletter | “Subscribe” button color | `.newsletter .btn-primary` | `background-color` | `#6B7F6B` | `#FF3D7F` |

## Shop (5)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S25 | shop | “All plants” heading color | `.page-shop .page-head h1` | `color` | `#4D6A7A` | `#D98B6A` |
| S26 | shop | Price color | `.shop-grid .price` | `color` | `#4D6A7A` | `#D98B6A` |
| S27 | shop | Active filter chip | `.chip.is-active` | `background-color` | `#A7B69A` | `#E9BFA0` |
| S28 | shop | Active filter chip border | `.chip.is-active` | `border-color` | `#A7B69A` | `#E9BFA0` |
| S29 | shop | Plant name size | `.shop-grid .product-card h3` | `font-size` | `20px` | `28px` |

## Product (4)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S30 | product | “Add to cart” corners | `.add-to-cart` | `border-radius` | `999px` | `0px` |
| S31 | product | Description color | `.product-desc` | `color` | `#4A5A55` | `#A7B69A` |
| S32 | product | Price size | `.product-price` | `font-size` | `28px` | `18px` |
| S33 | product | Art panel corners | `.product-hero-art` | `border-radius` | `32px` | `0px` |

## Cart (5)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S34 | cart | Total weight | `.summary-total` | `font-weight` | `700` | `400` |
| S35 | cart | Total size | `.summary-total` | `font-size` | `22px` | `16px` |
| S36 | cart | Checkout button color | `.checkout-btn` | `background-color` | `#4D6A7A` | `#D98B6A` |
| S37 | cart | Thumbnail corners | `.cart-thumb` | `border-radius` | `14px` | `50%` |
| S38 | cart | “Remove” link color | `.remove` | `color` | `#6B7F6B` | `#D98B6A` |

## About (4)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S39 | about | “What we care about” size | `.values h2` | `font-size` | `40px` | `28px` |
| S40 | about | Quote color | `.about-quote blockquote` | `color` | `#6B7F6B` | `#D98B6A` |
| S41 | about | Sun circle color | `.aa-sun` | `color` | `#E9BFA0` | `#8FA7B3` |
| S42 | about | Value card background | `.value-card` | `background-color` | `#E5EBDF` | `#F6E3D6` |

## Journal (3)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S43 | journal | 2nd post title font | `.post-grid .post-card:nth-child(2) h3` | `font-family` | `'Fraunces', Georgia, serif` | `'DM Sans', system-ui, sans-serif` |
| S44 | journal | 3rd post tag color | `.post-grid .post-card:nth-child(3) .tag` | `background-color` | `#C7D7E5` | `#E9BFA0` |
| S45 | journal | Post art height | `.post-art` | `height` | `200px` | `110px` |

## Article (6)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S46 | article | Body text size | `.article-body` | `font-size` | `18px` | `15px` |
| S47 | article | Body line height | `.article-body` | `line-height` | `1.7` | `1.4` |
| S48 | article | Pull-quote border color | `.pull-quote` | `border-left-color` | `#A7B69A` | `#D98B6A` |
| S49 | article | Pull-quote border width | `.pull-quote` | `border-left-width` | `4px` | `10px` |
| S50 | article | Title color | `.article-head h1` | `color` | `#4D6A7A` | `#A7B69A` |
| S51 | article | Banner corners | `.article-banner` | `border-radius` | `32px` | `0px` |

## FAQ (4)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S52 | faq | Question background | `.faq-item summary` | `background-color` | `#C7D7E5` | `#A7B69A` |
| S53 | faq | +/× icon shape | `.faq-icon` | `border-radius` | `50%` | `0px` |
| S54 | faq | Heading size | `.page-faq .page-head h1` | `font-size` | `52px` | `36px` |
| S55 | faq | “Still stuck?” card background | `.faq-aside` | `background-color` | `#E5EBDF` | `#F6E3D6` |

## Contact (4)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S56 | contact | Field corners | `.contact-form .field input, .contact-form .field select, .contact-form .field textarea` | `border-radius` | `12px` | `0px` |
| S57 | contact | Label size | `.contact-form label` | `font-size` | `14px` | `11px` |
| S58 | contact | “Send message” text color | `.contact-form .btn-primary` | `color` | `#FFFFFF` | `#2F3D3A` |
| S59 | contact | Address card background | `.contact-card` | `background-color` | `#4D6A7A` | `#6B7F6B` |

## Sign in (4)

| ID | Area | What | Selector | Property | Figma (correct) | Built site (wrong) |
|---|---|---|---|---|---|---|
| S60 | signin | Card width | `.signin-card` | `width` | `420px` | `520px` |
| S61 | signin | “Create an account” color | `.signin-card .text-link` | `color` | `#4D6A7A` | `#D98B6A` |
| S62 | signin | “Sign in” button color | `.signin-btn` | `background-color` | `#4D6A7A` | `#D98B6A` |
| S63 | signin | “Welcome back” size | `.signin-card h1` | `font-size` | `34px` | `24px` |

> Tip: delete this file before a demo if you don't want the answer key visible in the repo. The site doesn't need it.
