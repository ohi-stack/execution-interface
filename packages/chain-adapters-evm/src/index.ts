export type Hex = `0x${string}`;

export interface TenantOverlay<T> {
  tenantId: string;
  config: Partial<T>;
}

export interface EvmAdapterConfig {
  chainId: number;
  nativeSymbol: string;
  defaultGasLimit: bigint;
  tenantOverlays?: TenantOverlay<EvmAdapterConfig>[];
}

export interface SendIntent {
  kind: "SEND";
  tenantId: string;
  from: Hex;
  to: Hex;
  amountWei: bigint;
  nonce: number;
  gasPriceWei: bigint;
}

export interface ApproveIntent {
  kind: "APPROVE";
  tenantId: string;
  owner: Hex;
  token: Hex;
  spender: Hex;
  amount: bigint;
  nonce: number;
  gasPriceWei: bigint;
}

export type EvmIntent = SendIntent | ApproveIntent;

export interface UnsignedTx {
  chainId: number;
  from: Hex;
  to: Hex;
  data: Hex;
  value: bigint;
  gasLimit: bigint;
  gasPriceWei: bigint;
  nonce: number;
}

export class EvmAdapter {
  constructor(private readonly config: EvmAdapterConfig) {}

  private resolve(tenantId: string): EvmAdapterConfig {
    const overlay = this.config.tenantOverlays?.find((item) => item.tenantId === tenantId)?.config;
    return { ...this.config, ...overlay };
  }

  buildUnsignedTx(intent: EvmIntent): UnsignedTx {
    const cfg = this.resolve(intent.tenantId);
    if (intent.kind === "SEND") {
      return {
        chainId: cfg.chainId,
        from: intent.from,
        to: intent.to,
        data: "0x",
        value: intent.amountWei,
        gasLimit: cfg.defaultGasLimit,
        gasPriceWei: intent.gasPriceWei,
        nonce: intent.nonce
      };
    }

    const methodSig = "0x095ea7b3";
    const paddedSpender = intent.spender.slice(2).padStart(64, "0");
    const paddedAmount = intent.amount.toString(16).padStart(64, "0");
    return {
      chainId: cfg.chainId,
      from: intent.owner,
      to: intent.token,
      data: `${methodSig}${paddedSpender}${paddedAmount}` as Hex,
      value: 0n,
      gasLimit: cfg.defaultGasLimit,
      gasPriceWei: intent.gasPriceWei,
      nonce: intent.nonce
    };
  }

  signTx(unsignedTx: UnsignedTx, signFn: (serialized: string) => Promise<Hex>): Promise<Hex> {
    return signFn(JSON.stringify(unsignedTx, (_, value) => (typeof value === "bigint" ? value.toString() : value)));
  }

  async broadcastTx(rpcSend: (signedTx: Hex) => Promise<Hex>, signedTx: Hex): Promise<Hex> {
    return rpcSend(signedTx);
  }
}
