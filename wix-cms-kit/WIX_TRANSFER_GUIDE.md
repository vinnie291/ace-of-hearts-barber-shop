# Ace of Hearts Barbershop — Wix & Wix CMS Transfer Guide (`aceofheartsbarbershop.com`)

This kit contains everything needed to run **Ace of Hearts Barbershop** on **https://www.aceofheartsbarbershop.com/** with full **Wix CMS (Content Manager)** editing so you can update services, prices, gallery photos, reviews, FAQs, shop hours, and contact info directly from the Wix Dashboard table without touching code.

---

## Folder Contents (`wix-cms-kit/`)

- **`collections/`** — 6 ready-to-import CSV files for **Wix CMS (Content Manager)**:
  1. `Services.csv` — All 9 services, prices, durations, categories, badges, descriptions, and direct `?service=` Booksy URLs.
  2. `Gallery.csv` — All 8 portfolio photos with SEO `alt` text and image URLs (also supports native Wix Media Manager images!).
  3. `Reviews.csv` — Verified 5-star client reviews.
  4. `FAQs.csv` — All 6 AEO/SEO Frequently Asked Questions.
  5. `Hours.csv` — Verified shop hours (`Tue`, `Thu–Sat 9 AM–7 PM`, `Sun 9 AM–6 PM`, `Mon/Wed Closed`, `Before/After Hours VIP`).
  6. `SiteSettings.csv` — Global text settings (Hero eyebrow, tagline, headline, subheadline, address, parking note, phone, email).
- **`velo-page-code.js`** — Copy-paste Wix Velo code that connects your Wix CMS Collections to the website and injects Schema.org `BarberShop` JSON-LD into the top-level Wix `<head>`.
- **`assets/`** — Standalone vector SVGs ready for Wix Media Manager:
  - `ace-hero-wordmark.svg` — Exact recreated horizontal `ACE` graphic.
  - `ace-circular-crest.svg` — Circular crest logo.
  - `lattice-pattern.svg` — Seamless `#141414` geometric diamond/floral lattice background tile.

---

## Step 1: Import the 6 CSV Collections into Wix CMS (Content Manager)

1. Open your Wix Dashboard or Wix Editor / Wix Studio for **`aceofheartsbarbershop.com`**.
2. Click **CMS (Content Manager)** in the left sidebar → **+ Create Collection** → **Import from CSV** (or create a collection and click **More Actions → Import CSV**).
3. Create these **6 Collections** (use the exact Collection IDs below so `velo-page-code.js` finds them automatically):

| Collection ID | CSV File to Import | Key Fields |
| :--- | :--- | :--- |
| `Services` | `wix-cms-kit/collections/Services.csv` | `title`, `slug`, `price`, `duration`, `category` (`haircuts`, `beard-shave`, `addons-vip`), `badge`, `booksyUrl`, `description`, `sortOrder` (Number) |
| `Gallery` | `wix-cms-kit/collections/Gallery.csv` | `title`, `alt`, `imageUrl` (Text or Image), `fallbackUrl`, `sortOrder` (Number) |
| `Reviews` | `wix-cms-kit/collections/Reviews.csv` | `clientName`, `serviceName`, `rating` (Number), `quote`, `verifiedSource`, `heartColor`, `sortOrder` (Number) |
| `FAQs` | `wix-cms-kit/collections/FAQs.csv` | `question`, `answer`, `defaultOpen` (Boolean), `sortOrder` (Number) |
| `Hours` | `wix-cms-kit/collections/Hours.csv` | `dayLabel`, `hoursText`, `isClosed` (Boolean), `isHighlight` (Boolean), `sortOrder` (Number) |
| `SiteSettings` | `wix-cms-kit/collections/SiteSettings.csv` | `businessName`, `tagline`, `heroEyebrow`, `heroHeadline`, `heroSubheadline`, `booksyMainUrl`, `phoneDisplay`, `phoneHref`, `email`, `streetAddress`, `suiteFloor`, `cityStateZip`, `parkingNote` |

