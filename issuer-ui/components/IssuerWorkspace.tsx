'use client';

import { FormEvent, useMemo, useState } from 'react';
import QRCode from 'qrcode';

type FormState = {
  assetName: string;
  issuer: string;
  description: string;
};

type CreatedRecord = {
  id: string;
  verifyUrl: string;
};

const initialState: FormState = {
  assetName: '',
  issuer: 'QR-V Network',
  description: '',
};

export function IssuerWorkspace() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [createdRecord, setCreatedRecord] = useState<CreatedRecord | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completion = useMemo(() => {
    const values = Object.values(formState);
    const filledFields = values.filter((value) => value.trim().length > 0).length;
    return Math.round((filledFields / values.length) * 100);
  }, [formState]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'The issuer flow could not create a record.');
      }

      const svgUrl = await QRCode.toDataURL(data.verifyUrl, {
        margin: 1,
        width: 320,
        color: {
          dark: '#101828',
          light: '#F8FAFC',
        },
      });

      setCreatedRecord({
        id: data.id,
        verifyUrl: data.verifyUrl,
      });
      setQrDataUrl(svgUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected issuer workspace failure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl || !createdRecord) {
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    anchor.download = `${createdRecord.id}.png`;
    anchor.click();
  };

  return (
    <main className="shell">
      <section className="hero card">
        <div>
          <p className="eyebrow">One full-stack engineer</p>
          <h1>Issuer workspace with API-backed QR creation.</h1>
          <p className="lede">
            Highest leverage lives in one loop: collect issuer details, call the registry API, and ship a QR-ready artifact
            that can be copied or downloaded immediately.
          </p>
        </div>
        <div className="heroMetrics">
          <div>
            <span>Issuer UI</span>
            <strong>Next.js App Router</strong>
          </div>
          <div>
            <span>API integration</span>
            <strong>Proxy route + typed fetch</strong>
          </div>
          <div>
            <span>QR pipeline</span>
            <strong>Live preview + PNG export</strong>
          </div>
        </div>
      </section>

      <section className="workspaceGrid">
        <form className="card formCard" onSubmit={handleSubmit}>
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Issuer brief</p>
              <h2>Create a verification record</h2>
            </div>
            <span className="progressPill">{completion}% complete</span>
          </div>

          <label>
            <span>Asset name</span>
            <input
              value={formState.assetName}
              onChange={(event) => setFormState((current) => ({ ...current, assetName: event.target.value }))}
              placeholder="Certificate of Authenticity"
              required
            />
          </label>

          <label>
            <span>Issuer</span>
            <input
              value={formState.issuer}
              onChange={(event) => setFormState((current) => ({ ...current, issuer: event.target.value }))}
              placeholder="QR-V Network"
              required
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              placeholder="Digital verification record for a registered asset"
              rows={6}
              required
            />
          </label>

          <button className="primaryButton" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating record…' : 'Generate QR package'}
          </button>

          {errorMessage ? <p className="errorBanner">{errorMessage}</p> : null}
        </form>

        <aside className="card previewCard">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">QR pipeline</p>
              <h2>Verification output</h2>
            </div>
            <span className={`statusDot ${createdRecord ? 'ready' : 'idle'}`}>{createdRecord ? 'Ready' : 'Waiting'}</span>
          </div>

          <div className="qrCanvas">
            {qrDataUrl ? <img src={qrDataUrl} alt="QR code preview" /> : <p>Generate a record to render a QR preview.</p>}
          </div>

          <div className="resultMeta">
            <div>
              <span>Record ID</span>
              <strong>{createdRecord?.id || 'Pending'}</strong>
            </div>
            <div>
              <span>Verification URL</span>
              <strong className="truncate">{createdRecord?.verifyUrl || 'Will populate after record creation'}</strong>
            </div>
          </div>

          <div className="buttonRow">
            <button type="button" className="secondaryButton" onClick={() => createdRecord && navigator.clipboard.writeText(createdRecord.verifyUrl)} disabled={!createdRecord}>
              Copy URL
            </button>
            <button type="button" className="secondaryButton" onClick={handleDownload} disabled={!createdRecord}>
              Download PNG
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
