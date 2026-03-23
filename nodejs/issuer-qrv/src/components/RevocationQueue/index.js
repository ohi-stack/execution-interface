export const RevocationQueue = ({ records }) => {
  const activeRecords = records.filter((record) => record.status !== 'revoked');

  return `
    <section class="card span-2">
      <h4>Revocation queue</h4>
      <form id="revoke-record-form" class="stack-md">
        <label>
          Record
          <select name="qrvid" required>
            <option value="">Select a record</option>
            ${activeRecords.map((record) => `<option value="${record.qrvid}">${record.qrvid} · ${record.assetName}</option>`).join('')}
          </select>
        </label>
        <label>
          Reason
          <textarea name="reason" rows="4" placeholder="Reason for revocation" required></textarea>
        </label>
        <div class="button-row">
          <button type="submit" class="danger-button">Revoke record</button>
          <p id="revoke-form-status" class="message" aria-live="polite"></p>
        </div>
      </form>
    </section>
  `;
};
