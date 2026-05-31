export type AutomationStatus = 'draft' | 'active' | 'paused';
export type AutomationTriggerType = 'status_changed' | 'document_generated' | 'closeout_requested';
export type AutomationActionType = 'send_email' | 'generate_document' | 'create_closeout_task' | 'notify_operator';
export type CloseoutStage = 'intake' | 'review' | 'documents' | 'signoff' | 'complete';

export type AutomationTrigger = {
  type: AutomationTriggerType;
  fromStatus?: string;
  toStatus?: string;
  documentType?: string;
};

export type AutomationAction = {
  type: AutomationActionType;
  label: string;
  template: string;
  audience: string;
};

export type AutomationRule = {
  id: string;
  name: string;
  status: AutomationStatus;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  closeoutStage?: CloseoutStage;
  lastRunUtc: string;
  runCount: number;
};

export type AutomationEvent = {
  id: string;
  entityType: 'member' | 'document' | 'workflow' | 'closeout';
  entityId: string;
  currentStatus: string;
  previousStatus?: string;
  documentType?: string;
};

export type AutomationRun = {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  actions: AutomationAction[];
  reason: string;
};

export const automationRules: AutomationRule[] = [
  {
    id: 'auto-member-approved-welcome',
    name: 'Approved member welcome packet',
    status: 'active',
    description: 'When an intake moves from review to approved, send the operator-approved welcome email and create the starter credential document.',
    trigger: {
      type: 'status_changed',
      fromStatus: 'review',
      toStatus: 'approved'
    },
    actions: [
      {
        type: 'send_email',
        label: 'Send welcome email',
        template: 'member-approved-welcome',
        audience: 'member'
      },
      {
        type: 'generate_document',
        label: 'Generate starter credential PDF',
        template: 'starter-credential',
        audience: 'records'
      }
    ],
    closeoutStage: 'documents',
    lastRunUtc: '2026-05-29T17:20:00.000Z',
    runCount: 18
  },
  {
    id: 'auto-document-certificate-issued',
    name: 'Certificate issued notification',
    status: 'active',
    description: 'When a certificate document is generated, notify the member and archive the artifact in the records workflow.',
    trigger: {
      type: 'document_generated',
      documentType: 'certificate'
    },
    actions: [
      {
        type: 'send_email',
        label: 'Email certificate delivery notice',
        template: 'certificate-issued',
        audience: 'member'
      },
      {
        type: 'notify_operator',
        label: 'Post artifact archive reminder',
        template: 'records-archive-reminder',
        audience: 'operators'
      }
    ],
    closeoutStage: 'signoff',
    lastRunUtc: '2026-05-30T11:12:00.000Z',
    runCount: 9
  },
  {
    id: 'auto-closeout-signoff',
    name: 'Closeout signoff workflow',
    status: 'active',
    description: 'When a case enters closeout requested, create final review tasks, send closeout instructions, and prepare the closeout summary document.',
    trigger: {
      type: 'closeout_requested',
      toStatus: 'closeout_requested'
    },
    actions: [
      {
        type: 'create_closeout_task',
        label: 'Create operator signoff checklist',
        template: 'closeout-signoff-checklist',
        audience: 'operators'
      },
      {
        type: 'send_email',
        label: 'Send closeout instructions',
        template: 'closeout-instructions',
        audience: 'member'
      },
      {
        type: 'generate_document',
        label: 'Generate closeout summary',
        template: 'closeout-summary',
        audience: 'records'
      }
    ],
    closeoutStage: 'signoff',
    lastRunUtc: '2026-05-30T21:45:00.000Z',
    runCount: 5
  },
  {
    id: 'auto-payment-overdue-hold',
    name: 'Overdue payment hold notice',
    status: 'paused',
    description: 'Status-based hold automation for overdue payment cases. Paused until payment-provider webhooks are connected.',
    trigger: {
      type: 'status_changed',
      fromStatus: 'active',
      toStatus: 'payment_overdue'
    },
    actions: [
      {
        type: 'send_email',
        label: 'Email payment hold notice',
        template: 'payment-hold-notice',
        audience: 'member'
      }
    ],
    closeoutStage: 'review',
    lastRunUtc: '2026-05-24T14:05:00.000Z',
    runCount: 3
  }
];

export const automationActionLabels: Record<AutomationActionType, string> = {
  send_email: 'Email notification',
  generate_document: 'Document generation',
  create_closeout_task: 'Closeout task',
  notify_operator: 'Operator notification'
};

export function evaluateAutomationEvent(event: AutomationEvent, rules: AutomationRule[] = automationRules): AutomationRun[] {
  return rules.map((rule) => {
    if (rule.status !== 'active') {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        matched: false,
        actions: [],
        reason: `Rule is ${rule.status}`
      };
    }

    const triggerMatches = rule.trigger.type === 'status_changed'
      ? event.previousStatus === rule.trigger.fromStatus && event.currentStatus === rule.trigger.toStatus
      : rule.trigger.type === 'document_generated'
        ? event.documentType === rule.trigger.documentType
        : event.currentStatus === rule.trigger.toStatus;

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched: triggerMatches,
      actions: triggerMatches ? rule.actions : [],
      reason: triggerMatches ? 'Trigger conditions matched' : 'Trigger conditions did not match'
    };
  });
}

export function getAutomationSummary(rules: AutomationRule[] = automationRules) {
  const activeRules = rules.filter((rule) => rule.status === 'active');
  const allActions = rules.flatMap((rule) => rule.actions);

  return {
    totalRules: rules.length,
    activeRules: activeRules.length,
    pausedRules: rules.filter((rule) => rule.status === 'paused').length,
    emailNotifications: allActions.filter((action) => action.type === 'send_email').length,
    documentTriggers: allActions.filter((action) => action.type === 'generate_document').length,
    closeoutWorkflows: rules.filter((rule) => rule.closeoutStage === 'signoff' || rule.trigger.type === 'closeout_requested').length
  };
}
