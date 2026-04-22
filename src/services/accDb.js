const agentProfiles = new Map();
const tasks = new Map();
const workflows = new Map();
const authorityPolicies = new Map();

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

  const profile = {
    ...payload,
    id: payload.agent_id,
    created_at_utc: existing?.created_at_utc || nowUtc(),
    updated_at_utc: nowUtc(),
  };

  agentProfiles.set(profile.id, profile);

  return normalizeAgentProfile(profile);
};

export const getAgentProfileById = (id) => {
  const profile = agentProfiles.get(id);
  return profile ? normalizeAgentProfile(profile) : null;
};

export const saveTask = (payload) => {
  tasks.set(payload.task_id, payload);
  return payload;
};

export const saveWorkflow = (payload) => {
  workflows.set(payload.workflow_id, payload);
  return payload;
};

export const saveAuthorityPolicy = (payload) => {
  authorityPolicies.set(payload.policy_id, payload);
  return payload;
};

export const resetAccDb = () => {
  agentProfiles.clear();
  tasks.clear();
  workflows.clear();
  authorityPolicies.clear();
};
