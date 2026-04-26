import { renderDashboardView } from '../views/dashboardView.js';

export const renderDashboardPage = (_req, res) => {
  res.status(200).send(renderDashboardView());
};
