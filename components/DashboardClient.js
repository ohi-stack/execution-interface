'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../utils/api.js';

const blankForm = {
  recordType: 'certificate',
  assetName: '',
  recipientName: '',
  description: '',
  metadata: '{\n  "course": "Issuer Portal MVP"\n}',
};

export function DashboardClient() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [verifyQrvid, setVerifyQrvid] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [revoke, setRevoke] = useState({ qrvid: '', reason: 'Issuer requested revocation' });
  const [status, setStatus] = useState({ error: '', success: '', loading: false });

  const latestRecord = useMemo(() => records[0] || null, [records]);

  const loadDashboard = async () => {
    const [sessionRes, recordsRes] = await Promise.all([
      apiFetch('/api/auth/session'),
      apiFetch('/api/records'),
    ]);

    if (sessionRes.status === 401 || recordsRes.status === 401) {
      router.push('/login');
      return;
    }

    const sessionPayload = await sessionRes.json();
    const recordsPayload = await recordsRes.json();
    setSession(sessionPayload.issuer);
    setRecords(recordsPayload.records || []);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const submitCreate = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', loading: true });

    const response = await apiFetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus({ error: payload.error || 'Create failed.', success: '', loading: false });
      return;
    }

    setForm(blankForm);
    setStatus({ error: '', success: `Created ${payload.record.qrvid}`, loading: false });
    setVerifyQrvid(payload.record.qrvid);
    await loadDashboard();
  };

  const submitVerify = async (event) => {
    event.preventDefault();
    setStatus((current) => ({ ...current, error: '', success: '' }));

    const response = await apiFetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrvid: verifyQrvid }),
    });
    const payload = await response.json();
    setVerifyResult(payload);

    if (!response.ok) {
      setStatus({ error: payload.error || 'Verification failed.', success: '', loading: false });
    }
  };

  const submitRevoke = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', loading: true });

    const response = await apiFetch('/api/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(revoke),
    });
    const payload = await response.json();

    if (!response.ok) {
      setStatus({ error: payload.error || 'Revocation failed.', success: '', loading: false });
      return;
    }

    setStatus({ error: '', success: `Revoked ${payload.record.qrvid}`, loading: false });
    setVerifyResult(payload);
    await loadDashboard();
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (!session) {
    return <main className="page-shell"><div className="panel">Loading dashboard…</div></main>;
  }

  return (
    <main className="page-shell dashboard-shell">
      <section className="dashboard-header panel">
        <div>
          <p className="eyebrow">Authenticated issuer</p>
          <h1>{session.issuerName}</h1>
          <p className="muted">{session.email}</p>
        </div>
        <button className="ghost-button" onClick={logout} type="button">Sign out</button>
      </section>

      {status.error ? <div className="panel error-banner">{status.error}</div> : null}
      {status.success ? <div className="panel success-banner">{status.success}</div> : null}

      <section className="dashboard-grid">
        <form className="panel" onSubmit={submitCreate}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Create</p>
              <h2>Record creation UI</h2>
            </div>
          </div>
          <label>
            <span>Record type</span>
            <input value={form.recordType} onChange={(event) => setForm((current) => ({ ...current, recordType: event.target.value }))} />
          </label>
          <label>
            <span>Asset name</span>
            <input value={form.assetName} onChange={(event) => setForm((current) => ({ ...current, assetName: event.target.value }))} required />
          </label>
          <label>
            <span>Recipient name</span>
            <input value={form.recipientName} onChange={(event) => setForm((current) => ({ ...current, recipientName: event.target.value }))} required />
          </label>
          <label>
            <span>Description</span>
            <textarea rows="4" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
          </label>
          <label>
            <span>Metadata JSON</span>
            <textarea rows="6" value={form.metadata} onChange={(event) => setForm((current) => ({ ...current, metadata: event.target.value }))} />
          </label>
          <button type="submit" disabled={status.loading}>{status.loading ? 'Creating…' : 'Create QRVID record'}</button>
        </form>

        <div className="panel stack-gap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Integrity</p>
              <h2>Hash + signature layer</h2>
            </div>
          </div>
          {latestRecord ? (
            <>
              <div className="stat-card">
                <span>QRVID</span>
                <strong>{latestRecord.qrvid}</strong>
              </div>
              <div className="code-card">
                <p>SHA-256 hash</p>
                <code>{latestRecord.payloadHash}</code>
              </div>
              <div className="code-card">
                <p>Issuer signature</p>
                <code>{latestRecord.signature}</code>
              </div>
              <div className="code-card">
                <p>Verification URL</p>
                <code>{latestRecord.verifyUrl}</code>
              </div>
            </>
          ) : (
            <p className="muted">Create a record to generate the first QRVID integrity envelope.</p>
          )}
        </div>
      </section>

      <section className="dashboard-grid secondary-grid">
        <form className="panel" onSubmit={submitVerify}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Verify</p>
              <h2>/verify endpoint</h2>
            </div>
          </div>
          <label>
            <span>QRVID</span>
            <input value={verifyQrvid} onChange={(event) => setVerifyQrvid(event.target.value)} placeholder="QRVID-20260319-ABCDE12345" />
          </label>
          <button type="submit">Verify record</button>
          {verifyResult ? (
            <pre className="json-preview">{JSON.stringify(verifyResult, null, 2)}</pre>
          ) : null}
        </form>

        <form className="panel" onSubmit={submitRevoke}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Revoke</p>
              <h2>/revoke endpoint</h2>
            </div>
          </div>
          <label>
            <span>QRVID</span>
            <input value={revoke.qrvid} onChange={(event) => setRevoke((current) => ({ ...current, qrvid: event.target.value }))} required />
          </label>
          <label>
            <span>Reason</span>
            <textarea rows="4" value={revoke.reason} onChange={(event) => setRevoke((current) => ({ ...current, reason: event.target.value }))} />
          </label>
          <button type="submit">Revoke record</button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2>Issued records</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>QRVID</th>
                <th>Asset</th>
                <th>Recipient</th>
                <th>Status</th>
                <th>Integrity</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? records.map((record) => (
                <tr key={record.qrvid}>
                  <td>{record.qrvid}</td>
                  <td>{record.assetName}</td>
                  <td>{record.recipientName}</td>
                  <td><span className={`pill pill-${record.status}`}>{record.status}</span></td>
                  <td>{record.integrityValid ? 'valid' : 'invalid'}</td>
                  <td>{new Date(record.createdAt).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="muted center-cell">No records have been issued yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
