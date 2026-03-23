export const ApiKeysPanel = ({ keys }) => `
  <section class="card span-2">
    <h4>API access</h4>
    <ul class="stack-sm api-key-list">
      ${keys
        .map(
          (key) => `
            <li>
              <div>
                <strong>${key.name}</strong>
                <p>${key.prefix}•••••• • ${key.scope}</p>
              </div>
              <span class="status-pill ${key.status === 'active' ? 'success' : 'warning'}">${key.status}</span>
            </li>`,
        )
        .join('')}
    </ul>
  </section>
`;
