import { jsonResponse } from '@/lib/api-json';
import { automationRules, evaluateAutomationEvent, getAutomationSummary, type AutomationEvent } from '@/lib/automation-engine';

const sampleEvent: AutomationEvent = {
  id: 'evt-sample-member-approved',
  entityType: 'member',
  entityId: 'member-demo-001',
  previousStatus: 'review',
  currentStatus: 'approved'
};

export async function GET(request: Request) {
  return jsonResponse(
    {
      service: 'workflows',
      surface: 'console',
      status: 'ok',
      engine: 'automation',
      summary: getAutomationSummary(),
      rules: automationRules,
      sampleEvaluation: evaluateAutomationEvent(sampleEvent)
    },
    request
  );
}

export async function POST(request: Request) {
  const event = (await request.json()) as AutomationEvent;

  return jsonResponse(
    {
      status: 'evaluated',
      event,
      runs: evaluateAutomationEvent(event)
    },
    request
  );
}
