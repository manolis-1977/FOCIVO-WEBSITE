# FORYMO website localization

Scope: FOCIVO-WEBSITE / forymo.com only. Application code, app languages, stores, subscriptions and account systems are outside this repository's localization release gate.

The website publishes 12 languages, each with 158 dictionary entries and 14 guides. Both pages share a public selector and persist the choice in browser storage. Arabic uses RTL. Website status is not a claim of app language or AI/human support availability.

Website release checks: `node --check app.js`, `node scripts/check-language-readiness.cjs`, `node scripts/test-pt-br.cjs`, `node scripts/test-all-locales.cjs`. These run before Pages deployment. Real Chromium acceptance tests cover both pages and five screen widths for all twelve locales; the runner is pinned to Ubuntu 24.04 because the previous Playwright install failed on Ubuntu 26.04. Real-browser results and independent editorial review remain pending until evidenced. The existing email contact opens the visitor's mail app and does not prove delivery or language-specific staffing.

Website pillars: organization, editorial care, consistency, support. No other repository is modified. Do not advertise functionality that is not actually available.
