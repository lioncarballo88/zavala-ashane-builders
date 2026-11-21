# Deployment Guide — Zavala Ashane Builders

Static site (HTML/CSS/JS) — no build step, no database, no server code.
**Domain:** `zavalaashanebuilders.com` — canonical URL: `https://zavalaashanebuilders.com`

---

## What to upload

Only these items:

```
index.html
about.html
our-impact.html
3824-mystic-circle.html
3814-treasure-island-drive.html
robots.txt
sitemap.xml
.htaccess          (Apache/cPanel hosts only — NOT Netlify/Vercel)
_redirects         (Netlify only — mirrors .htaccess)
assets/            (css, fonts, images, js)
```

**Never upload:** `_source/` (original client assets), the `.git/` folder,
`netlify.toml` (Netlify reads it from the repository), or the docs/tooling.
The included `.htaccess` / `_redirects` also hide them as a safety net.

### Create the upload ZIP automatically

From the project folder run:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-deploy-zip.ps1
```

This creates `zavala-ashane-deploy.zip` with exactly the files above
(it excludes `_source/`, `.git/`, `netlify.toml`, docs and tooling
automatically). It prints the full file list and the final size — **check that
the 5 HTML pages are listed**.

---

## Route A — Netlify (current host)

Static bundle: no build step, no server code. `netlify.toml` sets
`[build] publish = "."`, so Netlify publishes the repository root as-is
(`_source/` is excluded from Git, so the client originals never reach the CDN).

> ⚠️ **The previous Netlify site (`preeminent-naiad-7c9ab4.netlify.app`) no
> longer exists** — checked 2026-11-16: that hostname and
> `zavalaashanebuilders.com` both return Netlify's plain-text `404 Not Found`,
> because DNS still points at Netlify but no site claims the hostname.
> Create a new site (below) — **the DNS records do not need to change**.

> 🚫 **2026-11-21 — Netlify is blocked for the custom domain.** The site was
> redeployed as `preeminent-moonbeam-ba3b7f.netlify.app` and it serves all five
> pages correctly, but adding `zavalaashanebuilders.com` fails with:
>
> *"zavalaashanebuilders.com or one of its subdomains is already managed by
> Netlify DNS on another team."*
>
> The domain is still claimed by the Netlify account/team that created
> `preeminent-naiad-7c9ab4` (that account is not accessible). Netlify has no
> self-serve way to release it: either sign in to that old account and remove
> the domain, or open a support ticket (**1–3 days**). Until then, use
> **Route D (GitHub Pages)** for the custom domain and keep the
> `*.netlify.app` URL as a preview.

### A1 — Publish the site

**Option 1 — Git (recommended: auto-deploys, survives a deleted project).**

1. Push this folder to a GitHub repository (see *Git setup* below).
2. Netlify → **Add new site → Import an existing project → GitHub** → pick the repo.
3. **Build command: leave empty.** Publish directory: `.` (already in `netlify.toml`).
4. Every push to `main` redeploys; if the Netlify project is ever deleted or
   paused, re-importing the repo restores it in minutes.

**Option 2 — Manual ZIP (fallback, no repo needed).**

1. `powershell -ExecutionPolicy Bypass -File .\build-deploy-zip.ps1`
2. Netlify → the site → **Deploys** → drag `zavala-ashane-deploy.zip` onto the
   drop zone at the bottom.
3. A ZIP deploy republishes the whole site: anything not in the ZIP disappears.

### A2 — Point `zavalaashanebuilders.com` at the new site

The GoDaddy DNS already has the correct records, so this is only a dashboard step:

| Type | Name | Value | State |
| --- | --- | --- | --- |
| `A` | `@` | `75.2.60.5` | ✅ already set (Netlify apex load balancer) |
| `CNAME` | `www` | `zavalaashanebuilders.com` | ✅ already set (apex) |

1. Netlify → **Domain management → Add a domain** → `zavalaashanebuilders.com`.
2. Add `www.zavalaashanebuilders.com` as an alias of the same site.
3. Set the apex as **primary domain** so `www` redirects to it.
4. **HTTPS → Verify DNS configuration → Provision certificate.** With the `A`
   record already on `75.2.60.5`, verification is immediate; a new site gets its
   own certificate within minutes (the old one is not reused).
5. **Do not touch** the MX, TXT (SPF / Microsoft 365) or autodiscover records —
   email would break.

> The `A`/`CNAME` values are the same for any Netlify site. Only the
> `*.netlify.app` name changes, and the site never references it: all
> canonical / Open Graph / JSON-LD URLs use `zavalaashanebuilders.com`.
>
> **If you ever migrate DNS:** the domain has **Microsoft 365 email**
> (MX → `…mail.protection.outlook.com`). Moving to Netlify DNS means
> re-creating every mail record (MX, SPF, autodiscover, DKIM) there — for this
> domain, keep GoDaddy DNS and maintain only the two web records above.

### Git setup

```powershell
git init -b main
git add -A
git commit -m "Initial commit: static site"
# create an empty repo on GitHub, then:
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

