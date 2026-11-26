# Português — Brasil (pt-BR)
Status: IN PREPARATION — not a public product language.

## Implemented
- Website dictionary: 146/146 existing keys.
- Function guide: 14/14 items, all source steps and notes.
- PT-BR metric strings, page titles/descriptions, skip link, footer FAQ and accessible names.
- Local browser preview only on localhost, 127.0.0.1 or [::1].
- Public selector remains disabled; unreleased stored values fall back to English.
- Structural and simulated DOM checks passed (11); independent editorial, real-browser, desktop, Android, store and support QA remain pending.

## Shared glossary proposal
| English | pt-BR |
|---|---|
| Today | Hoje |
| Focus | Foco |
| Tasks | Tarefas |
| Routines | Rotinas |
| Reminders | Lembretes |
| Search | Busca |
| Calendar | Calendário |
| Analytics | Análises |
| Organize | Organização |
| Backup & Recovery | Backup e recuperação |
| Sync | Sincronização |
| Mobile Devices | Dispositivos móveis |
| Settings | Configurações |
| Diagnostics | Diagnóstico |
| Complete | Concluir |
| Cancel | Cancelar |
| Delete | Excluir |
| Restore | Restaurar |
| Offline | Offline |
| Connected | Conectado |
| Subscription | Assinatura |
| Trial | Período de avaliação |
| Support | Suporte |

FORYMO, SunShine Pro and brand pillars FOCUS · RHYTHM · MOMENTS retain their original branding. Glossary is proposed, not yet a cross-platform approval.

## Verification
From website repository root:
```powershell
node --check app.js
node scripts/check-language-readiness.cjs
node scripts/test-pt-br.cjs
py -3 -m http.server 8788 --bind 127.0.0.1
```
Open http://127.0.0.1:8788/?preview-language=pt-BR or http://127.0.0.1:8788/sunshine-pro/?preview-language=pt-BR.
Preview is not persistent and is ignored on public hosts.
Check all 14 tabs, layout at all breakpoints, remaining unkeyed visible/accessible copy, product terminology, EN/EL switching, and actual platform parity. No approval flag should be set solely from these automated tests.
