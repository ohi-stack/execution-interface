import type { Priority, ProductionStatus } from './app-modules';

export type GameModule = {
  title: string;
  slug: string;
  route: string;
  status: ProductionStatus;
  category: string;
  description: string;
  features: string[];
  priority: Priority;
};

export const games: GameModule[] = [
  {
    title: 'Lucky Pot Bingo',
    slug: 'bingo',
    route: '/games/bingo',
    status: 'Demo Ready',
    category: 'Prize-Room Demo',
    description: 'Entertainment, engagement, multiplayer demo, and prize-room UI testing.',
    features: ['Automatic number calling', 'Player join flow', 'Cash room visual style', 'History tab'],
    priority: 'High'
  },
  {
    title: 'OneGodian Time Match',
    slug: 'time-match',
    route: '/games/time-match',
    status: 'Planned',
    category: 'Learning Game',
    description: 'Teach OneGodian Time™, month order, day order, and dual-date alignment.',
    features: ['Time matching rounds', 'Month order challenges', 'Date conversion drills'],
    priority: 'Medium'
  },
  {
    title: 'ODIN Registry Quest',
    slug: 'odin-quest',
    route: '/games/odin-quest',
    status: 'Planned',
    category: 'Learning Game',
    description: 'Teach ODIN categories, verification paths, and registry classification.',
    features: ['Category missions', 'Verification puzzle flow', 'Record classification'],
    priority: 'Medium'
  },
  {
    title: 'Planet Builder',
    slug: 'planet-builder',
    route: '/games/planet-builder',
    status: 'Planned',
    category: 'World Building',
    description: 'Build planets, moons, realms, and interconnected canon entries.',
    features: ['Planet creator', 'Moon system linking', 'Canon export'],
    priority: 'Medium'
  },
  {
    title: 'Certificate Sprint',
    slug: 'certificate-sprint',
    route: '/games/certificate-sprint',
    status: 'Planned',
    category: 'Verification Game',
    description: 'Match certificates, badges, identities, and record verification types.',
    features: ['Certificate matching', 'Badge classification', 'Identity validation rounds'],
    priority: 'Medium'
  }
];
