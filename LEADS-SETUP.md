# Lead capture — setup

Every form on the landing page writes to the Google Sheet and emails
`sales@ashlarspaces.com`. Two pieces: a script that lives in the sheet, and one
URL pasted into the site.

**Sheet:** <https://docs.google.com/spreadsheets/d/17XOlTBM5gvR7N2DHAWsf8TJOUPuoqgsfjF5kxZsnV3Q/edit>

I can't deploy the script for you — it runs under your Google account and sends
mail as you, so it has to be created from an account with access to the sheet.
It's about five minutes.

---

## 1. Add the script

1. Open the sheet → **Extensions → Apps Script**.
2. Delete whatever is in `Code.gs`.
3. Paste the entire contents of **`apps-script/Code.gs`** from this repo.
4. **Save** (⌘S). Name the project *Ashlar Tattva Leads*.

## 2. Check it works before deploying

1. In the toolbar, choose the function **`testSetup`** and press **Run**.
2. Google asks for permission the first time — *Review permissions* → pick your
   account → *Advanced* → *Go to Ashlar Tattva Leads (unsafe)* → **Allow**.
   That warning is normal for a script you wrote yourself.
3. A **Leads** tab appears with a header row and one test row, and a test email
   arrives at `sales@ashlarspaces.com`. Delete the test row afterwards.

If the email doesn't arrive, check spam, then confirm the account you authorised
is allowed to send as itself.

## 3. Deploy it as a web app

1. **Deploy → New deployment** → gear icon → **Web app**.
2. Set:
   - **Description:** `Lead capture v1`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← must be *Anyone*, not *Anyone with Google account*
3. **Deploy**, authorise if prompted, then **copy the Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy……/exec`

## 4. Point the site at it

In `assets/js/main.js`, top of the file:

```js
FORM_ENDPOINT: 'https://script.google.com/macros/s/AKfy……/exec',
```

Commit and push. That's it — leads start flowing.

## 5. Optional: chase abandoned forms

Emails you when someone starts the form, leaves a phone or email, and never
finishes.

1. In Apps Script, open the **Triggers** panel (clock icon, left rail).
2. **Add Trigger** → function `notifyAbandoned` → *Time-driven* → *Hour timer* →
   *Every hour* → **Save**.

Each abandoned lead is emailed once — the `Notified` column prevents repeats.
Set `MAIL_ON_ABANDONED = false` at the top of `Code.gs` to turn it off.

---

## What lands in the sheet

One **row per lead**, not per request. The row is created the moment someone
starts typing and fills in as they go, matched on a hidden `Lead ID`. Someone
who types their name, then their phone, then submits produces **one** row that
ends up `complete` — not three rows.

| Column | Notes |
|---|---|
| First seen / Last updated | When they started, when they last touched it |
| **Status** | `partial` = started and left · `complete` = submitted |
| **Intent** | Which button they came from — `Brochure request`, `Floor plan — 2 BHK`, `Auto popup`, `Site visit`, `Cost sheet`… |
| Name, Phone, Email, City, Configuration | As entered |
| Consent | Whether the updates box was ticked |
| Project, Lead ID, Page, Referrer, Device | Context for attribution |
| Notified | When sales was emailed — blank means not yet |

**A partial never overwrites a filled field with a blank.** If someone types a
phone number then clears it, the sheet keeps the number.

## When email goes out

- **Every completed submission** → immediately, subject `[New Lead] …`
- **Abandoned forms** → only with the hourly trigger from step 5, subject
  `[Incomplete] …`, once per lead

Both reply directly to the visitor when they left an email address.

---

## Two things to be aware of

**Partial capture and consent.** The page saves what a visitor has typed before
they press submit. That's normal for lead-gen, but under the DPDP Act it is
personal data collected without an explicit action. Two options if your legal
team wants it tightened:

- Set `PARTIAL_SAVE_MS: 0` in `main.js` — only completed submissions are stored.
- Or add a line near the consent checkbox saying details may be saved as entered.

**Gmail send limits.** A free Gmail account can send ~100 emails/day from Apps
Script; Google Workspace allows ~1,500. If the campaign is expected to exceed
that, the sheet still records everything — only the emails would stop. Worth
watching in the first week.

## If leads stop arriving

1. Open the Web app URL in a browser — it should return
   `{"ok":true,"service":"Ashlar Tattva lead capture"}`.
2. In Apps Script → **Executions**, look for failures.
3. **After editing `Code.gs` you must redeploy** — *Deploy → Manage deployments*
   → pencil → *Version: New version* → **Deploy**. Editing alone changes nothing
   on the live URL. This is the single most common cause.
