# Cannis Rojo Production — cannisrojo.com

Static website for Cannis Rojo Production (Tampa, FL). Beat catalog, services, membership, session booking and contact — hosted free on GitHub Pages, with bookings, payments and the CRM running through GoHighLevel.

**Live:** https://cannisrojo.com/

---

## How the pieces fit together

| Piece | Runs on | Notes |
|---|---|---|
| The site | GitHub Pages | Deploys from `main`, repo root. Custom domain set in Settings → Pages. |
| Booking calendar | GoHighLevel | Embedded widget. Charges $45 upfront at booking. |
| Member booking | GoHighLevel | Separate **Member Session** calendar, payments off, so members don't pay twice. |
| Contact form | GoHighLevel | Submissions land in the CRM as contacts. |
| Payments | Stripe, via GoHighLevel | Stripe is connected to the sub-account over OAuth; GHL creates the charges. |
| Membership checkout | GoHighLevel payment link | $300/month or $69.23/week, buyer picks at checkout. |
| DNS | GoDaddy | A records to 185.199.108-111.153, `www` CNAME to `glpxstudio-prog.github.io`. |

---

## Prices as shown on the site

| Service | Price |
|---|---|
| Recording, in studio | $45/hour |
| Mobile recording, at your location | $60/hour |
| Mix & master | $200/song |
| Premium beat license | $50 |
| Exclusive beat | $150 |
| Membership | $300/month, or $69.23/week |

Membership includes 8 hours of recording, an exclusive beat, a full mix and a master. Booked a la carte that comes to $710.

---

## Member session tracking

Two published GoHighLevel workflows handle the 8-hour allowance.

**Member session counter + 8th booking alert.** On every booking on the Member Session calendar, adds 1 to the contact's `Member Sessions This Month` field. When that reaches 8 or more, it emails jaesteva00@gmail.com with the contact's name, email and current count.

**Monthly reset of member session counter.** Runs on the 1st of each month at 00:15 and sets the field back to 0.

Two things this does **not** do, by design. It counts bookings, not hours, so a 2-hour session still counts as 1. And it alerts rather than blocks — nothing stops a member booking a 9th session. The Member Session calendar is also a private link rather than a gated page, so anyone with the URL could book on it.

---

## Still to do

| What | Where | How |
|---|---|---|
| Beat previews | `index.html`, the beatlist block | All four rows point at `assets/beats/placeholder.mp3`, which does not exist, so play does nothing. Upload tagged preview mp3s to `assets/beats/` and set each row's `data-src`, `data-title`, `data-genre` and BPM/key line. |
| License buttons | Each beat's License button | Currently `href="#contact"`. Point at a GoHighLevel payment link once the beats are real. |
| Member login | The member-portal block | Still the old Duda URL (crojobeats.com/signin). Needs the real GHL portal link. |
| Calendar hours | GoHighLevel, Calendars | The site advertises "any time, day or night, seven days a week". Set both Studio Session and Member Session availability to match, or soften the wording. |

---

## Adding beat previews

Use **Add file → Upload files** and drag the mp3s in. In the filename box, prefix one with `assets/beats/` so GitHub creates the folder. Then point the beat row at it with `data-src="assets/beats/yourbeat.mp3"`.

Tag the previews, since they are publicly downloadable. 128 kbps is plenty, keep each file under about 4 MB, and never put full trackouts in the repo.

---

## Files

| Path | What it is |
|---|---|
| `index.html` | The page. |
| `CNAME` | Custom domain for GitHub Pages. |
| `assets/css/styles.css` | Brand colors live at the top under `:root`. |
| `assets/js/main.js` | Nav, beat filter, audio player, form. |
| `assets/banner.jpg` | Hero artwork, with the wordmark baked in. |
| `assets/logo-mark.png` | CR monogram, used in the nav and footer. |
| `assets/logo-wordmark.png` | Full wordmark, referenced in the schema.org data. |
| `assets/og-card.jpg` | Social share image. |

---

## Editing notes

Brand colors are CSS variables at the top of `styles.css` under `:root`.

`styles.css` is loaded with a `?v=N` query string. **Bump that number whenever you change the CSS**, otherwise the GitHub Pages CDN serves the old file for hours.

The `.calendar iframe` rules use `!important` on purpose. GoHighLevel's `form_embed.js` sets inline styles that hide the booking widget, so removing those rules makes the calendar disappear.

Each beat article carries its own `data-genre`, which the filter chips read.
