import type { AppDefinition } from './types';

/**
 * Cancelly: free-trial reminders.
 *
 * Every claim below matches how Cancelly actually works today, as described in
 * its own product copy and backend (sign-in by six-digit email code, capture by
 * typing a trial in or forwarding one confirmation email, more than one
 * heads-up before the charge, in-app account deletion, a single labelled ad in
 * the free tier). If the app changes, change this file. Do not add features
 * here that the app does not ship.
 */
export const cancelly: AppDefinition = {
  slug: 'cancelly',
  name: 'Cancelly',
  tagline: 'Never forget another free trial.',
  descriptor: 'free-trial reminder app',
  summary:
    'Cancelly reminds you before a free trial turns into a paid charge, so you can keep it or cancel it in time.',
  intro: [
    'Free trials are easy to start and easy to forget. Cancelly keeps track of the day each one turns into a paid charge and gives you a heads-up before it happens, while there is still time to decide.',
    'It does one job: trial reminders. It is not a budgeting app, it never connects to your bank, and it does not cancel anything for you. It makes sure you hear about a trial before the trial becomes a bill.',
  ],
  category: 'UtilitiesApplication',

  platforms: [
    {
      name: 'Android',
      status: 'coming-soon',
      // TODO(kitovo): paste the Google Play listing URL here when it is live,
      // e.g. 'https://play.google.com/store/apps/details?id=<package.name>',
      // and change status to 'available'. Every "Get it on Google Play"
      // button on the site switches on automatically.
      storeUrl: null,
      note: 'In final testing',
    },
    {
      name: 'iOS',
      status: 'in-development',
      storeUrl: null,
      note: 'No release date yet',
    },
  ],

  icon: {
    // The real launcher icon. Tile colours are sampled from it, so the app
    // page and cards match the icon.
    src: '/apps/cancelly/icon.webp',
    background: 'linear-gradient(180deg, #0e2b3c 0%, #0f5871 100%)',
    foreground: '#6fc7e3',
  },

  supportEmail: 'support@kitovo.in',

  steps: [
    {
      title: 'Add the trial',
      body: 'Type in the name and the day it turns into a charge, which takes about ten seconds. Or forward the “your trial has started” email and Cancelly reads the dates for you.',
    },
    {
      title: 'Get a heads-up',
      body: 'Cancelly holds the date so you don’t have to, and warns you three times: three days before, the day before, and on the last morning.',
    },
    {
      title: 'Decide in time',
      body: 'Keep the trial, or cancel it with the service before any money moves. Either way, you choose while there is still time.',
    },
  ],

  features: [
    {
      icon: 'plus',
      title: 'Add a trial in seconds',
      body: 'Type the trial’s name and pick when it charges: 7, 14 or 30 days from now, or any date. The price is optional.',
    },
    {
      icon: 'forward',
      title: 'Or forward one email',
      body: 'Forward a trial confirmation to your personal Cancelly address and the dates are read for you. Only that email, never your inbox.',
    },
    {
      icon: 'bell',
      title: 'Three heads-ups',
      body: 'Three days before the charge, the day before, and on the last morning, so one missed message is not the end of it.'
    },
    {
      icon: 'clock',
      title: 'On your time zone',
      body: 'Charge dates and reminders are worked out in your local time zone, not a server’s.',
    },
    {
      icon: 'key',
      title: 'Sign in with a code',
      body: 'No password to create or forget. Cancelly emails you a six-digit code instead.',
    },
    {
      icon: 'trash',
      title: 'Delete everything, anytime',
      body: 'Delete your account and everything attached to it from inside the app, whenever you like.',
    },
  ],

  notThis: [
    'Not a budgeting app or an expense tracker. No spending charts, no categories.',
    'Never asks for your bank login or card numbers.',
    'Does not cancel subscriptions for you. You stay in control and cancel with the service directly.',
  ],

  privacyAtAGlance: {
    uses: [
      'The name of each trial and the date it turns into a charge.',
      'Your email address, to sign you in and send your reminders.',
      'In the free version, your device’s advertising ID, used by Google AdMob to show one ad.',
    ],
    neverAsksFor: [
      'Your bank login or card numbers.',
      'Access to your inbox. Cancelly only sees an email you choose to forward.',
      'Your contacts or your location.',
    ],
  },

  // Real Play Store screenshots (1080×1920 originals, resized to 560 wide).
  screenshots: [
    { src: '/apps/cancelly/screens/intro.webp', width: 560, height: 996, alt: 'Cancelly’s welcome screen: “Free trials end. Your money shouldn’t go with them.”' },
    { src: '/apps/cancelly/screens/home.webp', width: 560, height: 996, alt: 'The home screen: “You’re protected”, with the next trial to charge (Disney+, tomorrow) and three more trials being watched.' },
    { src: '/apps/cancelly/screens/add-trial.webp', width: 560, height: 996, alt: 'Adding a trial: its name, when it charges (7, 14 or 30 days, or a date you pick) and the price.' },
    { src: '/apps/cancelly/screens/detail.webp', width: 560, height: 996, alt: 'A trial’s detail screen showing the charge date, the amount and when each reminder is sent.' },
    { src: '/apps/cancelly/screens/past-trials.webp', width: 560, height: 996, alt: 'Past trials: the money saved by cancelling before the charge, and the trials you kept.' },
  ],

  faq: [
    {
      question: 'Is Cancelly available yet?',
      answer:
        'Not yet. The Android app is in final testing and will be released on Google Play soon. This page will link straight to the listing once it is live. An iOS version is in development, with no release date yet.',
    },
    {
      question: 'Does Cancelly cancel subscriptions for me?',
      answer:
        'No. Cancelly reminds you before a trial turns into a charge and helps you get to the right place to cancel, but the cancellation itself happens with the service you signed up for.',
    },
    {
      question: 'Does it need my bank login or access to my email?',
      answer:
        'No. Cancelly never asks for bank logins or card numbers, and it does not read your inbox. You add trials yourself, or forward a single confirmation email, and Cancelly only reads that one message.',
    },
    {
      question: 'How do I sign in?',
      answer:
        'With a six-digit code sent to your email address. There is no password to create or remember.',
    },
    {
      question: 'How much does it cost?',
      answer:
        'Trial reminders are free. The free version shows one small, labelled ad at the bottom of your trial list and nowhere else. Cancelly Premium removes it.',
    },
    {
      question: 'Can I use it for regular subscriptions too?',
      answer:
        'Yes, you can add an ordinary renewal as well. Cancelly is built for free trials, though, because those are the charges that are easiest to miss.',
    },
    {
      question: 'How do I delete my data?',
      answer:
        'From inside the app. Deleting your account removes it along with everything attached to it, including your trials. The Cancelly privacy policy has the details.',
    },
    {
      question: 'Is Cancelly a budgeting or finance app?',
      answer:
        'No. It does not track your spending, connect to your bank or give financial advice. It has one job: telling you about a trial before it charges you.',
    },
  ],

  support: {
    troubleshooting: [
      {
        title: 'I didn’t get a reminder',
        steps: [
          'Check your spam, junk or promotions folder for email from Cancelly. If a reminder is there, mark it as “not spam” so the next one reaches your inbox.',
          'Open the trial in Cancelly and check its charge date. If the date is wrong, edit it: reminders for the old date are cancelled and new ones are scheduled.',
          'Make sure the email address on your account is one you still use.',
          'Still missing a reminder? Email us with the name of the trial and its charge date.',
        ],
      },
      {
        title: 'My sign-in code hasn’t arrived',
        steps: [
          'Give it a minute or two, then check your spam or junk folder.',
          'Check the email address you entered for typos.',
          'Go back and ask for a new code.',
        ],
      },
      {
        title: 'A forwarded email didn’t add my trial',
        steps: [
          'Forward the original confirmation email, the one that says your trial has started, to the personal forwarding address shown in Cancelly.',
          'If Cancelly can’t read the date with confidence, the trial may be waiting for you to confirm it in the app.',
          'If nothing shows up, add the trial by hand. It takes about ten seconds.',
        ],
      },
      {
        title: 'The charge date is wrong',
        steps: [
          'Open the trial and edit the date. Reminders move to the new date.',
          'If you’re not sure of the exact day, use the earliest date the service could charge you. Being early is safe; being late is not.',
        ],
      },
    ],
    account: [
      {
        title: 'Signing in',
        body: 'Cancelly signs you in with a six-digit code sent to your email address, so there is no password to manage or reset.',
      },
      {
        title: 'Deleting your account',
        body: 'You can delete your account from inside the app. This removes the account and everything attached to it, including your trials.',
      },
      {
        title: 'Questions about your data',
        body: 'Read the Cancelly privacy policy, or email us with any question about what Cancelly stores and why.',
      },
    ],
    bugReport: {
      include: [
        'What you were trying to do, and what happened instead.',
        'The steps to make it happen again, if you can.',
        'Your phone model and Android version (usually under Settings → About phone).',
        'The Cancelly version (usually under Settings → Apps → Cancelly).',
        'A screenshot or screen recording, if it helps show the problem.',
      ],
      note: 'Please never send passwords, sign-in codes or card numbers. We will never ask for them.',
    },
  },

  disclaimer: [
    'Cancelly is a reminder tool. It helps you remember when a free trial is due to turn into a paid charge. It does not cancel subscriptions, contact merchants or stop payments on your behalf.',
    'Reminders are based on the information you add or forward. If a date is wrong or missing, a reminder may arrive at the wrong time or not at all. Check the terms of any service you sign up for.',
    'Reminders depend on things outside our control, such as email delivery, spam filters and your device. Cancelly cannot guarantee that every reminder will be delivered, or seen, in time.',
    'Whether and when you are charged is decided by the merchant and your payment provider, not by Cancelly. Using Cancelly does not guarantee that you will avoid a charge.',
    'Cancelly is not a bank, a payment service or a financial adviser, and nothing in the app is financial advice.',
  ],

  privacyPolicy: {
    updated: '2026-10-02',
  },

  seo: {
    title: 'Cancelly: free-trial reminders for Android',
    description:
      'Cancelly reminds you before a free trial turns into a paid charge, so you can keep it or cancel it in time. An Android app by Kitovo, coming soon to Google Play.',
    // Rendered by scripts/generate-brand-assets.mjs.
    ogImage: '/apps/cancelly/og.png',
  },
};
