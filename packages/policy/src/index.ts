export type PolicyDecision = "ALLOW" | "DENY" | "REQUIRE_CONFIRMATION";

export interface TxIntent {
  tenantId: string;
  chainId: number;
  action: "SEND" | "APPROVE";
  tokenAddress?: string;
  amount: string;
  destination: string;
}

export interface PolicyRule {
  id: string;
  condition: {
    chainId?: number;
    action?: TxIntent["action"];
    destinationIn?: string[];
    maxAmount?: string;
  };
  outcome: PolicyDecision;
  reasonCode: string;
}

export interface PolicyConfig {
  defaultOutcome: PolicyDecision;
  defaultReasonCode: string;
  rules: PolicyRule[];
  tenantOverlays?: Array<{ tenantId: string; rules?: PolicyRule[]; defaultOutcome?: PolicyDecision; defaultReasonCode?: string }>;
}

const toBigInt = (value: string): bigint => BigInt(value);

export class PolicyEngine {
  constructor(private readonly config: PolicyConfig) {}

  private resolve(tenantId: string): PolicyConfig {
    const overlay = this.config.tenantOverlays?.find((item) => item.tenantId === tenantId);
    return {
      ...this.config,
      ...overlay,
      rules: overlay?.rules ?? this.config.rules
    };
  }

  evaluate(intent: TxIntent): { decision: PolicyDecision; reasonCode: string; matchedRuleId?: string } {
    const cfg = this.resolve(intent.tenantId);
    for (const rule of cfg.rules) {
      const matchesChain = rule.condition.chainId === undefined || rule.condition.chainId === intent.chainId;
      const matchesAction = rule.condition.action === undefined || rule.condition.action === intent.action;
      const matchesDest = !rule.condition.destinationIn || rule.condition.destinationIn.includes(intent.destination);
      const matchesAmount = !rule.condition.maxAmount || toBigInt(intent.amount) <= toBigInt(rule.condition.maxAmount);

      if (matchesChain && matchesAction && matchesDest && matchesAmount) {
        return { decision: rule.outcome, reasonCode: rule.reasonCode, matchedRuleId: rule.id };
      }
    }

    return { decision: cfg.defaultOutcome, reasonCode: cfg.defaultReasonCode };
  }
}
