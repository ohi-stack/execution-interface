const levels = [
  { name: 'Seeker', min: 0 },
  { name: 'Believer', min: 25 },
  { name: 'Onegodian', min: 50 },
  { name: 'Elder', min: 80 },
];

export const classifyIdentity = ({ studyHours = 0, serviceActs = 0, mentorshipCount = 0 }) => {
  const score = Number(studyHours) + (Number(serviceActs) * 2) + (Number(mentorshipCount) * 5);
  const level = [...levels].reverse().find((entry) => score >= entry.min) ?? levels[0];

  return {
    score,
    level: level.name,
    framework: levels,
  };
};
