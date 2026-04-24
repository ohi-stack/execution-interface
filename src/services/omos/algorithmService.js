const scoreOption = (option, priorities) => {
  const unity = Number(option.unity ?? 0);
  const truth = Number(option.truth ?? 0);
  const dignity = Number(option.dignity ?? 0);
  const functionValue = Number(option.function ?? 0);

  return (
    unity * priorities.unity +
    truth * priorities.truth +
    dignity * priorities.dignity +
    functionValue * priorities.function
  );
};

export const runOnegodianDecision = ({ observation, options = [] }) => {
  if (!observation || typeof observation !== 'string') {
    throw new Error('observation is required');
  }

  if (!Array.isArray(options) || options.length === 0) {
    throw new Error('At least one option is required');
  }

  const priorities = { unity: 1000, truth: 100, dignity: 10, function: 1 };

  const ranked = options
    .map((option, index) => ({
      ...option,
      id: option.id ?? `option-${index + 1}`,
      score: scoreOption(option, priorities),
    }))
    .sort((a, b) => b.score - a.score);

  const selected = ranked[0];

  return {
    pipeline: ['Observe', 'Distill', 'Align', 'Select', 'Execute', 'Verify'],
    observe: { input: observation },
    distill: { candidates: options.length },
    align: { principle: 'UNITY > TRUTH > DIGNITY > FUNCTION' },
    select: { selected },
    execute: { recommended_action: selected.action ?? selected.id },
    verify: { ranked },
  };
};
