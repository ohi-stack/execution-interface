const agentProfiles = new Map();
const tasks = new Map();
const workflows = new Map();
const authorityPolicies = new Map();
const issuerAccounts = new Map();
const verificationTokens = new Map();
const subscriptions = new Map();

const nowUtc = () => new Date().toISOString();

const normalizeAgentProfile = (profile) => ({
  id: profile.id,
  display_name: profile.display_name,
  description: profile.description || null,
  context_window_tokens: profile.context_window_tokens,
  capabilities: profile.capabilities,
  metadata: profile.metadata || {},
  created_at_utc: profile.created_at_utc,
  updated_at_utc: profile.updated_at_utc,
});

export const saveAgentProfile = (payload) => {
  const existing = agentProfiles.get(payload.agent_id);
  const profile = { ...payload, id: payload.agent_id, created_at_utc: existing?.created_at_utc || nowUtc(), updated_at_utc: nowUtc() };
  agentProfiles.set(profile.id, profile);
  return normalizeAgentProfile(profile);
};

export const getAgentProfileById = (id) => {
  const profile = agentProfiles.get(id);
  return profile ? normalizeAgentProfile(profile) : null;
};

export const saveTask = (payload) => { tasks.set(payload.task_id, payload); return payload; };
export const saveWorkflow = (payload) => { workflows.set(payload.workflow_id, payload); return payload; };
export const saveAuthorityPolicy = (payload) => { authorityPolicies.set(payload.policy_id, payload); return payload; };

export const createIssuerAccount = ({ email, password_hash, company_name }) => {
  const issuer_id = `issuer-${Math.random().toString(36).slice(2, 10)}`;
  const account = { issuer_id, email, password_hash, company_name, email_verified: false, created_at_utc: nowUtc(), profile: null, first_api_key_generated: false };
  issuerAccounts.set(issuer_id, account);
  const token = `verify_${Math.random().toString(36).slice(2, 14)}`;
  verificationTokens.set(token, issuer_id);
  return { account, token };
};

export const verifyIssuerEmail = (token) => {
  const issuer_id = verificationTokens.get(token);
  if (!issuer_id) return null;
  const account = issuerAccounts.get(issuer_id);
  if (!account) return null;
  account.email_verified = true;
  verificationTokens.delete(token);
  return account;
};

export const saveIssuerProfile = (issuer_id, profile) => {
  const account = issuerAccounts.get(issuer_id);
  if (!account) return null;
  account.profile = { ...profile, updated_at_utc: nowUtc() };
  return account;
};

export const markFirstApiKeyGenerated = (issuer_id) => {
  const account = issuerAccounts.get(issuer_id);
  if (!account) return null;
  account.first_api_key_generated = true;
  return account;
};

export const saveSubscription = (issuer_id, subscription) => {
  subscriptions.set(issuer_id, subscription);
  return subscription;
};

export const getSubscription = (issuer_id) => subscriptions.get(issuer_id) || null;

export const getIssuerAccount = (issuer_id) => issuerAccounts.get(issuer_id) || null;

export const resetAccDb = () => {
  agentProfiles.clear();
  tasks.clear();
  workflows.clear();
  authorityPolicies.clear();
  issuerAccounts.clear();
  verificationTokens.clear();
  subscriptions.clear();
};
