import { LoginForm } from '../../components/LoginForm.js';

export default function LoginPage() {
  return (
    <main className="page-shell auth-shell">
      <section className="hero-copy">
        <p className="eyebrow">issuer.qrv.network</p>
        <h2>Issue tamper-evident credentials with QRVID, hash proofs, and signature validation.</h2>
        <ul>
          <li>Create records through a dedicated issuer dashboard.</li>
          <li>Generate QRVID identifiers and public verification URLs.</li>
          <li>Verify or revoke credentials through API workflows.</li>
        </ul>
      </section>
      <LoginForm />
    </main>
  );
}
