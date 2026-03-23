export const VerificationStatusCard = (record) => `
  <section class="card">
    <h4>Verification status</h4>
    <div class="verification-card ${record?.status === 'revoked' ? 'revoked' : 'active'}">
      <strong>${record?.status ? record.status.toUpperCase() : 'READY'}</strong>
      <p>${record?.status === 'revoked' ? 'This record can no longer be trusted for new verifications.' : 'Newly issued records are immediately available to verifiers.'}</p>
    </div>
  </section>
`;
