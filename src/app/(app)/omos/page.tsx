import { ContentRoutePage } from '@/components/ContentRoutePage';
import { RuntimeHealthWidget } from '@/components/RuntimeHealthWidget';
import { omosContent } from '@/data/onegodianContent';

export default function OmosPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ContentRoutePage content={omosContent} />
      <RuntimeHealthWidget />
    </div>
  );
}
