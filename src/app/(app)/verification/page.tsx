import { CapitalPage, NoticePanel } from '../../components/CapitalPage';

const fields = ['Certificate ID', 'Contributor Record ID', 'Disclosure Acknowledgement ID', 'OBP-1 Reference', 'Instrument Code'];

export default function VerificationPage() {
  return (
    <CapitalPage title="Verification" subtitle="Use this page to verify certificate references, contribution record IDs, disclosure acknowledgement IDs, and OBP-1 references.">
      <NoticePanel>Verification confirms whether a record exists in the Capital Portal system. It does not independently validate the legal effect, market value, transferability, or enforceability of any instrument.</NoticePanel>
      <form className="glass-panel grid gap-4 p-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="text-sm font-bold text-white">
            {field}
            <input className="capital-field mt-2" name={field.toLowerCase().replaceAll(' ', '-')} placeholder={field} />
          </label>
        ))}
        <button type="button" className="premium-button sm:col-span-2">Submit Verification Request</button>
      </form>
    </CapitalPage>
  );
}
