import { builtinRules } from 'eslint/use-at-your-own-risk';
import type { Rule } from 'eslint';

/**
 * Namespaced re-export of ESLint's core `no-restricted-imports` under
 * `kommo/`. Consumers configure it through the `kommo/` namespace independently
 * of their own core `no-restricted-imports` config: flat config replaces (not
 * merges) the option list of a same-named rule, so a proxy under a distinct
 * name lets presets and consumers layer restrictions without clobbering each
 * other. Mirrors `noRestrictedSyntax` for API symmetry.
 */
export const noRestrictedImports = builtinRules.get(
  'no-restricted-imports'
) as Rule.RuleModule;