> **Tip for Gallery Photos in Wix CMS**: The site's built-in `resolveWixImageUrl()` helper automatically supports both external URLs AND native **Wix Media Manager** `Image` fields (`wix:image://v1/...`).

---

## Step 2: Add the Website + Connect Wix CMS (2 Ways)

### Option A (Recommended — Fastest, Exact 1:1 Design + Full Wix CMS Editing)
Use this method to keep the exact pixel-perfect custom layout, sticky header, category filter tabs, interactive gallery slider/lightbox, and recreated `ACE` SVG while editing all content from **Wix CMS**:

1. In Wix Editor / Wix Studio, hide the default Wix header/footer on the Home page (**Pages & Menu → Home → Settings → Layout → No Header & Footer**).
2. Click **Add Elements (+)** → **Embed Code** → **Embed HTML** (or **Embed a Site**).
   - Set its ID in the Properties panel to `#html1`.
   - Stretch it to **Full Width / 100% Viewport Height** (or paste the contents of `index.html` into the HTML Code box, or point it to `https://vinnie291.github.io/ace-of-hearts-barber-shop/`).
3. Turn on **Dev Mode (Velo)** in the top bar of the Wix Editor.
4. Open the bottom **Page Code (`Home.js`)** panel and paste the contents of `wix-cms-kit/velo-page-code.js`.
5. Click **Publish**!
   - Now, whenever you open **Wix Dashboard → CMS** and edit any row in `Services`, `Gallery`, `Reviews`, `FAQs`, `Hours`, or `SiteSettings`, `velo-page-code.js` automatically feeds the updated Wix CMS rows into the live site!

---

### Option B (Native Wix Studio / Wix Editor Sections + Repeaters)
If you prefer building native Wix strips and Repeaters directly on the Wix canvas:

1. **Set Brand Colors in Wix Site Theme**:
   - Background Primary (Charcoal): `#1A1A1A`
   - Background Secondary (Obsidian): `#111111`
   - Card Background: `#161616`
   - Accent 1 (Rich Red — Primary Buttons): `#E51A24`
   - Accent 2 (Deep Blue — Borders/Accents): `#2B52A3`
   - Accent 3 (Warm Gold — Prices, Dividers, Badges): `#E2AA36`
   - Text Primary (Off-White): `#F4F4F4`
2. **Set Brand Fonts**:
   - Headings: **Playfair Display** (Bold / ExtraBold)
   - Body & Buttons: **Montserrat** (Medium / Bold, Uppercase buttons)
3. **Upload Vector Assets (`wix-cms-kit/assets/`)**:
   - Upload `ace-hero-wordmark.svg`, `ace-circular-crest.svg`, and `lattice-pattern.svg` into Wix Media Manager (**Add Elements → Decorative → Vector Art**).
4. **Connect Wix Repeaters to Your Imported CMS Datasets**:
   - Add a **Wix Dataset** for `Services` (sorted by `sortOrder` ascending) and connect it to a 3-column **Repeater** (`#servicesRepeater`), linking the button click action directly to the `booksyUrl` field (opens in a new tab).
   - Add Datasets for `Gallery`, `Reviews`, `FAQs`, and `Hours` and bind them to their respective Repeaters.

---

## Step 3: Copy SEO & AEO Structured Data into Wix SEO Settings

To ensure Google Rich Results and AI Answer Engines (ChatGPT, Perplexity, Google AI Overviews) index `https://www.aceofheartsbarbershop.com/` directly at the top-level domain:

1. In your Wix Dashboard, go to **SEO → SEO Settings → Main Pages → Home**.
2. Under **Advanced SEO → Structured Data Markup**, click **+ Add New Markup** and paste the `<script type="application/ld+json">` block from `index.html` (lines 41–349).
3. Under **SEO → Tools & Settings → Robots.txt Editor**, paste the contents of `robots.txt` so AI search crawlers (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Googlebot`) are explicitly allowed.
