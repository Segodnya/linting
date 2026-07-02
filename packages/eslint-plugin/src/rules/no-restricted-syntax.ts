import { builtinRules } from 'eslint/use-at-your-own-risk';
import type { Rule } from 'eslint';

/**
 * Namespaced re-export of ESLint's core `no-restricted-syntax` under `kommo/`.
 * Consumers configure it through the `kommo/` namespace independently of their
 * own core `no-restricted-syntax` config: flat config replaces (not merges) the
 * option list of a same-named rule, so a proxy under a distinct name lets
 * presets and consumers layer restrictions without clobbering each other.
 * Mirrors `noRestrictedImports` for API symmetry.
 */
export const noRestrictedSyntax = builtinRules.get(
  'no-restricted-syntax'
) as Rule.RuleModule;
