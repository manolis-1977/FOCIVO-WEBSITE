# FORYMO website support
The assistant is a real deterministic retrieval helper, not generative AI. It uses 4 troubleshooting answers, 4 FAQ and 14 user guides (22 topics) in all 12 website languages. Unknown questions and negative feedback reveal handoff. Users can review/edit the summary and open their mail client; they must send the message themselves. No claim of ticket creation, delivery, live staffing, or AI is made. Questions are not persisted or transmitted by the bot.

## Live representative integration
The optional Chatwoot website SDK is loaded only when the visitor explicitly selects live support. To enable, create a website inbox for forymo.com, add representatives and configure availability in Chatwoot; put the public website token and HTTPS installation origin in support-config.js. Never use a secret API key. Update privacy information before enabling the third party. The live provider manages availability and chat delivery; the visitor can copy the editable summary into the widget. The email path remains available if the SDK fails. Confirm actual visitor-to-agent delivery and reply before calling live support operational. No account or inbox has been created by this commit.

Tests: node scripts/test-support-bot.cjs; Chromium workflow includes one handoff scenario per language.
