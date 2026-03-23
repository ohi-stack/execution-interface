export type TelemetryChannel = "PUBLIC" | "INTERNAL";

export interface TelemetryConfig {
  otlpEndpoint: string;
  allowedFields: string[];
  redactedFields: string[];
}

export interface TelemetryEvent {
  name: string;
  channel: TelemetryChannel;
  attributes: Record<string, unknown>;
}

export class TelemetryClient {
  constructor(private readonly publicConfig: TelemetryConfig, private readonly internalConfig: TelemetryConfig) {}

  private sanitize(config: TelemetryConfig, attributes: Record<string, unknown>): Record<string, unknown> {
    const filtered: Record<string, unknown> = {};
    for (const key of config.allowedFields) {
      if (key in attributes) {
        filtered[key] = config.redactedFields.includes(key) ? "[REDACTED]" : attributes[key];
      }
    }
    return filtered;
  }

  async emit(event: TelemetryEvent): Promise<void> {
    const cfg = event.channel === "PUBLIC" ? this.publicConfig : this.internalConfig;
    const payload = {
      name: event.name,
      channel: event.channel,
      timestamp: new Date().toISOString(),
      attributes: this.sanitize(cfg, event.attributes)
    };

    await fetch(cfg.otlpEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
}
