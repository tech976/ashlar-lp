# Ashlar Tattva — Landing Page

Lead-generation landing page for **Ashlar Tattva by Ashlar Spaces**, Titwala West.

Plain HTML / CSS / JS. No build step, no dependencies, no framework. Drop it on any
host (Hostinger, cPanel, Netlify, Vercel, S3) and it runs.

```
index.html            the page
thank-you.html        post-submit page, personalised by which CTA was used
assets/css/styles.css one stylesheet; brand tokens at the top
assets/js/main.js     nav, reveals, lightbox, modal, forms
assets/img/           placeholders — see ASSET-SPECS.md
ASSET-SPECS.md        image sizes + the corporate font question
```

Run it locally:

```bash
cd "path/to/Ashlar"
python3 -m http.server 8080     # then open http://localhost:8080
```

---

## Design

White-dominant with cream alternating bands, teal and orange as accents — matching
the client's own site and the Ritz Europa reference rather than the deck's grey
wireframes. Dense and information-first: every screen carries facts a buyer scans for.

Colours, **logo files** and fonts are the client's real assets, taken from
`ashlarspaces.com` rather than invented: teal `#16494d`, orange `#f28021`, and their
four-font system — Rubik (body), Ajensonpro (headings), Lato (nav), Manrope (figures).
Section placement follows the client's own reference site, vikasritzeuropa.com.
See `ASSET-SPECS.md` for the font table and the Adobe Jenson issue.

Copy is brochure-plain and uses the deck's own section headings — "Amenities Crafted
Around A Green Life", "Well Connected, Well Positioned", "Exclusive Photo Gallery Of
Ashlar Tattva".

## Sections

1. **Utility bar** — MahaRERA numbers, phone, email
2. **Header** — sticky, white, with Enquire Now
3. **Hero** — full-bleed photo, project name, USP list, Enquire Now + View Floor Plans
4. **Highlights card** — 5 icon facts on teal, overlapping the hero edge
5. **Overview** — two-image collage with a G+23 badge, copy, tick list, two CTAs
6. **Amenities** — 6 circular icon tiles that fill orange on hover
7. **Location** — 4 cards with time and distance, plus a **Google map** and Get Directions
8. **Floor plans** — blurred 1 / 2 BHK, Unlock Floor Plan → popup → thank-you
9. **Gallery** — 6-image grid with a feature tile, click to open a lightbox
10. **FAQ** — 6-question accordion, one panel open at a time
11. **Enquiry** — teal band, contact details + form
12. **Footer** — about, contact, quick links, MahaRERA QRs

Plus floating WhatsApp, back-to-top, and a mobile Call / WhatsApp / Enquire dock.

## Leads

Every CTA and both forms — the main enquiry form and the floor-plan modal — feed one
handler. Set the endpoint in `assets/js/main.js`:

```js
var CONFIG = {
  FORM_ENDPOINT: 'https://your-crm-or-webhook',
  THANK_YOU_URL: 'thank-you.html'
};
```

It receives a JSON `POST`:

```json
{
  "intent": "Floor plan — 2 BHK",
  "project": "Ashlar Tattva",
  "name": "…", "phone": "…", "email": "…",
  "city": "…", "configuration": "2 BHK", "consent": "on",
  "page": "https://…", "submitted_at": "2026-08-03T…Z"
}
```

`intent` records which CTA produced the lead — `Register interest`,
`Brochure request`, `Site visit`, or `Floor plan — 1/2 BHK` — so the CRM gets them
already segmented, and the thank-you page tailors its message to match.

With `FORM_ENDPOINT` empty (current state) submissions validate, log to the console
and redirect, so the whole flow demos before the CRM exists.

Validation: required fields, Indian 10-digit mobile, email format, hidden honeypot.

## Verified

Checked in Chromium at 1440 px and 390 px:

- No JS errors; no horizontal overflow at either width
- Both forms (main enquiry, floor-plan modal) validate and submit
- Floor-plan unlock → modal → thank-you names the right plan on arrival
- Map iframe and Get Directions both point at the site address
- Bad name, email and phone all rejected; the page does not navigate
- Every CTA writes the correct `intent`
- Lightbox opens on the right image, arrows and keyboard both step it, Escape closes
- Mobile menu and sticky dock both work
- Reduced motion respected; focus outlines visible

## Engineering quality

Things a client won't see but a Lighthouse run, a screen reader or Google will:

- **Layout stability** — every image carries intrinsic `width`/`height`, so nothing
  jumps as the page loads. Measured **CLS 0.0009** (Google's "good" threshold is 0.1).
- **LCP** — the hero image is `preload`ed with `fetchpriority="high"`, split by
  media query so mobile never downloads the desktop file. Everything below the fold
  is `loading="lazy"` and `decoding="async"`.
- **Accessibility** — every input has a real `<label>`; every section has an
  accessible name via `aria-labelledby`; decorative SVGs are `aria-hidden`; the
  accordion is a real `<button>` with `aria-expanded` and works on Enter/Space; the
  modal traps focus and restores it on close; focus outlines are visible throughout.
- **Structured data** — one JSON-LD graph with `Organization`, `ApartmentComplex`
  (address, amenity list, developer) and `FAQPage`, so the FAQ is eligible for rich
  results in Google.
- **Social** — Open Graph with image dimensions, plus a Twitter summary card.

Every claim above was verified in Chromium, not assumed.

## Before go-live

- [ ] Adobe Jenson Pro — the real font file (**it 404s on ashlarspaces.com too**)
- [ ] Decide on the orange-CTA contrast trade-off (`ASSET-SPECS.md`)
- [ ] Replace placeholder images
- [ ] Set `FORM_ENDPOINT`
- [ ] Instagram / Facebook URLs
- [ ] Privacy, Terms, Disclaimer pages
- [ ] Real MahaRERA QR images
- [ ] Analytics / GTM and the Meta Pixel
- [ ] Point `<link rel="canonical">`, `og:url` and `og:image` at the live domain
- [ ] Confirm the possession timeline, then add it to the FAQ (deliberately left
      vague — it isn't in the brief and shouldn't be guessed)
