# Zavala Ashane Builders — Official Website

Marketing website for **Zavala Ashane Builders LLC**, a residential and commercial
construction company based in The Woodlands, Texas.

Built as a fast, dependency-free static site: plain HTML, CSS, and vanilla
JavaScript — no build step, no frameworks.

---

## Project Structure

```
zavala-ashane-builders/
├── index.html                 # Single-page site (all sections)
├── about.html                 # Company page — philosophy, values, founder
├── our-impact.html            # Company page — Building Beyond Homes
├── 3824-mystic-circle.html    # Property detail page — 3824 Mystic Circle
├── 3814-treasure-island-drive.html  # Property detail page — 3814 Treasure Island Drive
├── robots.txt                 # Search engine directives
├── sitemap.xml                # Sitemap for search engines
├── .htaccess                  # Apache config: HTTPS, redirects, cache (for GoDaddy/cPanel)
├── _redirects                 # Netlify equivalent of .htaccess (www→apex, 404, https, hidden files)
├── netlify.toml               # Netlify build (publish ".") + security & cache headers
├── build-deploy-zip.ps1       # Creates the clean ZIP for upload to Netlify/GoDaddy
├── publish-gh-pages.ps1       # Publishes the site to the gh-pages branch (GitHub Pages)
├── CNAME                      # Custom domain for GitHub Pages (zavalaashanebuilders.com)
├── .nojekyll                  # Tells GitHub Pages to serve files as-is
├── MANUAL.md                  # Master manual: accounts, providers, deploy, DNS, tools
├── DEPLOY.md                  # Full deployment guide (cPanel + DNS routes)
├── README.md
├── _source/                   # Original client assets — NOT deployed
│   ├── client-original-logo.png
│   ├── client-original-photo.jpg
│   ├── mystic.jpeg            # 3824 Mystic Circle photo (source)
│   ├── mysticsalacomedorcocina / recamaraprincipal / bañoprincipal .jpeg  # Gallery sources
│   ├── treasureislandfront / diningkitchen / recamaraprincipal .jpeg      # Gallery sources
│   ├── hero-previous-branded.jpg  # Hero image before the current logo panel
│   ├── hero-with-panel-prev.jpg   # Previous hero.jpg (wordmark panel build)
│   ├── logohero.png           # Current hero source (dark branded artwork)
│   ├── logohome-original.png  # Home header logo source (white background)
│   ├── hero-comparison-before-after.png
│   ├── residentialconstruction.png  # Client photo for the Residential service card
│   ├── stock-project-photos/  # Archived stock project stand-ins (no longer deployed)
│   └── fetch-stock-photos.ps1  # (Re)builds the service card photos
└── assets/
    ├── css/
    │   ├── fonts.css          # Self-hosted @font-face declarations
    │   ├── base.css           # Design tokens, reset, typography, utilities
    │   ├── components.css     # Buttons, header/nav, cards, forms, footer
    │   ├── sections.css       # Per-section layouts (hero, services, etc.)
    │   ├── property.css       # Property detail pages only
    │   └── pages.css          # about.html + our-impact.html only
    ├── fonts/                 # Barlow + Barlow Condensed (woff2, local)
    ├── js/
    │   ├── main.js            # Nav, scroll effects, reveals, form validation
    │   ├── i18n.js            # EN ⇄ ES switcher (engine)
    │   └── i18n-data.js       # EN ⇄ ES dictionary (all visible copy)
    └── images/
        ├── logo.png           # Header/footer logo on inner pages + footer (512×512)
        ├── logohome.png       # Home header logo, trimmed + transparent (285×216)
        ├── hero.jpg           # Hero background — dark branded artwork (1024×768)
        ├── mystic-circle.jpeg # 3824 Mystic Circle photo (property page hero only)
        ├── treasure-island-exterior.jpeg  # 3814 Treasure Island facade (property page hero only)
        ├── property-card-mystic-circle.jpg    # #properties card, 2:1 (1332×666)
        ├── property-card-treasure-island.jpg  # #properties card, 2:1 (1455×728)
        ├── favicon-32.png     # Browser favicon
        ├── apple-touch-icon.png
        ├── og-image.jpg       # Social sharing preview (1200×630)
        ├── residential-construction.jpg   # #services card (830×553, 3:2)
```

