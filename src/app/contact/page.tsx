import { CapitalPage, NoticePanel } from '../components/CapitalPage';

export default function ContactPage() {
  return (
    <CapitalPage title="Contact" subtitle="Use this page for capital portal support, document review questions, disclosure access, certificate verification issues, and contributor record assistance.">
      <NoticePanel>Submit support details for routing to the appropriate capital portal review workflow.</NoticePanel>
      <form className="glass-panel grid gap-4 p-5 sm:grid-cols-2">
        <label className="text-sm font-bold text-white">Name<input className="capital-field mt-2" name="name" autoComplete="name" /></label>
        <label className="text-sm font-bold text-white">Email<input className="capital-field mt-2" name="email" type="email" autoComplete="email" /></label>
        <label className="text-sm font-bold text-white sm:col-span-2">Reason for inquiry<input className="capital-field mt-2" name="reason" /></label>
        <label className="text-sm font-bold text-white sm:col-span-2">Message<textarea className="capital-field mt-2 min-h-36" name="message" /></label>
        <button type="button" className="premium-button sm:col-span-2">Send Inquiry</button>
      </form>
    </CapitalPage>
  );
}
