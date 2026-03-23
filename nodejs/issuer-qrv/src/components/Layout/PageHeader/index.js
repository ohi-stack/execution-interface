export const PageHeader = ({ title, description, actionLabel, actionTarget }) => `
  <section class="page-header">
    <div>
      <p class="eyebrow">Workflow module</p>
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
    ${actionLabel ? `<button class="secondary-button" data-nav="${actionTarget}">${actionLabel}</button>` : ''}
  </section>
`;
