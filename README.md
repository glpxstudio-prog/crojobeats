# Cannis Rojo Production — crojobeats.com

Static website for Cannis Rojo Production (Wesley Chapel, FL). Beat catalog, services,
membership tiers, session booking, and contact — running free on GitHub Pages.

**Live:** https://glpxstudio-prog.github.io/crojobeats/

---

## Things to fill in before launch

Everything below is marked with a `TODO` comment in the source.

| What | Where | How |
|---|---|---|
| **Real beats** | `index.html` → `<div class="beatlist">` | Upload tagged preview mp3s to `assets/beats/`, then edit each `<article class="beat">` block: `data-src`, `data-title`, `data-genre`, the BPM/key line, and the price. |
| **Beat checkout** | Each beat's "License" button | Replace `href="#contact"` with a Stripe Payment Link, or your BeatStars / Airbit track URL. |
| **Membership prices** | `index.html` → `.tiers` | The $318 Everything Bundle is your live price. The other two tiers show `$—` on purpose — set them or delete those cards. |
| **Subscribe button** | Featured tier | Replace with your Stripe Payment Link for the recurring $318 plan. |
| **Member login** | `.member-portal` | Replace with your Stripe Customer Portal link (Stripe → Settings → Billing → Customer portal). |
| **Booking calendar** | `#booking` section | Google Calendar → Appointment schedules → your schedule → Open booking page → the `</>` embed button → paste the `<iframe>` inside `<div class="calendar">` and delete the `.calendar__fallback` block. |
| **Contact form** | `#contactForm` | Free account at [formspree.io](https://formspree.io), then swap `YOUR_FORM_ID` in the `action`. Until then the form opens the visitor's email app instead. |
| **Social links** | `#contact` list | Add TikTok / YouTube / Spotify next to the Instagram row. |

---

## How memberships work here

GitHub Pages serves static files only — it can't run a login system or take payments
by itself. The site handles that the way most independent studios do:

- **Payments + recurring billing** → Stripe Payment Links (no code, no server)
- **Member self-service** → Stripe Customer Portal (cancel, update card, view invoices)
- **Gated files** (stems, exclusive beat packs) → a private link Stripe emails on purchase,
  or a Drive folder shared with active members

Real accounts with logins and a members-only area on the site itself would need a
backend — Netlify Identity, Supabase, or Memberstack are the usual next steps.

---

## Adding beat previews

1. **Add file → Upload files**, drag your mp3s in.
2. In the filename box, prefix one with `assets/beats/` — GitHub creates the folders.
3. Point the beat row at it: `data-src="assets/beats/yourbeat.mp3"`

Tips: tag the previews (they're publicly downloadable), 128 kbps is plenty, keep each
file under ~4 MB, and never put full trackouts in the repo.

---

## Structure

```
.
├── index.html                # the page
├── assets/
│   ├── css/styles.css        # brand colors live at the top in :root
│   ├── js/main.js            # nav, beat filter, audio player, form
│   └── beats/                # ← your mp3 previews go here
└── README.md
```

## Editing colors

Top of `assets/css/styles.css`:

```css
:root{
  --red:  #e01b2e;   /* primary */
  --bg:   #0a0a0c;   /* page background */
}
```

Change those two and the whole site follows.

---

## Pointing crojobeats.com here (optional)

1. Add a file named `CNAME` at the repo root containing one line: `www.crojobeats.com`
2. At your registrar, add a CNAME record: `www` → `glpxstudio-prog.github.io`
3. For the bare domain, add four A records for `@`:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Settings → Pages → enter `www.crojobeats.com` as the custom domain, tick **Enforce HTTPS**.

DNS takes 10 minutes to a few hours. The current site is on ZenBusiness/Duda — don't cut
DNS over until you're happy with this one.

---

hello@crojobeats.com · +1 (787) 361-8054 · 5023 Suncatcher Drive, Wesley Chapel, FL 33545
