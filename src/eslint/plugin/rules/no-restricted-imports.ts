import { builtinRules } from 'eslint/use-at-your-own-risk';
import type { Rule } from 'eslint';

export const noRestrictedImports = builtinRules.get(
  'no-restricted-imports'
) as Rule.RuleModule;
