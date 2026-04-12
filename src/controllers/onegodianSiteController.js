import {
  renderAlgorithmDocPage,
  renderOrgHomePage,
  renderPositioningDocPage,
  renderProductDetailPage,
  renderProductsPage,
  renderSystemPromptDocPage,
} from '../views/onegodian/pages.js';

export const getOrgHomepage = (_req, res) => res.send(renderOrgHomePage());
export const getProductsPage = (_req, res) => res.send(renderProductsPage());
export const getProductDetailPage = (req, res) => res.send(renderProductDetailPage(req.params.slug));
export const getAlgorithmDocPage = (_req, res) => res.send(renderAlgorithmDocPage());
export const getSystemPromptDocPage = (_req, res) => res.send(renderSystemPromptDocPage());
export const getPositioningDocPage = (_req, res) => res.send(renderPositioningDocPage());
