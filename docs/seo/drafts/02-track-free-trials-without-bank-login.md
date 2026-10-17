---
status: draft
suggested_url: /guides/track-free-trials-without-bank-login/
meta_title: "Track free trials without giving an app your bank login"
meta_description: "A trial reminder only needs a name and a date. What Cancelly asks for, what it never asks for, what it keeps from a forwarded email, and what you trade for it."
target_question: Do I have to give an app my bank login to keep track of free trials?
search_intent: Informational / comparison
# TODO(kitovo): publish date and byline.
---

# Can you track free trials without giving an app your bank login?

Yes. To remind you about a free trial, an app needs to know two things: what the trial is called, and the day it turns into a paid charge. It doesn't need your bank account, your card numbers or your inbox for that.

## Why some apps ask for more

Some apps that track spending or subscriptions connect to your bank account or read your email inbox, so they can find charges on their own. That's convenient, but it's a trade: in return, the app gets ongoing access to your financial or email data.

Before connecting any app to your bank or inbox, it's worth asking:

- What exactly can it read, and what does it keep?
- Who else processes that data on its behalf, and where is it stored?
- Can you delete everything, and how?

A good privacy policy answers all three in plain language.

## What Cancelly asks for

To do its job, [Cancelly](/apps/cancelly/), Kitovo's free trial reminder app, needs:

- **The name of each trial and the date it turns into a charge.** Anything else, like the price, a link to cancel or a short note, is optional.
- **Your email address,** to sign you in and to send your reminders. Sign-in uses a six-digit code sent to your email, so there's no password to create.
- **Your time zone,** so dates and reminders are worked out in your local time.
- **A few basic settings,** such as your language, currency and reminder preferences.

The free version also shows one ad, which collects some device information (more on that below). The [privacy policy](/privacy/cancelly/) has the complete list, including the records Cancelly keeps to make sure reminders are delivered.

## What Cancelly never asks for

- Your bank login or card numbers.
- Access to your email inbox.
- Your contacts or your location.

## The one email Cancelly does read

Instead of typing a trial in, you can forward its confirmation email to your personal Cancelly address. Cancelly reads that one message to find the service's name, the charge date and, where present, the price and a link to cancel.

From that email, Cancelly keeps:

- those details
- the short phrase the date was read from, so you can check it was read correctly
- the sending domain (for example, "example.com")

It does **not** keep the body of the message, its subject line or the sender's email address.

Your forwarding address works like a password for adding trials. If you think someone else knows it, email support@kitovo.in and it will be replaced.

## The parts worth knowing up front

- **The free version shows one ad.** It sits at the bottom of your trial list and is served by Google AdMob, which collects information from your device, such as its advertising ID. Cancelly Premium removes the ad.
- **Premium is bought through Google Play.** Google handles the payment, and Kitovo never sees your card details.
- **Where data is stored:** your account and trial data is stored by Supabase in Japan (its Tokyo region). Other providers Cancelly uses may process information in other countries, including the United States.
- **Deleting is in the app.** Deleting your account removes it and everything attached to it, including your trials, reminder history and forwarding address.

<!-- TODO(kitovo): the Cancelly privacy policy still marks crash reporting / usage analytics as "Pending confirmation". Once that's settled, add one line here saying whether the app uses any, and which provider. Don't publish this page while that's open: it would read as a complete list. -->

## What you give up

No bank access means Cancelly can't find trials on its own. It only knows about the trials you add or forward to it. If you start a trial and don't add it, Cancelly can't remind you about it.

For most people that's a fair trade: ten seconds per trial in exchange for an app that never sees your bank account. If you'd rather have something that scans every transaction, a budgeting app is a different kind of tool, and Cancelly isn't one.

## Read the full details

Everything above comes from the [Cancelly privacy policy](/privacy/cancelly/), which lists every provider and how long data is kept.

<!-- TODO(kitovo): when Cancelly is live, end with a Google Play link. Until then: -->
Cancelly for Android is in final testing and coming soon to Google Play.
