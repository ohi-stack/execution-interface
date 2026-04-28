import { getPrismaClient } from './prismaClient.js';

const fallbackState = {
  global: false,
  domains: new Map(),
  agents: new Map(),
};

const fromRows = (rows) => {
  const global = rows.find((r) => r.scopeType === 'global')?.isActive || false;
  const domains = Object.fromEntries(rows.filter((r) => r.scopeType === 'domain').map((r) => [r.scopeId, r.isActive]));
  const agents = Object.fromEntries(rows.filter((r) => r.scopeType === 'agent').map((r) => [r.scopeId, r.isActive]));
  return { global, domains, agents };
};

const upsert = async ({ scopeType, scopeId, isActive, reason }) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    if (scopeType === 'global') fallbackState.global = isActive;
    if (scopeType === 'domain') fallbackState.domains.set(scopeId, isActive);
    if (scopeType === 'agent') fallbackState.agents.set(scopeId, isActive);
    return;
  }

  await prisma.killSwitchState.upsert({
    where: { scopeType_scopeId: { scopeType, scopeId } },
    update: { isActive, reason },
    create: { scopeType, scopeId, isActive, reason },
  });
};

export const getKillSwitchState = async () => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    return { global: fallbackState.global, domains: Object.fromEntries(fallbackState.domains), agents: Object.fromEntries(fallbackState.agents) };
  }

  const rows = await prisma.killSwitchState.findMany();
  return fromRows(rows);
};

export const setGlobalKillSwitch = async ({ active, reason }) => upsert({ scopeType: 'global', scopeId: 'global', isActive: Boolean(active), reason: reason || null });
export const setDomainKillSwitch = async ({ domain, active, reason }) => upsert({ scopeType: 'domain', scopeId: domain, isActive: Boolean(active), reason: reason || null });
export const setAgentKillSwitch = async ({ agentId, active, reason }) => upsert({ scopeType: 'agent', scopeId: agentId, isActive: Boolean(active), reason: reason || null });

export const isKillSwitchActive = async ({ domain, agentId }) => {
  const state = await getKillSwitchState();
  return Boolean(state.global || (domain && state.domains[domain]) || (agentId && state.agents[agentId]));
};


export const __resetKillSwitchForTests = () => {
  fallbackState.global = false;
  fallbackState.domains.clear();
  fallbackState.agents.clear();
};
