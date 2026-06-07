import { MemberCard } from '@/components/members/MemberCard';
import { MemberCertificates } from '@/components/members/MemberCertificates';
import { ParticipationRecords } from '@/components/members/ParticipationRecords';
import { membersContent } from '@/data/onegodianContent';

export default function MembersPage() {
  const [idCard, certificates, participation] = membersContent.cards;

  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="glass-panel overflow-hidden p-5 sm:p-7 lg:p-10">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300 sm:tracking-[0.3em]">{membersContent.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2rem,10vw,4.6rem)] font-black leading-[0.95] tracking-[-0.055em] text-white">{membersContent.title}</h1>
          <p className="mt-5 text-xl font-bold leading-8 text-gold-100 sm:text-2xl sm:leading-9">{membersContent.headline}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">{membersContent.description}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MemberCard card={idCard} />
        <MemberCertificates card={certificates} />
        <ParticipationRecords card={participation} />
      </section>
    </main>
  );
}
