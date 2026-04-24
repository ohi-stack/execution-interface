export interface TokenRecord {
  symbol: string;
  address: string;
  decimals: number;
}

export interface ChainRecord {
  chainId: number;
  name: string;
  nativeSymbol: string;
  tokens: TokenRecord[];
}

export interface RegistryBundle {
  version: string;
  issuedAt: string;
  chains: ChainRecord[];
}

export interface TenantOverlay {
  tenantId: string;
  patch: Partial<RegistryBundle>;
}

export interface RegistryConfig {
  bundlePath: string;
  tenantOverlays?: TenantOverlay[];
}

export class RegistryLoader {
  constructor(private readonly config: RegistryConfig) {}

  async load(tenantId?: string): Promise<RegistryBundle> {
    const text = await import(this.config.bundlePath, { with: { type: "json" } }).then((mod) => JSON.stringify(mod.default));
    const base = JSON.parse(text) as RegistryBundle;
    if (!tenantId) {
      return base;
    }
    const overlay = this.config.tenantOverlays?.find((x) => x.tenantId === tenantId)?.patch;
    return {
      ...base,
      ...overlay,
      chains: overlay?.chains ?? base.chains
    };
  }
}
