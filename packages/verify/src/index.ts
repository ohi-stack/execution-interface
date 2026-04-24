import { createVerify } from "node:crypto";

export interface SignedBundle {
  payload: string;
  signatureBase64: string;
  algorithm: "sha256-rsa";
  keyId: string;
}

export interface VerificationKey {
  keyId: string;
  pem: string;
}

export function verifyBundleSignature(bundle: SignedBundle, keys: VerificationKey[]): boolean {
  const key = keys.find((candidate) => candidate.keyId === bundle.keyId);
  if (!key) {
    return false;
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(bundle.payload);
  verifier.end();
  return verifier.verify(key.pem, Buffer.from(bundle.signatureBase64, "base64"));
}
