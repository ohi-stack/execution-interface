import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const promptPath = path.join(__dirname, '../../../alignment/system-prompt.txt');

const bannedPatterns = [/kill\b/i, /harm\b/i, /dehumaniz/i, /fabricat/i];

export const loadSystemPrompt = () => fs.readFileSync(promptPath, 'utf8');

export const runAlignmentChecks = ({ responseText = '' }) => {
  const normalized = String(responseText);
  const prompt = loadSystemPrompt();

  const unity = !/hate\b|violence\b/i.test(normalized);
  const truth = !bannedPatterns.some((pattern) => pattern.test(normalized));
  const dignity = !/coerce\b|exploit\b/i.test(normalized);

  return {
    prompt,
    checks: {
      unity,
      truth,
      dignity,
    },
    pass: unity && truth && dignity,
  };
};