## Running Locally

No build tools required. Either:

1. **Open directly:** double-click `index.html`, or
2. **Local server (recommended):**
   ```bash
   # Python
   python -m http.server 8080
   # or Node
   npx serve .
   ```
   Then visit <http://localhost:8080>.

## Customization

### Brand colors & typography

All design tokens live at the top of `assets/css/base.css` inside `:root`.
Change `--amber-500` (accent) or the navy scale to re-theme the entire site.

### Language switcher (English ⇄ Spanish)

A visible **EN / ES** pill sits in the header of all 5 pages, outside `.nav` so it
also shows on mobile (where `.nav` becomes a fullscreen overlay). It remembers the
choice in `localStorage` (`zab-lang`) and applies it on every page.

**How it works — the HTML stays in English, as the single source of truth:**

| File | Role |
| --- | --- |
| `assets/js/i18n.js` | Engine: snapshots every text node + attribute on load, then swaps in Spanish on demand and restores English on toggle. Also updates `<html lang>`, `<title>`, the meta description and the button's `aria-label`. |
| `assets/js/i18n-data.js` | `TEXT` (English → Spanish), `ATTRS` (alt/placeholder/aria-label/title) and `BLOCKS` (paragraphs containing inline `<strong>`/`<a>`, keyed by a `data-i18n-block` attribute). |

**Adding or editing copy:** write the English in the HTML, then add a matching key
to `i18n-data.js`. If a line is not translated, it simply stays in English — it
never breaks. Two gotchas:

- A **paragraph with inline markup** (`<strong>`, `<a>`) is split into several text
  nodes, which would translate as disconnected fragments. Give its element
  `data-i18n-block="some-key"` and put the full Spanish HTML in `BLOCKS`.
- Keys must match the **normalized** English text (whitespace collapsed, trimmed),
  so line wraps in the HTML are fine.

**Checking for gaps:** open the console after switching to ES and run
`ZABuntranslated()` — it lists any visible English string with no Spanish entry.
Proper nouns (addresses, city names, brand) are expected to be in that list.

> ⚠️ **SEO trade-off:** the language is switched client-side on the same URL, so
> search engines index one page per URL (English by default). Ranking the Spanish
> version separately would need real `/es/` URLs with `hreflang` — a much bigger
> change, and it would duplicate every page.

### Hero background

`assets/images/hero.jpg` is a **dark branded image** (1024×768, 4:3) with the
amber accent content on the right half. The hero copy sits over the dark left
side, so it is width-capped in `assets/css/sections.css`:

- **`.hero__title`** — the headline ("Built with Purpose. / Built with Care.")
  is the longest line in the hero, so its size is capped in *two* places: the
  base rule (phones) and the `@media (min-width: 800px)` override (58px). Both
  caps keep the headline on **two lines** and inside the dark area.
- **`.hero__tagline`, `.hero__lead`, `.hero__actions`, `.hero__chips`** — width
  capped in the same `@media (min-width: 800px)` block.

The CSS also lays a dark navy gradient over the image
(`linear-gradient(100deg, …0.94 → 0.38)`), which is what keeps white text
readable. Measured worst-case contrast for the headline: **~13:1** at 1440px,
**~5.8:1** on a 390px phone (AA needs 4.5:1).

**Source and history.** The current hero comes from `_source/logohero.png` and
is encoded to `hero.jpg` at its native size (no crop, no upscale — PNG 670 KB →
JPEG 88 KB). An earlier hero had the wide wordmark
(`assets/images/logo-wide.png`) baked in **opaque**, covering the job-site
signage of `_source/client-original-photo.jpg`; that build is produced by
`_source/bake-hero-panel.ps1` and the previous file is kept at
`_source/hero-with-panel-prev.jpg`. **That script is no longer how the hero is
made** — don't run it unless you want to go back to the panel design.

> ⚠️ **Resolution:** the source is only 1024px wide, so `background-size: cover`
> upscales it — 1.39× at a 1440px viewport, **1.86× at 1920px**, i.e. visibly
> soft on large monitors. A 2000px+ wide version of the same artwork would fix
> it without touching any CSS.

The link-preview image (`assets/images/og-image.jpg`) is regenerated from the
hero with `_source/gen-og-image.ps1` (1200×630 framing). **It still shows the
previous hero** — re-run that script if the social preview should match.

