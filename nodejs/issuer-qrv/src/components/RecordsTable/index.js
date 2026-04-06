import { formatDateTime } from '../../utils/formatters.js';

export const RecordsTable = ({ records }) => `
  <section class="card span-3">
    <h4>Issued records</h4>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>QR-V ID</th>
            <th>Asset</th>
            <th>Type</th>
            <th>Status</th>
            <th>Issued</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (record) => `
                <tr>
                  <td>${record.qrvid}</td>
                  <td>${record.subject || record.assetName}</td>
                  <td>${record.recordType}</td>
                  <td><span class="status-pill ${record.status === 'REVOKED' ? 'danger' : 'success'}">${record.status}</span></td>
                  <td>${formatDateTime(record.issued_at || record.createdAt)}</td>
                </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  </section>
`;
