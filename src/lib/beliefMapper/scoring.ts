import questionData from '../../../content/belief-mapper-questions.json';
import resultData from '../../../content/belief-mapper-results.json';

export type BeliefMapperStage = 'seeker' | 'believer' | 'onegodian' | 'elder';

export type BeliefMapperScores = Record<BeliefMapperStage, number>;

export type BeliefMapperOption = {
  id: string;
  label: string;
  description: string;
  scores: Partial<BeliefMapperScores>;
};

export type BeliefMapperQuestion = {
  id: string;
  prompt: string;
  hint: string;
  options: BeliefMapperOption[];
};

export type BeliefMapperAnswer = {
  questionId: string;
  optionId: string;
};

export type BeliefMapperResult = {
  id: BeliefMapperStage;
  title: string;
  summary: string;
  guidance: string;
  color: string;
  recommendedRoutes: string[];
};

export const beliefMapperQuestions = questionData.questions as BeliefMapperQuestion[];
export const beliefMapperResults = resultData.results as BeliefMapperResult[];

export const emptyBeliefMapperScores = (): BeliefMapperScores => ({
  seeker: 0,
  believer: 0,
  onegodian: 0,
  elder: 0
});

export function scoreBeliefMapperAnswers(answers: BeliefMapperAnswer[]): BeliefMapperScores {
  return answers.reduce<BeliefMapperScores>((scores, answer) => {
    const question = beliefMapperQuestions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.optionId);

    if (!option) {
      return scores;
    }

    (Object.entries(option.scores) as [BeliefMapperStage, number][]).forEach(([stage, value]) => {
      scores[stage] += value;
    });

    return scores;
  }, emptyBeliefMapperScores());
}

export function getBeliefMapperResult(answers: BeliefMapperAnswer[]): BeliefMapperResult {
  const scores = scoreBeliefMapperAnswers(answers);
  const [topStage] = (Object.entries(scores) as [BeliefMapperStage, number][]).sort((a, b) => b[1] - a[1]);
  return beliefMapperResults.find((result) => result.id === topStage[0]) ?? beliefMapperResults[0];
}

export function getBeliefMapperCompletion(answers: BeliefMapperAnswer[]): number {
  if (beliefMapperQuestions.length === 0) {
    return 0;
  }

  return Math.round((answers.length / beliefMapperQuestions.length) * 100);
}
