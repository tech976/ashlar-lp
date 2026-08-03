# Ashlar Tattva — Asset Specifications

The reference deck asked "Kindly share size" on several slides. These are the exact
dimensions the build is coded against. Every image in `assets/img/` is a labelled
placeholder at the correct ratio — drop the real file in under the same filename and
it works with no code change.

Deliver photos as **JPG or WebP**, logo and QR codes as **SVG or PNG**. Keep every
photographic file **under 400 KB** compressed.

---

## Brand system — resolved from ashlarspaces.com

The deck said "kindly use corporate fonts" without naming them. The live corporate
site declares both the fonts and the colours, and this build now uses them verbatim.

### Colours

| Token | Hex | Used for |
|---|---|---|
| `--teal` | `#16494d` | Headings, highlight strip, enquiry band, "Book Site Visit" |
| `--teal-light` | `#1e5f64` | Hovers |
| `--teal-dark` | `#0e3235` | Utility bar, footer, image scrims |
| `--orange` | `#f28021` | Primary CTAs, icons, rules, active states |
| `--orange-light` | `#ff9436` | Icons on dark grounds |
| `--orange-dark` | `#d96a1a` | Button hover, section eyebrows |
| `--cream` | `#fff5ec` | Alternating section grounds |
| `--ink` | `#333333` | Body text |

The page is **white-dominant** with cream alternating bands; teal and orange are
accents. All eight tokens sit at the top of `assets/css/styles.css` and are the only
place colour is defined.

### Fonts

Mirrored from `ashlarspaces.com`, role for role:

| Role | Corporate face | Status here |
|---|---|---|
| Headings | **Adobe Jenson Pro** (`Ajensonpro`) | Declared first; **stand-in in use** — see below |
| Body copy | **Rubik** 400 | ✅ in use (400 is what their site actually renders) |
| Nav links | **Lato** 400 | ✅ in use |
| Numeric figures | **Manrope** 700 | ✅ in use (location distances) |

Three of the four are exact. The fourth needs your help:

> **Adobe Jenson Pro does not currently load on ashlarspaces.com either.**
> Their stylesheet declares
> `@font-face { font-family: Ajensonpro; src: url('../fonts/ajensonpro-regular.ttf'); /* Assuming path based on standard structure */ }`
> — and that file returns **404** at every path. Verified by loading their live site:
> headings there render in **Times**, the browser's default serif, not Jenson.

So the corporate site has a broken font right now. Until the real file arrives,
**Libre Baskerville** stands in — which is the fallback *their own stylesheet names*:

```css
/* ===== BRAND FONTS ===== */
/* Removed local Baskerville Old Face as file is missing. Using Libre Baskerville as fallback. */
```

It's a screen-designed serif with a large x-height, so it reads far better at small
sizes than a display face would.

The stack already prefers the real face, so **no code change** is needed once you have it:

```css
--serif: 'Ajensonpro', 'Adobe Jenson Pro', 'Libre Baskerville', Georgia, serif;
```

To activate, either drop `ajensonpro-regular.woff2` into `assets/fonts/` and add an
`@font-face` naming the family `Ajensonpro`, or paste in the Adobe Fonts kit script.

**Please ask the client for the working font file — and tell them their live site is
silently missing it.**

### Accessibility note on the brand orange

White text on brand orange `#f28021` measures **2.66:1**, below the WCAG AA minimum
of 4.5:1. Every other text/background pair on the page passes (152 checked). This
affects the CTA buttons and the G+23 badge.

The brand orange is kept as-is, because matching the corporate identity was the
brief. If accessibility is preferred, the on-brand fix is one line — switch button
text from white to the brand's own dark teal:

| Option | Contrast | Note |
|---|---|---|
| White on `#f28021` (current) | 2.66 | matches ashlarspaces.com |
| **`#0e3235` on `#f28021`** | **5.17 ✅** | passes AA, both colours already in the palette |
| White on `#a8500d` | 5.50 ✅ | passes, but a visibly browner orange |

Your call — say the word and I'll switch it.

---

## Images

### Hero
| File | Size (px) | Notes |
|---|---|---|
| `hero-desktop.jpg` | **1920 × 1080** | Pure banner — **no text is overlaid**, so the image can be a full composed key visual. Displayed at up to 600 px tall, cropped to fill. |
| `hero-mobile.jpg` | **900 × 1300** | Portrait crop, used below 760 px. |

### Overview
| File | Size (px) | Ratio |
|---|---|---|
| `overview.jpg` | **1000 × 1150** | 4:5 portrait — the main image |
| `overview-2.jpg` | **800 × 600** | 4:3 — the smaller image offset over its corner |

### Amenities
Icons are **inline SVG** in the page — no image files needed. If the client has their
own icon set, supply **SVG on a 48 × 48 viewBox** (stroke-based) and they drop in.

### Floor plans
| File | Size (px) | Ratio |
|---|---|---|
| `floorplan-1bhk.jpg` | **1200 × 900** | 4:3 |
| `floorplan-2bhk.jpg` | **1200 × 900** | 4:3 |

Send the **unblurred** originals — the blur is CSS and lifts on form submit.

### Gallery
Six images. The first is the large feature tile, the rest fill a 3 × 3 grid.
| File | Size (px) | Ratio |
|---|---|---|
| `gallery/01.jpg` … `06.jpg` | **1400 × 900** | 14:9 |

Captions are set in `index.html` (Elevation, Entrance Lobby, Amenity Deck,
Landscaped Podium, Sample Residence, Site Progress) — change them to match whatever
you send. **No location background image is needed.**

### Branding
| File | Size | Notes |
|---|---|---|
| `logo.png` | 305 × 165 | ✅ **supplied** — taken from ashlarspaces.com, used in the white header |
| `logo-light.png` | 302 × 148 | ✅ **supplied** — white version, used in the dark footer |
| `favicon.svg` | 64 × 64 | Browser tab icon |
| `rera-qr-a.png` | **300 × 300** | MahaRERA QR, A Wing (P51700027399) |
| `rera-qr-b.png` | **300 × 300** | MahaRERA QR, B Wing (PR1330002600631) |

---

## Still needed from the client

1. **Adobe Jenson Pro** — the working font file (**it 404s on ashlarspaces.com too**).
2. **All photography** listed above.
3. **Where leads should go** — CRM webhook URL or an email endpoint. Set it in
   `assets/js/main.js` → `CONFIG.FORM_ENDPOINT`.
4. **Instagram and Facebook URLs** for the footer.
5. **Privacy Policy, Terms and Disclaimer** copy — footer links are placeholders.
6. **Pricing and carpet areas** — not in the reference deck. The floor-plan cards
   currently read "On Request".
7. **Amenity check** — the deck lists six. Confirm nothing is missing before launch.
8. **The orange-CTA contrast decision** — see the accessibility note above.
