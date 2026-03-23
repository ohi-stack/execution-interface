export const IssueRecordForm = () => `
  <section class="card span-2">
    <h4>Issue new QR-V record</h4>
    <form id="issue-record-form" class="stack-md">
      <div class="form-grid">
        <label>
          Asset name
          <input name="assetName" type="text" placeholder="Solar equipment certificate" required />
        </label>
        <label>
          Record type
          <select name="recordType" required>
            <option value="">Select a type</option>
            <option value="certificate">Certificate</option>
            <option value="license">License</option>
            <option value="credential">Credential</option>
          </select>
        </label>
        <label>
          Issuer
          <input name="issuer" type="text" placeholder="Issuer Operations" required />
        </label>
        <label>
          Reference ID
          <input name="referenceId" type="text" placeholder="CERT-2026-001" />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" rows="5" placeholder="Summary of the issued record" required></textarea>
      </label>
      <div class="button-row">
        <button type="submit">Create record</button>
        <p id="issue-form-status" class="message" aria-live="polite"></p>
      </div>
    </form>
  </section>
`;
