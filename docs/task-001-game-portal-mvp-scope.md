# Task 001 — Align game.onegodian.com Hybrid Portal With MVP Scope

## Target repository

- Repository: `ohi-stack/game-onegodian-com`
- Branch: `main`
- Surface: `game.onegodian.com`
- Related playable-game source repository: `ohi-stack/onegodian-rise-v1`

## Goal

Update the portal README, gameplay docs, homepage copy, and UI labels so public-facing content clearly separates current MVP/prototype systems from future roadmap systems.

## Required classification rule

- **MVP** means current playable or prototype work.
- **Roadmap** means future systems that are planned or aspirational but are not live MVP gameplay.
- **Restricted roadmap** means any future system involving ODC, NFTs, casino, marketplace, real-money, token, gambling, financial, or similar regulated/compliance-sensitive features.

## Required content updates

1. Audit the README, SEO/gameplay documentation, homepage copy, and UI labels for language that presents future systems as live features.
2. Re-label current playable/prototype work as **MVP**.
3. Re-label planned future systems as **Roadmap**.
4. Re-label ODC/ERC-20 token support, NFT businesses, casino/minigames with gambling implications, marketplace, real-money, token, gambling, and financial systems as **Restricted roadmap / compliance-review** items.
5. Avoid claims that restricted roadmap systems are live, enabled, available, or part of the MVP.
6. Preserve the canonical gameplay/SEO value of the existing docs while tightening product-status accuracy.

## Suggested acceptance criteria

- The README includes a concise status matrix or section separating MVP, Roadmap, and Restricted roadmap systems.
- Gameplay docs no longer describe restricted roadmap systems as active gameplay.
- Homepage cards, labels, badges, or modules visibly distinguish MVP features from roadmap features.
- Restricted roadmap language includes compliance-review framing where applicable.
- The docs continue to identify `ohi-stack/onegodian-rise-v1` as the actual playable Unreal/game source repository.

## Notes

The portal repository is now populated and should remain the public web/SEO/gameplay hub for `game.onegodian.com`. The Unreal repository remains the implementation home for the playable game source.
