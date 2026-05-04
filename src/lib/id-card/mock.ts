import type {
  OneGodianIdAdminRow,
  OneGodianIdCardRecord,
  OneGodianIdCardStats,
} from "./types";

export const oneGodianIdComplianceText =
  "The OneGodian ID Card is a voluntary religious identity credential issued for internal membership, sincerely held belief documentation, and verification purposes. It does not replace government-issued identification and does not assert exemption from civil law.";

export const mockOneGodianIdRecord: OneGodianIdCardRecord = {
  id: "ogid_000000001",
  memberId: "INO-M-000-000-001",
  displayName: "One Gregory Onegodian™",
  identityStatement:
    "OneGodian: related to, resembling, and belonging to One God.",
  issuer: "Indigenous Nation of Onegodia",
  credentialType: "supplemental_religious_identity_credential",
  status: "active",
  issueDateGregorian: "May 4, 2026",
  issueDateOT: "Wisdom 18, 0001 OT",
  expirationDateGregorian: "May 4, 2027",
  expirationDateOT: "Wisdom 18, 0002 OT",
  qrvRecordId: "QRV-OGID-000000001",
  obp1RecordId: "OBP1-OGID-000000001",
  verificationUrl: "https://verify.qrv.network/QRV-OGID-000000001",
  registryUrl: "https://registry.qrv.network/QRV-OGID-000000001",
  createdAt: "2026-05-04T00:00:00.000Z",
  updatedAt: "2026-05-04T00:00:00.000Z",
};

export const mockOneGodianIdStats: OneGodianIdCardStats = {
  total: 7,
  active: 3,
  pending: 2,
  needsUpdate: 1,
  revoked: 1,
  expired: 0,
};

export const mockOneGodianIdAdminRows: OneGodianIdAdminRow[] = [
  mockOneGodianIdRecord,
  {
    ...mockOneGodianIdRecord,
    id: "ogid_000000002",
    memberId: "INO-M-000-000-002",
    displayName: "Member Example Two",
    status: "pending",
    qrvRecordId: "QRV-OGID-000000002",
    verificationUrl: "https://verify.qrv.network/QRV-OGID-000000002",
  },
  {
    ...mockOneGodianIdRecord,
    id: "ogid_000000003",
    memberId: "INO-M-000-000-003",
    displayName: "Member Example Three",
    status: "needs_update",
    qrvRecordId: "QRV-OGID-000000003",
    verificationUrl: "https://verify.qrv.network/QRV-OGID-000000003",
  },
  {
    ...mockOneGodianIdRecord,
    id: "ogid_000000004",
    memberId: "INO-M-000-000-004",
    displayName: "Member Example Four",
    status: "revoked",
    qrvRecordId: "QRV-OGID-000000004",
    verificationUrl: "https://verify.qrv.network/QRV-OGID-000000004",
  },
];
