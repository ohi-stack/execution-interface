# UI Standard (v0.2.2)

## UI purpose
The ONEGODIAN Capital Portal UI provides recordkeeping screens, disclosure display, and capital portal presentation interfaces only.

## Approved labels
Use neutral terms such as:
- Capital Instrument
- Disclosure Packet
- Consent Status
- Certificate Record
- Ledger History
- Account Notice

## Prohibited investment wording
Do not include claims or implied claims about guaranteed returns, profit projections, fixed yield promises, or investment outcomes.

## Color and style direction
Use a navy/white/gold institutional visual system with readable, responsive cards, badges, tables, and warning notices.

## Disclosure-first UX rule
Any offering or participant action flow must prioritize disclosure review and explicit acknowledgment before progression.


## Navy Panel Contrast Rules
- Any navy hero/card/dashboard panel must render headings in white.
- Eyebrow and kicker labels in navy panels must render gold.
- Body text inside navy panels must render white for readable contrast.

## Mobile Table Rules
- All dashboard, ledger, instrument, and certificate/disclosure tables must be wrapped in a mobile-scrollable container.
- Use `.onegodian-capital-table-wrap` with `overflow-x: auto` and a `.onegodian-capital-responsive-table` `min-width` for wide data tables.
- No Capital portal page may force horizontal page overflow at mobile breakpoints.
