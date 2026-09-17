# ESG & Sustainable Ports — Research Website

A personal academic platform for **Masego Mosupye**, Doctoral Researcher at World Maritime
University (WMU), Malmö, Sweden, presenting the doctoral study:

> **A Unified ESG Framework for Sustainability Management in Ports and Shipping Companies in
> Emerging Maritime Regions**

The site presents the research, its four focus regions, methodology, outputs, and doctoral journey,
alongside an illustrative ESG dashboard and a curated ESG knowledge hub, and invites collaboration
from ports, shipping companies, researchers, and policymakers.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static output, zero JS by default) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, configured CSS-first with `@theme` |
| Content | Astro content collections (Markdown + frontmatter) |
| CMS | Decap CMS at `/admin`, `git-gateway` backend |
| Map | Leaflet 1.9.4 with OpenStreetMap tiles (loaded only on `/research/regions`) |
| Forms | Netlify Forms with honeypot |
| Hosting | Netlify (primary); CPanel migration path documented below |
| Node | 20 or newer (Astro 7 requires Node 20.3+) |

There is **no** `tailwind.config.js` — Tailwind 4 is configured entirely in
`src/styles/global.css` via `@theme`.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

Other scripts:

```bash
npm run build    # static build to dist/
npm run preview  # preview the production build
```

---

## Project structure

```
esg-maritime-research/
├── astro.config.mjs        # site URL, sitemap integration, Tailwind vite plugin
├── netlify.toml            # build settings, legacy redirects, security headers
├── public/
│   ├── admin/              # Decap CMS (index.html + config.yml)
│   ├── uploads/            # CMS media uploads, served from /uploads
│   ├── favicon.svg
│   └── robots.txt
│   └── images/
│       ├── banners/        # page banner photographs (see the table below)
│       ├── regions/        # region card images
│       ├── journey/        # optional timeline photographs
│       └── gallery/        # fieldwork / conference photos
└── src/
    ├── components/
    │   ├── Header.astro            # nav with the accessible Research dropdown
    │   ├── Footer.astro            # four columns, socials, Learning254.com credit
    │   ├── PageBanner.astro        # medium banner for every non-home page
    │   ├── FlipCard.astro          # E/S/G flip cards
    │   ├── Marquee.astro           # drifting journey cards
    │   ├── Modal.astro             # dialog the marquee fills
    │   ├── SocialLinks.astro       # social + academic profile links
    │   ├── DashboardPreview.astro
    │   ├── KnowledgeHubPreview.astro
    │   └── ResearchHubCard.astro
    ├── content/            # Markdown content collections (one folder per collection)
    ├── content.config.ts   # collection loaders + Zod schemas
    ├── layouts/BaseLayout.astro
    ├── pages/              # 11 routes + 404
    └── styles/global.css   # design tokens, base styles, component classes, animations
```

### Page banners

Every page except the homepage uses `<PageBanner>` — a medium banner (`clamp(320px, 45vh, 440px)`,
noticeably shorter than the full-height homepage hero) layering the photograph at 30% opacity with
`mix-blend-mode: luminosity` over the navy gradient, under a dark overlay for text contrast.

Backgrounds are stacked, so a missing file simply falls through to the next layer:

```
local /images/banners/<page>.jpg  →  stock photograph  →  navy gradient
```

Drop photographs into `public/images/banners/` using these filenames and they appear with no code
change: `research.jpg`, `esg-and-ports.jpg`, `regions.jpg`, `methodology.jpg`, `outputs.jpg`,
`journey.jpg`, `dashboard.jpg`, `knowledge-hub.jpg`, `about.jpg`, `contact.jpg`. There is a
reminder of this in `public/images/banners/README.md`.

### Interactive pieces

| Page | What it does |
|---|---|
| `/research/esg-and-ports` | Three flip cards. Click or press Enter/Space to turn a card; `aria-pressed` tracks state and the back content stays in the DOM for screen readers. Under `prefers-reduced-motion` the card does not rotate — both faces stack into one panel. |
| `/research/journey` | Timeline cards drift right-to-left in a seamless loop (the set is rendered twice; the copy is `aria-hidden` and out of the tab order). Hover, focus, or opening the dialog pauses the drift. Selecting a card opens a native `<dialog>` — focus trap, Escape, and focus restoration come from the platform. Under `prefers-reduced-motion` the drift never starts and the cards become a static grid. |
| `/research/methodology` | Asymmetric 12-column grid: intro panel + step 1, steps 2–5, steps 6–9, step 10 + closing panel. Two per row on tablets, single column in source order below 768px. |

### Social links

`SocialLinks.astro` holds every profile URL in one array. **Only the LinkedIn URL is real** — Google
Scholar, ORCID, Instagram, Facebook and X point at each platform's home page as placeholders.
Replace those `href` values, or delete the entries that do not apply. The component renders in two
shapes: `variant="list"` (icon + label, used in the footer) and `variant="row"` (icon buttons, used
on `/about` and `/contact`).

### Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/research` | Research hub |
| `/research/esg-and-ports` | ESG & Ports |
| `/research/regions` | Regions (Leaflet map) |
| `/research/methodology` | Methodology |
| `/research/outputs` | Research outputs |
| `/research/journey` | The Journey |
| `/dashboard` | ESG Dashboard (illustrative) |
| `/knowledge-hub` | ESG Knowledge Hub |
| `/about` | About the Researcher |
| `/contact` | Contact & Collaboration |
| `/404` | Not found |

Legacy short URLs (`/regions`, `/methodology`, `/outputs`, `/journey`, `/esg-and-ports`) redirect
to their `/research/*` equivalents via `netlify.toml`.

---

## Editing content

