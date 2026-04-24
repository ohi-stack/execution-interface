import { appendFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export interface AuditEvent {
  correlationId: string;
  timestamp: string;
  category: "policy" | "tx" | "rpc" | "system";
  message: string;
  payload?: Record<string, unknown>;
}

export interface AuditConfig {
  path: string;
}

export class AuditLogger {
  constructor(private readonly config: AuditConfig) {}

  createCorrelationId(): string {
    return randomUUID();
  }

  async append(event: Omit<AuditEvent, "timestamp">): Promise<void> {
    const line: AuditEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    await appendFile(this.config.path, JSON.stringify(line) + "\n", "utf8");
  }
}
