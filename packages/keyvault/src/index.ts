import { createHash, createHmac } from "node:crypto";

export interface TenantOverlay<T> {
  tenantId: string;
  config: Partial<T>;
}

export interface KeyVaultConfig {
  masterSeedHex: string;
  defaultDerivationPath: string;
  signerAlgorithm: "hmac-sha256";
  tenantOverlays?: TenantOverlay<KeyVaultConfig>[];
}

export interface SignRequest {
  tenantId: string;
  derivationPath?: string;
  payload: string;
}

export interface DerivedKeyRef {
  tenantId: string;
  derivationPath: string;
  keyId: string;
}

export class KeyVault {
  private readonly baseConfig: KeyVaultConfig;

  constructor(config: KeyVaultConfig) {
    this.baseConfig = config;
  }

  private resolveConfig(tenantId: string): KeyVaultConfig {
    const overlay = this.baseConfig.tenantOverlays?.find((item) => item.tenantId === tenantId)?.config;
    return { ...this.baseConfig, ...overlay };
  }

  deriveKeyRef(tenantId: string, derivationPath?: string): DerivedKeyRef {
    const cfg = this.resolveConfig(tenantId);
    const path = derivationPath ?? cfg.defaultDerivationPath;
    const idInput = `${tenantId}:${path}:${cfg.masterSeedHex}`;
    const keyId = createHash("sha256").update(idInput).digest("hex");
    return { tenantId, derivationPath: path, keyId };
  }

  sign(request: SignRequest): { keyRef: DerivedKeyRef; signatureHex: string } {
    const cfg = this.resolveConfig(request.tenantId);
    const keyRef = this.deriveKeyRef(request.tenantId, request.derivationPath);
    const signerMaterial = `${cfg.masterSeedHex}:${keyRef.derivationPath}`;
    const signatureHex = createHmac("sha256", Buffer.from(signerMaterial, "utf8"))
      .update(request.payload)
      .digest("hex");

    return { keyRef, signatureHex };
  }
}
