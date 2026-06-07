import type { Metadata } from 'next';
import { OmosPageTemplate } from '@/components/omos/OmosPageTemplate';
import { getOmosPage } from '@/data/omos-pages';

export const metadata: Metadata = {
  title: 'OneGodian Belief Mapper™',
  description: 'Seeker, Believer, OneGodian, and Elder journey-stage model with Lite Version Coming Soon status.',
  alternates: { canonical: '/belief-mapper' }
};

export default function BeliefMapperPage() {
  return <OmosPageTemplate page={getOmosPage('belief-mapper')!} />;
}
