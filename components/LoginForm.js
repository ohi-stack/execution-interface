'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../utils/api.js';

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: 'issuer@qrv.network', password: 'change-me-now' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error || 'Login failed.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form className="panel form-card" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Issuer authentication</p>
        <h1>Issuer Portal MVP</h1>
        <p className="muted">Sign in to create QRVID-backed records and manage revocations.</p>
      </div>

      <label>
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
      </label>

      <label>
        <span>Password</span>
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          required
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
