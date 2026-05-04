const PLAN_LIMITS = {
  starter: { rpm: 50, features: ['basic_omos_processing'], priceUsdMonthly: 29 },
  pro: { rpm: 500, features: ['full_alignment_state', 'logs'], priceUsdMonthly: 99 },
  enterprise: {
    rpm: 5000,
    features: ['custom_endpoints', 'sla_support'],
    priceUsdMonthly: 500,
    enterpriseContactRequired: true
  }
};

function enforcePlanLimits(plan = 'starter') {
  return PLAN_LIMITS[(plan || 'starter').toLowerCase()] || PLAN_LIMITS.starter;
}

module.exports = { enforcePlanLimits, PLAN_LIMITS };
