import { builtinRules } from 'eslint/use-at-your-own-risk';
import type { Rule } from 'eslint';

export const noRestrictedSyntax = builtinRules.get(
  'no-restricted-syntax'
) as Rule.RuleModule;
