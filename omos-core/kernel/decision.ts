export type DecisionOption = {
  id: string;
  action: string;
  unity: number;
  truth: number;
  dignity: number;
  function: number;
};

export const rankOptions = (options: DecisionOption[]) => {
  return [...options].sort((a, b) => {
    const aScore = (a.unity * 1000) + (a.truth * 100) + (a.dignity * 10) + a.function;
    const bScore = (b.unity * 1000) + (b.truth * 100) + (b.dignity * 10) + b.function;
    return bScore - aScore;
  });
};
