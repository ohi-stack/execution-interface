export const VerificationStatusCard = (record) => `
  <section class="card">
    <h4>Verification status</h4>
    <div class="verification-card ${record?.status === 'REVOKED' ? 'revoked' : 'active'}">
      <strong>${record?.status || 'READY'}</strong>
      <p>${record?.status === 'REVOKED' ? 'This record can no longer be trusted for new verifications.' : 'Newly issued records are immediately available to verifiers.'}</p>
    </div>
  </section>
`;