Content lives in `src/content/` as Markdown files with frontmatter. Schemas are defined in
`src/content.config.ts` and are mirrored exactly by the Decap CMS collections in
`public/admin/config.yml`, so anything saved in the CMS validates at build time.

Note: the config file belongs at `src/content.config.ts`, not `src/content/config.ts`. Astro 6
removed the older location and fails to start if a file is left there.

| Collection | Folder | Used on |
|---|---|---|
| `publications` | `src/content/publications` | `/research/outputs` |
| `regions` | `src/content/regions` | `/research/regions`, homepage chips, dashboard counts |
| `timeline` | `src/content/timeline` | `/research/journey` |
| `frameworks` | `src/content/frameworks` | `/research/esg-and-ports` |
| `resources` | `src/content/resources` | `/knowledge-hub`, homepage preview |

A schema change must be made in **both** `src/content.config.ts` and `public/admin/config.yml`.

### Seed content to replace

- **Publications** — the four entries are seed records describing planned outputs. Replace titles,
  venues, DOIs, and statuses through `/admin` as work is published.
- **Portrait** — `/about` and the homepage About preview use an Unsplash placeholder with a visible
  "Portrait placeholder" overlay. Replace the `src` in `src/pages/about.astro` and
  `src/pages/index.astro` (upload the photo through the CMS to `/uploads`, or drop it in
  `public/uploads/`) and update the `alt` text.
- **Dashboard figures** — every number on `/dashboard` and in the homepage dashboard preview is
  illustrative and labelled as such. Values live in `src/pages/dashboard.astro` and
  `src/components/DashboardPreview.astro`.
- **Stock photography** — region images, the homepage hero, and every page banner fall back to
  Unsplash URLs until real files are added.
- **Social profile URLs** — see the Social links section above; five of the six are placeholders.

---

## Deployment

### Netlify (primary)

1. Push the repository to GitHub.
2. In Netlify, **Add new site → Import an existing project**, and select the repository.
3. Build command `npm run build`, publish directory `dist` (both are already in `netlify.toml`).
4. Deploy. Confirm the site builds and `/admin` loads.
5. **Site configuration → Identity → Enable Identity.**
6. Under **Registration preferences**, set **Invite only**.
7. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway**.
8. **Identity → Invite users** → invite `masegomosupye@gmail.com`.
9. Accept the invite from the email, set a password, and edit at `https://<site>/admin`.

Set the real domain in two places once it is live: `site` in `astro.config.mjs` and the `Sitemap:`
line in `public/robots.txt`.

#### Contact form

The form on `/contact` uses Netlify Forms (`data-netlify="true"` with a `bot-field` honeypot).
Netlify detects it at deploy time. To have submissions emailed to `masegomosupye@gmail.com`, open
**Site configuration → Forms → Form notifications → Add notification → Email notification** and
enter that address. The form does not submit in local development — that is expected.

### CPanel (future migration)

Keep GitHub as the source of truth and build in CI rather than on the server:

1. Add a GitHub Actions workflow that runs `npm ci && npm run build` and deploys `dist/` to
   `public_html` over FTP or SFTP (`SamKirkland/FTP-Deploy-Action` is a common choice). Store the
   host, username, and password as repository secrets.
2. Switch the Decap backend in `public/admin/config.yml` from `git-gateway` to:

   ```yaml
   backend:
     name: github
     repo: <owner>/<repo>
     branch: main
     base_url: https://<your-oauth-proxy-domain>
   ```

3. Deploy an OAuth proxy — a Cloudflare Worker or a Netlify Function both work — and register a
   GitHub OAuth app whose callback URL points at it. Set `base_url` to the proxy's domain.
4. Netlify Forms will no longer be available. Replace the contact form with a CPanel-compatible
   handler (a PHP mail script, Formspree, or similar) and update the `<form>` `action`.
5. Add `.htaccess` rules on CPanel to reproduce the redirects in `netlify.toml`.

---

## Accessibility

Built to meet WCAG 2.1 AA:

- Skip-to-content link, visible on focus
- Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`)
- One `<h1>` per page and no skipped heading levels
- Research dropdown: `<button>` trigger with `aria-haspopup`, `aria-expanded`, `aria-controls`;
  menu with `role="menu"` / `role="menuitem"`; opens on hover, focus, and click; Escape closes and
  returns focus to the trigger; click-outside closes; expands inline on mobile
- `aria-current="page"` on active navigation links
- `role="status"` on the "framework under development" indicators
- Focus-visible rings: `outline: 3px solid #2DD4BF; outline-offset: 3px`
- `prefers-reduced-motion` disables reveal animations, the pulsing dot, the scroll line, the
  marquee drift and float, and the card flip
- Descriptive `alt` text on content images; decorative SVGs marked `aria-hidden="true"`
- Labelled form fields with a required-field key

## SEO

- Unique `{Page Title} | Masego Mosupye` titles and 150–160 character descriptions per page
- Canonical URLs, Open Graph, and Twitter summary-large-image cards
- JSON-LD `Person` schema (job title, WMU affiliation, email, `knowsAbout`, LinkedIn)
- `sitemap-index.xml` via `@astrojs/sitemap`; `robots.txt` allows all and disallows `/admin/`

## Performance

- Static HTML with no framework JavaScript; only small inline scripts for navigation, reveals, and
  the knowledge hub filter
- Leaflet CSS and JS are bundled into a page-specific chunk loaded only on `/research/regions`
- Google Fonts preconnected and loaded with `display=swap`
- The Netlify Identity widget loads only when an invite or recovery link is opened

---

## Licence and credits

Content © Masego Mosupye. Placeholder photography from Unsplash. Map tiles © CARTO, map data ©
OpenStreetMap contributors.
