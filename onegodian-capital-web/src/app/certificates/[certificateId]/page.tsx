import CertificateVerificationPanel from '@/components/CertificateVerificationPanel';
export default function CertificateDetail({ params }: { params: { certificateId: string } }){return <CertificateVerificationPanel certificateId={params.certificateId} />;}