### Property listing pages

Each listing has its own page (`3824-mystic-circle.html`,
`3814-treasure-island-drive.html`) that reuses the site header, footer, buttons
and CTA band, plus `assets/css/property.css` for the listing-only blocks
(`.prop-hero`, `.prop-stats`, `.prop-facts`, `.prop-features`, `.prop-gallery`,
`.prop-specs`).

To wire a new listing:

1. **Hero photo** — add the image to `assets/images/` and point the page's rule
   in `property.css` at it (paths there are relative to the stylesheet, same as
   the home hero):
   ```css
   .prop-hero--mystic { background-image: url("../images/mystic-circle.jpeg"); }
   ```
   A page without a photo yet just omits the rule and gets the navy placeholder.
2. **Gallery** — each photo is a
   `<figure class="prop-gallery__item">` with an `<img class="prop-gallery__img">`
   and a `<figcaption class="prop-gallery__label">` that shows the room name
   over the photo on hover (always visible on touch devices). The grid needs no
   other changes.
3. **Card on the home page** — the listing card in `#properties` links to the
   page; keep the copy, specs and badge (`--coming-soon`, `--available`,
   `--under-contract`, `--sold`) in sync with the detail page. The grid uses
   `repeat(auto-fit, minmax(20rem, 1fr))`, so adding or removing a card needs no
   CSS change — the remaining cards fill the row.
4. Add the new page to `sitemap.xml`.

### Company pages (`about.html`, `our-impact.html`)

Two standalone pages hold the brand story so the home page stays a sales
funnel. They reuse the site header, footer, buttons, section headers and CTA
band, plus `assets/css/pages.css` for their own blocks (`.page-hero`,
`.statement`, `.values__grid`, `.founder`, `.pillars__grid`,
`.impact-actions__grid`).

- **`about.html`** — `#philosophy` (display-type brand statement), `#values`
  (five value cards, 3 over 2 on desktop), `#founder` (portrait + bio) and
  `#closing` (closing brand statement).
- **`our-impact.html`** — "Building Beyond Homes": page hero with the main
  statement, `#commitments` (three pillars), `#impact-in-action` (the 2:1
  numbers strip) and `#closing`.
- The home page links to both: the nav items, the "Meet the Founder" button in
  `#about`, and the slim `.impact-strip` band above the CTA band.
- **Founder photo** — pending. Replace the `.founder__photo-ph` placeholder in
  `about.html` with the commented `<img class="founder__photo-img">` snippet
  right above it (4:5 crop, saved as
  `assets/images/founder-cesar-zavala.jpg`).
- `about.html` carries its own `GeneralContractor` + `Person` JSON-LD; keep the
  founder and contact details there in sync, and bump the `?v=` on
  `pages.css` whenever you edit it.

### ⚠️ Placeholders to replace before launch

| Item | Where | Current placeholder |
| --- | --- | --- |
| Phone number | **all 5 pages** (search `832`) | `(832) 555-0134` — 16 `tel:` links + 4 JSON-LD blocks |
| Email address | **all 5 pages** (search `info@`) | `info@zavalaashanebuilders.com` — 8 `mailto:` links + the form's `data-mailto` |
| Domain | **all 5 pages** + `robots.txt`, `sitemap.xml`, `.htaccess` | ✅ `zavalaashanebuilders.com` (confirmed by the client, applied 2026-10-12) |
| Project photos | `_source/stock-project-photos/` | ✅ Removed from the deployed site — `#projects` became the text-only `#capabilities` block |
| Testimonials | `index.html` (search `TESTIMONIALS — hidden`) | ✅ Section hidden (`hidden`) until real, verified reviews exist |
| Property photos | `3824-mystic-circle.html`, `3814-treasure-island-drive.html` (gallery slots) | Both listings now use real photos; one gallery slot on Treasure Island is still open |
| Service card photos | `index.html` (`#services`) | All 3 have photos — Residential Construction is the client's own; Commercial + Remodeling are existing photos |
| Social links | footer of **all 5 pages** | ⚠️ Facebook/Instagram point to `#` (10 links) — the LinkedIn link is real |
| Business hours | `index.html` (contact section) | Mon–Fri 8–6, Sat by appointment |
| Founder photo | `about.html` (search `PHOTO PENDING`) | Styled "Photo coming soon" placeholder |

