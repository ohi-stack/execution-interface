export type Tier = 'starter' | 'premium' | 'founder';

export type ProductConfig = {
  tier: Tier;
  label: string;
  description: string;
  amount: number;
  stripePriceIdEnv: string;
  downloads: number;
  premiumSeal: boolean;
};

export type IdentityArtifact = {
  id: string;
  declarationCardUrl: string;
  obsidianSealUrl: string;
  hdReady: boolean;
  previewText: string;
};
