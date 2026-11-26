# Website product alignment — 2026-11-26

Scope: website only. App source inspected read-only (forymo-rebrand, cbc26e5). The website is designed for the final product, but public copy must not claim live commercial infrastructure without verified delivery.

## Comparison

- Desktop navigation: 14 modules; all 14 already have website guides. Keep the existing guide selector rather than add sections.
- Desktop presentation: add calendar, Focus, organization/search, progress and verified backups to the existing platform card. Existing detailed guides cover tasks/subtasks, routines, reminders, analytics, exports (JSON/CSV/PDF/Excel/Markdown), settings and diagnostics.
- Mobile: actual navigation includes Today, Focus, Tasks, Routines, Reminders, Calendar and Settings. The previous public summary omitted Focus and Calendar. Clarify that offline writes are limited by permissions and supported operations.
- Mobile pairing: same Wi-Fi for local connection, mobile service + LAN access, temporary six-digit code, detected PC, access scope and revocation. Desktop guide and FAQ now match these steps. The bot consumes the same guide and FAQ automatically.
- Data architecture: local-first, personal productivity content does not pass through a FORYMO-operated content backend. Use the existing sixth feature card rather than add marketing blocks.
- Account, billing and optional BYOC: final product architecture considered, but no claim of active consumer provider support, hosted signup, trial checkout, store availability or live support is added without verified public endpoints. Existing folder sync guide remains separate from optional cloud.
- Hero: existing illustrative HTML dashboard explicitly labelled as such; not a live app. No new graphics, layout or nav items.
- Windows contact CTA now leads to actual support section, closing CTA uses its own existing text instead of repeating the control card.

Sources reviewed: Desktop navigation.py, qt_shell.py, task_ui.py, focus_ui.py, routine_ui.py, reminder_ui.py, organization_ui.py, analytics_ui.py, calendar_ui.py, backup_ui.py, sync_manager.py, settings_ui.py, mobile_devices_ui.py, mobile_api.py; Android MainActivity.java, ForymoApiClient.java, README_GR.md and architecture documentation; account and local-first/BYOC contracts. This is a functional source comparison, not a full execution/acceptance audit of the application. No app repository changes. SunShine Pro excluded from content edits.
