# Content plan

Pages that answer questions Cancelly's future users are likely to search for. Every idea stays inside what Kitovo and Cancelly actually do: Cancelly is a free trial reminder, not a budgeting app, and it doesn't cancel anything for you.

**What this plan is not based on:** keyword volume data. None was available here, so these are reasoned guesses at real questions, not measured demand. After launch, check them against the **Queries** tab of Search Console's Performance report, and drop or reorder ideas based on what people actually search for.

**Where they would live:** the site has no guides or blog section yet. A `/guides/<slug>/` section built on an Astro content collection would fit the existing structure. Each guide would be linked from the Cancelly page and added to the sitemap, which the build check enforces. That's a separate piece of work; drafts stay in `docs/seo/drafts/` until it exists.

**Before publishing any of these:** fill in every `TODO(kitovo)`. Steps that describe other companies' apps (Google Play, banks) must be checked against their current help pages the same week you publish, because those screens change.

| # | Target question | Search intent | Suggested title | Status |
|---|---|---|---|---|
| 1 | How do I remember to cancel a free trial? | Informational | How to remember to cancel a free trial before you're charged | **Draft written** |
| 2 | Do I have to give an app my bank login to track trials? | Informational / comparison | Can you track free trials without giving an app your bank login? | **Draft written** |
| 3 | How do I cancel a subscription on Google Play? | Informational (task) | How to cancel a Google Play subscription on Android | Idea |
| 4 | How do I find out when my free trial ends? | Informational | How to find the exact day your free trial turns into a charge | Idea |
| 5 | What happens when a free trial ends? | Informational | What happens when a free trial ends, and how to decide in time | Idea |
| 6 | Is a calendar reminder enough for free trials? | Commercial investigation | A free trial reminder app or a calendar alert: which works better? | Idea |
| 7 | I forgot to cancel a free trial. Can I get my money back? | Informational (urgent) | Forgot to cancel a free trial? What you can try next | Idea |
| 8 | What should I check before starting a free trial? | Informational | A short checklist before you start any free trial | Idea |
| 9 | Why am I not getting my trial reminder emails? | Support / informational | Not getting Cancelly reminder emails? How to fix it | Idea |
| 10 | What does Cancelly do with an email I forward to it? | Informational / trust | What happens when you forward a trial email to Cancelly | Idea |
| 11 | How do I see all the subscriptions I pay for on Android? | Informational | How to find every subscription you pay for on your Android phone | Idea |
| 12 | Free trial, intro price or discounted first month: what will I pay? | Informational | Free trial or intro offer? How to tell what you'll actually pay | Idea |
| 13 | How do I delete my Cancelly account and data? | Navigational / support | How to delete your Cancelly account and everything in it | Idea |

---

## Outlines

### 1. How to remember to cancel a free trial before you're charged
Draft: [`drafts/01-remember-to-cancel-a-free-trial.md`](drafts/01-remember-to-cancel-a-free-trial.md)

### 2. Can you track free trials without giving an app your bank login?
Draft: [`drafts/02-track-free-trials-without-bank-login.md`](drafts/02-track-free-trials-without-bank-login.md)

### 3. How to cancel a Google Play subscription on Android
- Short answer first: where subscriptions live in the Play Store app.
- Step-by-step with screenshots. `TODO(kitovo)`: write the steps from Google's current Play Help page and your own phone. Don't write them from memory.
- What cancelling does and doesn't do, e.g. whether access continues to the end of the paid period. `TODO(kitovo)`: confirm from Google's help page.
- Trials started through Google Play vs. trials started on a service's own website, where you cancel with the service.
- Close: if the charge date is the problem, add it to Cancelly. Link to `/apps/cancelly/`.

### 4. How to find the exact day your free trial turns into a charge
- Where the date usually shows up: the "your trial has started" email, the sign-up screen, the service's account or billing page, and Google Play subscriptions for trials bought through Play.
- If the date is unclear, use the earliest date the service could charge you. Being early is safe; being late is not. (Same advice as the Cancelly support page.)
- Watch for trials counted in days from sign-up vs. ones that end on a calendar date. `TODO(kitovo)`: add real examples only if you have them.
- Forward the confirmation email to Cancelly and it reads the date. If it can't read it with confidence, it asks you to confirm.

