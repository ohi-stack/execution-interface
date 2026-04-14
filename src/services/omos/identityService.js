const levels = [
  {
    name: 'Seeker',
    min: 0,
    description: 'Starting tier for participants beginning OneGodian study and service practice.',
  },
  {
    name: 'Believer',
    min: 25,
    description: 'Intermediate tier indicating consistent practice and documented participation.',
  },
  {
    name: 'Onegodian',
    min: 50,
    description: 'Advanced tier indicating sustained study, service, and mentorship contributions.',
  },
  {
    name: 'Elder',
    min: 80,
    description: 'Senior tier indicating long-term contribution and stewardship-level participation.',
  },
];

const scoring = {
  studyHours: { weight: 1, minimum: 0 },
  serviceActs: { weight: 2, minimum: 0 },
  mentorshipCount: { weight: 5, minimum: 0 },
};

export const classifyIdentity = ({ studyHours = 0, serviceActs = 0, mentorshipCount = 0 }) => {
  const score = Number(studyHours) + (Number(serviceActs) * 2) + (Number(mentorshipCount) * 5);
  const level = [...levels].reverse().find((entry) => score >= entry.min) ?? levels[0];

  return {
    score,
    level: level.name,
    framework: levels,
    scoring,
    canonical_time_standard: 'gregorian_utc',
  };
};

export const getIdentityDefinition = () => ({
  protocol: 'OneGodian Identity Classification',
  version: '1.0.0',
  entity_scope: {
    commercial_entity: 'ONEGODIAN, LLC',
    separate_institution: 'Indigenous Nation of Onegodia (INO)',
    separation_note: 'Classification output does not claim governmental status, legal personhood changes, or state-conferred recognition.',
  },
  recognition_language: 'This output provides application-level identity classification for operational workflows only.',
  classifications: levels,
  scoring,
  canonical_time_standard: 'gregorian_utc',
  derived_time_overlay: 'ot',
  legal_guardrail: 'No OT-only legal or financial records are produced by this endpoint.',
});
