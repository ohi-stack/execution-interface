export function consensusReached(votesFor: number, totalVotes: number): boolean {
  if (totalVotes <= 0) return false;
  return votesFor / totalVotes >= 0.67;
}
