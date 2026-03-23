export interface RpcProvider {
  id: string;
  url: string;
  priority: number;
}

export interface ProviderHealth {
  providerId: string;
  lastFailure?: string;
  healthy: boolean;
}

export interface RpcRouterConfig {
  requestTimeoutMs: number;
  providers: RpcProvider[];
}

export class RpcRouter {
  private readonly health = new Map<string, ProviderHealth>();

  constructor(private readonly config: RpcRouterConfig) {
    for (const provider of config.providers) {
      this.health.set(provider.id, { providerId: provider.id, healthy: true });
    }
  }

  getHealth(): ProviderHealth[] {
    return [...this.health.values()];
  }

  async forward(method: string, params: unknown[]): Promise<unknown> {
    const sorted = [...this.config.providers].sort((a, b) => a.priority - b.priority);
    let lastError: unknown;

    for (const provider of sorted) {
      try {
        const response = await fetch(provider.url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
          signal: AbortSignal.timeout(this.config.requestTimeoutMs)
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const payload = (await response.json()) as { result?: unknown; error?: unknown };
        if (payload.error) {
          throw new Error(`RPC Error: ${JSON.stringify(payload.error)}`);
        }
        this.health.set(provider.id, { providerId: provider.id, healthy: true });
        return payload.result;
      } catch (error) {
        lastError = error;
        this.health.set(provider.id, {
          providerId: provider.id,
          healthy: false,
          lastFailure: `${error}`
        });
      }
    }

    throw new Error(`All RPC providers failed. lastError=${String(lastError)}`);
  }
}
