'use client';

type PdfDownloadButtonProps = {
  label: string;
};

export function PdfDownloadButton({ label }: PdfDownloadButtonProps) {
  return (
    <button type="button" onClick={() => window.print()} className="premium-button">
      {label}
    </button>
  );
}
