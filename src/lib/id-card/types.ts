export type OneGodianIdCardStatus =
  | "not_requested"
  | "pending"
  | "active"
  | "needs_update"
  | "revoked"
  | "expired";

export type OneGodianIdCredentialType =
  | "supplemental_religious_identity_credential";

export type OneGodianIdCardRecord = {
  id: string;
  memberId: string;
  displayName: string;
  identityStatement: string;
  issuer: "Indigenous Nation of Onegodia";
  credentialType: OneGodianIdCredentialType;
  status: OneGodianIdCardStatus;
  issueDateGregorian?: string;
  issueDateOT?: string;
  expirationDateGregorian?: string;
  expirationDateOT?: string;
  qrvRecordId?: string;
  obp1RecordId?: string;
  verificationUrl?: string;
  registryUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type OneGodianIdCardStats = {
  total: number;
  active: number;
  pending: number;
  needsUpdate: number;
  revoked: number;
  expired: number;
};

export type OneGodianIdAdminRow = OneGodianIdCardRecord;

export type IdCardAction =
  | "view"
  | "request_update"
  | "download_print"
  | "verify_qrv";