### About the removed `#projects` section

The client has no completed U.S. projects yet, so the portfolio-style
`#projects` section was replaced with the text-only `#capabilities` block
("What We Build"). The four stock project photos and their cards/CSS were
removed from the deployed site; the images are archived in
`_source/stock-project-photos/` for reference or for a future portfolio once
real Zavala Ashane project photos are available. `_source/fetch-stock-photos.ps1`
still documents the original Unsplash sources if they are ever needed.

### Wiring the contact form

> ⚠️ **The form is currently hidden.** It carries the `hidden` attribute in
> `index.html` (`#contact`), because no form service is connected yet, so it
> could not deliver anything. To restore it: remove the `hidden` attribute and
> put the contact section back to two columns — `.contact__grid` in
> `sections.css` (the comment there says what to restore). The `.contact-form[hidden]`
> rule exists so the attribute beats the form's own `display: grid`.

The form sends through a real endpoint when one is configured, and otherwise
falls back to opening the visitor's email client with the message pre-filled.

To turn on real submissions:

1. **Formspree / Web3Forms** — paste the endpoint URL into the form's
   `data-form-endpoint` attribute in `index.html`:
   ```html
   <form id="contact-form" action="#" method="post"
         data-form-endpoint="https://formspree.io/f/YOUR_ID" ...>
   ```
   With that set, `main.js` POSTs the form data with `fetch()` and shows the
   success/error state inline.
2. **Netlify Forms** — add the `netlify` attribute to the form and deploy on
   Netlify (no `data-form-endpoint` needed).
3. **No endpoint** — leave `data-form-endpoint` empty and the form opens a
   `mailto:` draft instead (configured by `data-mailto`).

---

## Deployment

Target domain: **`https://zavalaashanebuilders.com`** (GoDaddy).

See **[DEPLOY.md](DEPLOY.md)** for the full step-by-step guide:

- **Route A — Netlify (current host):** the site is a Git-connected project —
  `netlify.toml` publishes the repo root, so every push to `main` redeploys
  automatically (fallback without a repo: drag `zavala-ashane-deploy.zip` into
  Netlify → Deploys). The domain is registered at GoDaddy and already points at
  Netlify (`A @ → 75.2.60.5`, `www →` apex). `_redirects` mirrors `.htaccess`
  (HTTPS, www→apex, friendly 404, hidden internal files) and `netlify.toml`
  carries the security/caching headers.
- **Route B — GoDaddy Web Hosting (cPanel):** run `build-deploy-zip.ps1`, upload
  the ZIP to `public_html`, extract, run AutoSSL. The included `.htaccess`
  handles HTTPS, www-redirects, caching and compression automatically.
  `.htaccess` only applies to Apache hosts.

> **Version control:** the repo is a normal Git checkout. `.gitignore` keeps
> `_source/` (client originals), the deploy ZIP, OS files and editor folders out
> of Git, so a Netlify deploy from the repo never publishes them. `_source/`
> only exists on the local machine — keep a separate backup.

## Technical Notes

- SEO: meta tags, Open Graph, Twitter cards, canonical URL, and
  JSON-LD `GeneralContractor` structured data are included.
- Accessibility: semantic landmarks, skip link, ARIA attributes, keyboard
  support for the mobile menu, visible focus states, and
  `prefers-reduced-motion` support.
- Performance: single preloaded hero image, no JS libraries, deferred script,
  and lazy-loaded below-the-fold images.
- Responsive: on phones the hero is compacted to fit the first screen and the
  card grids (trust strip, services, capabilities, properties, testimonials,
  process) run two per row; services and testimonials go three per row and the
  process four on desktop, while the capabilities cards stay 2 × 2 and stack on
  phones.
- 100% local / offline-friendly: fonts (Barlow + Barlow Condensed, woff2) are
  self-hosted in `assets/fonts/` — the site makes **zero external requests**.
- Maintenance: the header and footer are repeated in **all five** HTML files
  (`index.html`, `about.html`, `our-impact.html` and both property pages), so a
  nav link, phone number or address change has to be applied to each of them.
  Services offered are Residential Construction, Commercial Construction and
  Remodeling & Renovations.