### 5. What happens when a free trial ends, and how to decide in time
- Many trials turn into paid subscriptions automatically unless you cancel. Phrase it that way: terms vary, so check each one.
- The three things to know for every trial: the charge date, the price, and how to cancel.
- Keep vs. cancel: a decision, not a default. Cancelly's three heads-ups give you three chances to make it.
- What Cancelly won't do: cancel for you or stop a merchant from charging. Link to `/disclaimer/`.

### 6. A free trial reminder app or a calendar alert: which works better?
- Be fair. A calendar is free, already on your phone, and fine for one trial.
- Where a dedicated app helps: one place for every trial; three reminders scheduled automatically (three days before, the day before, the last morning); dates worked out in your local time zone; forwarding the confirmation email instead of typing; a record of past trials, including what you avoided paying.
- Where it doesn't: if you rarely start trials, a calendar alert is enough. Say so.
- `TODO(kitovo)`: add a screenshot pair (calendar event vs. Cancelly trial detail).

### 7. Forgot to cancel a free trial? What you can try next
- First, cancel now, so the next charge doesn't happen too.
- Contact the service and ask. Policies differ by company.
- Purchases made through Google Play have their own refund process. `TODO(kitovo)`: link Google's current refund help page; don't paraphrase its rules from memory.
- Kitovo isn't a financial adviser: keep the advice practical and say that clearly (same line as the disclaimer).
- Prevention: add your next trial to Cancelly.

### 8. A short checklist before you start any free trial
- The charge date, the price after the trial, how to cancel (app, website or Google Play), and whether cancelling ends access straight away or at the end of the period.
- Save the confirmation email; it's the best record of the terms.
- Add the trial to Cancelly in about ten seconds, or forward that email.
- Works well as a printable or shareable one-pager.

### 9. Not getting Cancelly reminder emails? How to fix it
- Check spam, junk or promotions, and mark Cancelly's email "not spam".
- Check the email address on your account.
- If reminders to an address keep bouncing, or are marked as spam, Cancelly stops sending to it (stated in the privacy policy). Explain why and what to do about it.
- Check the trial's charge date in the app; editing it reschedules the reminders.
- Still missing one? Email support with the trial's name and charge date.
- Expands the support page's troubleshooting into a page that can rank for the problem itself.

### 10. What happens when you forward a trial email to Cancelly
- Your personal forwarding address, and what to forward (the "your trial has started" email).
- What Cancelly reads: the service's name, the charge date, and the price and cancel link where present.
- What it keeps: those details, the short phrase the date was read from (so you can check it), and the sending domain. What it doesn't keep: the body, the subject line, or the sender's address.
- If the date isn't clear, the trial waits for you to confirm it.
- The forwarding address works like a password. If someone else knows it, email support to get it replaced.
- Link to `/privacy/cancelly/`.

### 11. How to find every subscription you pay for on your Android phone
- Google Play's subscriptions list, for anything billed through Play. `TODO(kitovo)`: verify the current menu path.
- Your card or bank statements, and an email search for words like "receipt", "renewal" or "trial".
- Then add the renewal dates you care about to Cancelly. It handles ordinary renewals too, though it's built for trials.
- Keep it honest: Cancelly isn't a budgeting app and doesn't scan your accounts.

### 12. Free trial or intro offer? How to tell what you'll actually pay
- Definitions in plain words: a free trial, a discounted first period, and an intro price that steps up.
- Where to find the price after the offer ends.
- Cancelly's optional price field. Cancelling a trial with a price recorded adds it to "money saved" in Past trials.
- `TODO(kitovo)`: real examples only if you have permission to name them.

### 13. How to delete your Cancelly account and everything in it
- In-app steps. `TODO(kitovo)`: exact menu path and a screenshot from the shipping app.
- What gets deleted: the account and everything attached to it, including trials, reminder history and the forwarding address (privacy policy).
- What to do if you no longer have the app installed: email support@kitovo.in. `TODO(kitovo)`: confirm that's the process you want to offer.
- Before release, check whether Google Play's data deletion rules require a web page for account deletion requests that works without the app. If they do, this page can be the one you list in the Play Console. `TODO(kitovo)`: verify against Google's current Play policy.
