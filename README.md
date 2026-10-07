# GBL — Girls Basketball League

Marketing website for **GBL (Girls Basketball League)**, coached by **Malkie Schulman** in Jerusalem.

The design is inspired by the bold, clean sports layout of [Ready to Ball](https://www.readytb.com/) — full-width hero, strong CTAs, program cards, values band, and coach spotlight — adapted for a girls-focused brand.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, programs, values, coach |
| `league.html` | League details (grades 9–11) |
| `clinic.html` | Clinic details (grades 8–9) |
| `about.html` | Mission and coach Malkie Schulman |
| `register.html` | Links to official Jotform registration |
| `contact.html` | Contact info + on-page inquiry form |

## Run locally

Open any HTML file in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Registration forms

- League: https://form.jotform.com/260521921305043
- Clinic: https://form.jotform.com/261312344566151

## Stack

Static HTML, CSS, and a small vanilla JS file for the mobile nav and contact form feedback. No build step required.


## Regression checks

The site has no build step or existing CI checks. Run the DOM regression tests
with Node.js 22.22.2 (or a newer supported LTS release) and a temporary test-only dependency (no production dependency):

```bash
npm install --no-save --package-lock=false jsdom@30.1.1
node --check js/main.js
node --test tests/regression.cjs
```

The tests cover missing required fields, malformed email, the defensive submit
validation, retained entries, truthful feedback, stale feedback, and both menu
closing paths. jsdom checks DOM behavior; verify native browser validation UI
with this repeatable browser check:

1. Serve the site as above and open `/contact.html` at a 390px-wide viewport.
2. Submit an empty form, then try each missing required field and a malformed
   email. The browser must flag the invalid field, preserve other entries, and
   show no success feedback. Try both clicking Submit and pressing Enter in Email.
3. Complete Parent name, Email, and Message with valid values, leaving Phone
   blank. Submit: feedback must say the message has **not been sent or saved**,
   and all entries must remain. Editing a field must hide the feedback.
4. Inspect the menu button's accessible name and `aria-expanded`: closed is
   `Open menu` / `false`; opened is `Close menu` / `true`. Close via the button,
   then reopen and follow a navigation link; both paths must restore the closed
   state. Repeat the menu check on a page without the contact form.

The inquiry form remains an on-page demo; it does not send or persist messages.
