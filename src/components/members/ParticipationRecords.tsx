import { MemberCard } from '@/components/members/MemberCard';
import type { ContentCard } from '@/data/onegodianContent';

export function ParticipationRecords({ card }: { card: ContentCard }) {
  return <MemberCard card={card} />;
}
