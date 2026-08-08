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
| `--teal-dark` | `#0e3235` | Modal / lightbox overlays, image scrims |
| `--orange` | `#f28021` | Primary CTAs, icons, rules, active states |
| `--orange-light` | `#ff9436` | Reserved — not currently used on the light palette |
| `--orange-dark` | `#d96a1a` | Button hover, section eyebrows |
| `--ink` | `#333333` | Body text |

**Section grounds** — no dark fills anywhere. White is the base; a warm orange wash
and a cool grey wash alternate over it so the brand reads as an accent, never as a
block of colour:

| Token | Hex | Used for |
|---|---|---|
| `--surface-warm` | `#fff7f0` | Highlights, Floor Plans — orange at ~6% |
| `--surface-cool` | `#f3f6f6` | Location, Gallery, banner backing |
| `--surface-foot` | `#eaefef` | Footer, one step deeper |

Order down the page: banner → white → warm → white → cool → warm → cool → white →
footer. No two adjacent sections share a ground.

All tokens sit at the top of `assets/css/styles.css` and are the only place colour
is defined.

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

## Images — DELIVERED ✅

All 18 supplied images are processed and live. They were mapped **by what each
picture shows**, not by filename — the numbering in the delivery didn't match the
slot order (e.g. `loc-rail.jpg/2.jpg` is the train, `1.jpg` is the school).

| Slot | Source file | Content |
|---|---|---|
| `hero-desktop.jpg` | `hero-desktop.jpg/hero-desktop.jpg.jpg` | Composed 16:9 banner |
| `hero-mobile.jpg` | `900 x 1300/ashalar landing page.jpg` | Composed portrait banner |
| `overview.jpg` | `overview.jpg/…-02.jpg` | Tower render at dusk |
| `overview-2.jpg` | `800 x 600/800 x 600.jpg` | Couple on a balcony |
| `highlights.jpg` | `highlights.jpg/highlights.jpg` | Aerial site view |
| `loc-rail.jpg` | `loc-rail.jpg/2.jpg` | Train → Railway & Transit |
| `loc-road.jpg` | `loc-rail.jpg/3.jpg` | Aircraft → Airways & Roadways |
| `loc-edu.jpg` | `loc-rail.jpg/1.jpg` | School → Education & Healthcare |
| `loc-life.jpg` | `loc-rail.jpg/4.jpg` | Grocery → Essential Services |
| `floorplan-1bhk.jpg` | `floorplan…/…-17.jpg` | Refuge floor plate — **see note** |
| `floorplan-2bhk.jpg` | `floorplan…/…-18.jpg` | Refuge floor plate — **see note** |
| `gallery/01.jpg` | `gallery-bg.jpg/…-09.jpg` | Elevation (feature tile) |
| `gallery/02.jpg` | `gallery-bg.jpg/…-10.jpg` | Entrance lobby |
| `gallery/03.jpg` | `gallery-bg.jpg/…-12.jpg` | Gym |
| `gallery/04.jpg` | `gallery-bg.jpg/…-11.jpg` | Indoor games |
| `gallery/05.jpg` | `gallery-bg.jpg/…-13.jpg` | Children's play area |
| `rera-qr-a.png` | `rera-qr-a.png/…-14.jpg` | QR — **see note** |
| `rera-qr-b.png` | `rera-qr-b.png/…-15.jpg` | QR — **see note** |

Every file was resized to the exact spec dimension, centre-cropped where the ratio
differed, and compressed to **under 400 KB** (largest is 338 KB). Measured CLS after
the swap: **0.0015**.

### Four things the client needs to resolve

**1. The MahaRERA QR does not match either registration number.**
`…-14.jpg` decodes to:
`CertificateNo=P51800027667&Scantype=PromoterLoginQRCode`
That is **P51800027667** — not `P51700027399` (A Wing) and not `PR1330002600631`
(B Wing). `…-15.jpg` points to `maharerait.maharashtra.gov.in/project/view/58171`,
which doesn't name a certificate. The QR images are in place but the pairing to
"A Wing" / "B Wing" is unverified. **This is a compliance item — confirm before launch.**

**2. The banner contradicts the location table.**
The hero banner reads "**2 Mins** walk from Titwala railway station". The brief, and
the Connectivity section built from it, say "**05 Min · 500 M**". Both now appear on
the same page. 500 m in 2 minutes isn't a walking pace, so the brief looks right —
but the client should confirm which figure to publish.

**3. Both floor plans are the same drawing type, and neither is a unit plan.**
`…-17` and `…-18` are both titled "**Refuge Floor Plan (7th, 12th, 17th)**" — whole
floor plates, not 1 BHK / 2 BHK apartment layouts. The source folder is named
"floorplan- ( demo floor plan)". They're installed so the section works, but the
cards label them 1 BHK and 2 BHK, which the drawings don't support.

**4. Pricing is now known but not published.**
The banner states "1 & 2 BHK Starting From **₹30 Lakhs** Onwards*". I have **not**
put this on the floor-plan cards, which still read "On Request" — the banner gives a
project-wide starting price, not a per-configuration one, and stating ₹30 L against
the 2 BHK could be wrong. Send per-config pricing and carpet areas and it goes in.

### Also worth knowing

- **Five gallery images were supplied, not six.** The grid was re-laid to 4 columns
  so the feature tile plus four thumbnails form a clean rectangle with no gap.
- **`overview-2` arrived at 3:2, spec was 4:3** — centre-cropped, subject unaffected.
- The banner also carries copy not in the brief: "Largest Carpet Area 1 & 2 BHK Home"
  and "Pre Launch Offer Available". Say the word if either should appear as page copy.

---

## Original size reference

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

*(A `gallery-bg` backdrop was previously specified. It has been dropped — the
section now sits on a light ground, so a darkened photo backdrop no longer fits.
**One less image to supply.**)*

Captions are set in `index.html` (Elevation, Entrance Lobby, Amenity Deck,
Landscaped Podium, Sample Residence, Site Progress) — change them to match whatever
you send. **No location background image is needed.**

### Branding
| File | Size | Notes |
|---|---|---|
| `logo.png` | 305 × 165 | ✅ **supplied** — taken from ashlarspaces.com, used in the white header |
| `logo-light.png` | 302 × 148 | ✅ supplied — white version. **Currently unused** now the footer is pale; kept in case a dark element is added later. |
| `favicon.svg` | 64 × 64 | ✅ built — browser tab icon |
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
