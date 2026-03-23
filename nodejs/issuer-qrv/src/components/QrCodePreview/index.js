export const QrCodePreview = (record) => `
  <section class="card">
    <h4>QR-V preview</h4>
    ${record?.qrCode ? `<img class="qr-preview" src="${record.qrCode}" alt="QR code for ${record.qrvid}" />` : '<div class="empty-state">Create a record to preview its QR code.</div>'}
    <dl class="detail-list">
      <div><dt>QR-V ID</dt><dd>${record?.qrvid || 'Pending'}</dd></div>
      <div><dt>Reference</dt><dd>${record?.referenceId || 'Not set'}</dd></div>
      <div><dt>Type</dt><dd>${record?.recordType || '—'}</dd></div>
    </dl>
  </section>
`;