`.gitignore` already excludes `_source/` (client originals), the deploy ZIP,
OS files and editor folders. Only site files, docs and tooling are versioned —
which is exactly what Netlify publishes. Keep a separate backup of `_source/`:
those originals are **not** in the repository.

### Netlify redirects and headers

`.htaccess` is ignored on Netlify (it's an Apache file). It does no harm; it is
kept in the ZIP so the same package still works on cPanel. Redirects live in
`_redirects` — `http`→`https`, `www`→apex, the friendly 404, and the 404s that
hide `_source/`, the docs and the tooling — because Netlify processes that file
on **every** deploy type, including drag-and-drop. `netlify.toml` only holds the
build settings plus the security and caching headers (the `.htaccess`
equivalent: HSTS, `nosniff`, `Referrer-Policy`, and the 1-month CSS/JS /
1-year image+font cache policy). Netlify's own **Force HTTPS** setting also
covers the `http`→`https` case.

---

## Route B — GoDaddy Web Hosting (cPanel)

1. Log in to GoDaddy → **My Products** → your hosting plan → **cPanel Admin**.
2. Open **File Manager** → go into `public_html`.
3. Delete GoDaddy's default placeholder files (e.g. `index.html`, `default.html`).
4. Upload `zavala-ashane-deploy.zip` (File Manager → **Upload**), then
   right-click the ZIP → **Extract** into `public_html`.
5. Confirm that `index.html`, the other 4 HTML pages and `.htaccess` sit at the
   **root** of `public_html`.
   - Don't see `.htaccess`? Enable **Settings → Show Hidden Files** in File Manager.
6. Open `https://zavalaashanebuilders.com` — it should load. Verify the redirects:
   - `http://zavalaashanebuilders.com` → redirects to `https://`
   - `https://www.zavalaashanebuilders.com` → redirects to the apex domain
7. **SSL:** cPanel → **SSL/TLS Status** → **Run AutoSSL** (free certificate).
8. If changes don't show up, clear the browser cache or test in an incognito window.

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| Page loads without styles/images | `assets/` wasn't extracted at root level |
| `about.html` / property pages give 404 | the ZIP was uploaded partially — re-extract the whole ZIP |
| `http` or `www` doesn't redirect | `.htaccess` missing — enable hidden files and re-upload |
| Old version still showing | Hard refresh (Ctrl+F5) — CSS/JS are cached for 1 month by design |
| `ERR_CERT_COMMON_NAME_INVALID` / "La conexión no es privada" | Netlify hasn't issued the Let's Encrypt certificate yet. In Netlify: **Domain management → HTTPS → Verify DNS configuration → Provision certificate**. It requires `A @ → 75.2.60.5` and the `www` alias pointing at the site (the apex `CNAME` above is enough). Certificates appear minutes after DNS verifies (sometimes up to 24 h). |

---

## Route C — Domain only, hosted elsewhere (Vercel / GitHub Pages)

The site is 100% static — drag & drop the folder (excluding `_source/`) or connect a Git repo.

1. Deploy to your host and note their target (server IP or CNAME host).
2. GoDaddy → **My Products → Domain → DNS / Manage DNS**:
   - `A` record — name `@` — value → the host's IP address
   - `CNAME` record — name `www` → the host's target hostname
   - *(or switch the domain's nameservers to the host's nameservers)*
3. Wait for DNS propagation (minutes up to 48 h), then enable HTTPS in the host dashboard.
4. **Important:** `.htaccess` only works on Apache hosts. Leaving it in the
   upload does no harm (it's ignored), but if you want the `http`→`https` and
   `www`→apex redirects, use the host's own config instead — the repo already
   ships `_redirects` for Netlify; use `vercel.json` for Vercel.

---

## Route D — GitHub Pages (custom domain while Netlify is blocked)

Free, allows commercial use, and needs **no nameserver change** (email stays on
Microsoft 365 at GoDaddy DNS). The repo ships everything needed:

- `.github/workflows/pages.yml` — publishes only the public site on every push
  to `main` (docs, tooling, `_source/`, `.htaccess` and Netlify config stay in
  the repo but never reach the CDN).
- `CNAME` — `zavalaashanebuilders.com`.
- `.nojekyll` — serves files as-is (no Jekyll).
- `404.html` is generated at deploy time from `index.html`, so the friendly 404
  behaviour of `.htaccess` / `_redirects` is preserved.

### D1 — Publish

```powershell
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The first push (or **Actions → Deploy site to GitHub Pages →
Run workflow**) publishes to `https://<user>.github.io/<repo>/`.

### D2 — DNS at GoDaddy

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `<user>.github.io` |

- Delete/replace the current `A @ → 75.2.60.5` (Netlify) — **that record is what
  keeps returning Netlify's 404**.
- **Do not touch** MX, TXT (SPF / Microsoft 365) or autodiscover.
- `CNAME www` currently points at the apex; it must point at `<user>.github.io`.

### D3 — HTTPS

Once DNS resolves to GitHub, **Settings → Pages → Custom domain** shows the
domain as verified → enable **Enforce HTTPS**. The certificate is issued by
GitHub (Let's Encrypt) within minutes.

> GitHub Pages cannot apply `.htaccess` / `_redirects`, so the `http`→`https`
> and `www`→apex redirects come from GitHub's own settings (Enforce HTTPS, and
> the `CNAME` canonical domain) instead of the Apache/Netlify files.

---

## Launch checklist

Content still using placeholder data — see `PENDIENTES.md` for the full list.

- [x] **Domain** — ✅ `zavalaashanebuilders.com`, applied everywhere (5 pages,
      `robots.txt`, `sitemap.xml`, `.htaccess`).
- [ ] **Real phone number** — search for `832`. It appears in **16 `tel:` links
      across all 5 pages** (header button, CTA band, contact block, footer) plus
      the `telephone` field in **4 JSON-LD blocks**.
- [ ] **Confirm the email** — it is no longer in the contact block (removed
      2026-10-12) but still appears in the **footer of all 5 pages** (8 `mailto:`
      links), the JSON-LD `email` field, and the form's `data-mailto`.
- [ ] **Real project photos** for `#projects` — the 5 current images are
      **stock (Unsplash), not the client's work**. Replace them and remove the
      `data-placeholder` attribute.
- [ ] **Real testimonials** (2–3, with name + city) — the 3 current ones are
      samples, flagged with a `PLACEHOLDERS` comment in `index.html`.
- [ ] **Facebook / Instagram links** — they point to `#` (2 links × 5 pages).
      The LinkedIn link is already real.
- [ ] **Founder portrait** in `about.html` (search `PHOTO PENDING`).
- [ ] **One more gallery photo** for Treasure Island
      (the `<div class="prop-gallery__ph">` slot).
- [ ] **Contact form** — currently **hidden** (the `hidden` attribute on
      `<form id="contact-form">`). To bring it back: pick a form service, paste
      the URL into `data-form-endpoint`, remove `hidden`, and restore
      `.contact__grid` to two columns in `sections.css`.
- [ ] **Confirm business hours** and the "Bilingual — English & Español" line.
- [ ] Submit `https://<real-domain>/sitemap.xml` in Google Search Console.
