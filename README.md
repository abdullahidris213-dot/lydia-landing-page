# Lee's Kitchen: Landing Page

A fast, mobile-first landing page for **Lee's Kitchen** (Ilorin), built to take WhatsApp orders and capture as many leads as possible into MailerLite.

Plain HTML, CSS and JS, with no build step. It's hosted on GitHub Pages.

```
index.html            page markup
assets/css/styles.css brand styles (colours taken from the logo)
assets/js/main.js     CONFIG (edit me!), menu, MailerLite, WhatsApp, pop-ups
assets/img/           logo + dish photos cropped from the launch banner
```

## Edit the placeholders

Almost everything lives in the `CONFIG` object at the top of `assets/js/main.js`:

| What | Where |
|---|---|
| WhatsApp number, phone, email, address | `CONFIG.whatsapp`, `phoneDisplay`, `email`, `address` |
| Instagram / TikTok / Facebook links | `CONFIG.socials` |
| Opening hours | `CONFIG.hours` |
| Discount amount + code | `CONFIG.offer` (also update the text in `index.html` and the MailerLite emails) |
| Menu: dishes, descriptions, prices, photos | `CONFIG.menu` |

Also in `index.html` (search for `PLACEHOLDER`):
- the About story
- the testimonials
- "Rated 4.9" and "Join 250+ food lovers" (change `data-count-to`)

The WhatsApp link in the two MailerLite emails also uses the placeholder number.

## Lead-capture features

- Top offer bar with a weekly countdown (ends Sunday 23:59)
- Hero signup form (email + optional WhatsApp)
- Mid-page offer card ("Limited to the first 100 signups")
- **Before-order prompt:** the first WhatsApp click in a visit offers ₦500 off first, and the code is added to the WhatsApp message. "No thanks" goes straight to WhatsApp, so no orders are lost.
- Exit-intent pop-up on desktop; on mobile it opens after 30s or 60% scroll (once per visit)
- Sticky mobile bar: **Order** + **Get ₦500 off**
- Footer signup, catering quote form, and a "welcome back" state for people already signed up
- Each lead is tagged with a `lead_source` (hero, mid-page, footer, exit-intent, before-order-menu, …) so you can see which spot converts best

## MailerLite setup

Already created in the MailerLite account:

- **Groups:** `Lee's Kitchen - Website Leads`, `Lee's Kitchen - Catering Leads`
- **Custom fields:** `lead_source`, `event_date`, `guest_count`
- **Forms (embedded):** `Lee's Kitchen - Website Signup`, `Lee's Kitchen - Catering Enquiry`. The site posts to these.
- **Automation (inactive):** `Lee's Kitchen - Welcome & ₦500 Code`, which sends the code email, waits 2 days, then sends a reminder

To finish in the MailerLite dashboard:

1. **Forms → each Lee's Kitchen form:** pick any template, add the **Name** and **Phone** fields (and **Lead Source**, **Event Date** and **Guest Count** as needed), then **Save/Publish**. Fields that aren't on the form may be ignored.
2. Decide on **double opt-in** (form settings). If it's on, subscribers must confirm by email before they count, which is safer but means fewer leads. Turning it off captures more leads.
3. **Automations → Welcome & ₦500 Code:** check the sender name and email, update the WhatsApp number in both emails, then **Activate**.
4. Test it: sign up on the live site with your own email and check it appears in the group.

## Hosting (GitHub Pages)

Repo **Settings → Pages → Build and deployment → Deploy from a branch** → choose the branch → `/ (root)` → Save.
The site will be live at `https://abdullahidris213-dot.github.io/lydia-landing-page/`. You can add a custom domain like `leeskitchen.ng` later on the same page.
