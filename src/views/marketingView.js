import { renderLayout } from './layout.js';

export const renderMarketingView = ({ pageTitle, heading, copy, ctaLabel, ctaHref, backupReminder }) => renderLayout({
  pageTitle,
  backupReminder,
  body: `<main class="content-wrap"><section class="card"><p class="section-label">QR-V Launch Week</p><h2>${heading}</h2><p class="supporting-copy">${copy}</p><div class="actions-row"><a class="button-link" href="${ctaHref}">${ctaLabel}</a></div></section></main>`,
});
