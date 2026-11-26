# FORYMO localization release process

## Current state (2026-11-26)
Published baseline: English (en) and Ελληνικά (el).
Not published: pt-BR, de, es, fr, it, ja, tr, ar, hi, id.
A disabled item in the language picker is not a shipped translation.

## Non-negotiable foundations
1. **Organization** — consistent content structure, functions, guides, updates, release information.
2. **Editorial care** — idiomatic translation preserving meaning; human linguistic review.
3. **Consistency** — shared terminology across Website, Windows, Mobile, Store and Support.
4. **Support** — translated guides, FAQ, AI-support copy and human support instructions.

## Release gate
- Full key parity with the English website (currently 158 keys (146 original + 12 support keys)).
- Full translation of **all 14 function guides**, including titles, summaries, purposes,
  usage steps, controls and any notes.
- Translate every visible language-dependent message including dynamically injected status
  text and page metadata; retain brand name FORYMO.
- Check screen widths 320, 375, 768, 1280 and 1920 CSS pixels; keyboard access and language
  persistence; verify no overflow, clipping or broken links.
- For Arabic additionally verify semantic `dir="rtl"`, bidi isolation for mixed-script
  English product names, navigation and form alignment.
- Verify a canonical term sheet and implementation in Windows, Android, Store and Support.
- Obtain editorial + layout approval; record evidence before toggling status to AVAILABLE.
- Run `node scripts/check-language-readiness.cjs` as a release check. This script
  checks structural completeness and recorded approvals; it cannot judge linguistic quality,
  device screenshots, deployment or claims that need real-world review.

## Implementation sequence for each new language
1. Add dictionary and 14-guide dataset to `app.js` in the language's own copy.
2. Translate dynamic text not keyed in the main dictionary, page title, description and ARIA.
3. Test and review both website pages and their layouts, including SunShine navigation.
4. Validate actual language support on Windows, Android, Store and Support.
5. Record approvals in `localization/readiness.json`.
6. Only then change disabled picker option to a selectable `data-lang` button, provide
   correct `lang`/RTL direction, update AVAILABLE and test end-to-end.
7. Publish and verify the deployed website; source commit alone is not deployment evidence.

## Required terminology handoff
Use a single approved translation for each of:
Today; Focus; Tasks; Routines; Reminders; Search; Calendar; Analytics; Organize;
Backup & Recovery; Sync; Mobile devices; Settings; Diagnostics; Complete; Cancel;
Delete; Restore; Offline; Connected; Subscription; Trial; Support.
Keep **FORYMO** exactly unchanged in every language.

## Evidence and rollback
Each locale needs reviewer, date, glossary version, screenshots at breakpoint sizes,
Windows and Mobile test runs, support/store reviews, and deployment check.
If any item fails, retain or restore IN PREPARATION and disable selection.
The existing EN/EL status is an inherited baseline and is not a claim that cross-platform
acceptance was freshly audited by this check.

## Expanded release validation
The runtime public allowlist, both pages' language selectors, roadmap and manifest must agree. New languages require documented account/subscription, transactional email, legal/privacy and AI support approval in addition to the original eight approvals. GitHub Actions runs structural checks and Chromium tests at 320, 375, 768, 1280 and 1920 pixels; automated results do not substitute for editorial or cross-platform acceptance. The site now offers real troubleshooting and a mailto contact; receipt of email and language-specific human support have not yet been verified.

## All 12 website translation datasets
All 12 locale dictionaries contain 158 entries each (1,896 entries including English), and all 12 guide datasets contain 14 guides each (168 guides). Ten additional languages are staged, not published. All ten use a loopback-only query preview: `?preview-language=CODE`. Arabic has semantic RTL and explicit layout CSS, pending actual visual acceptance. Run `node scripts/test-all-locales.cjs` in addition to the existing checks. The 85 simulated DOM/coverage checks passed at implementation time; real Chromium screenshots, independent language review and cross-platform evidence are not yet approved.
