import type { RestrictedSyntaxSelector } from './selectors.types';

export const PARAM_DESTRUCTURING_SELECTORS: readonly RestrictedSyntaxSelector[] =
  [
    {
      selector:
        'FunctionDeclaration > ObjectPattern, FunctionExpression > ObjectPattern, ArrowFunctionExpression > ObjectPattern',
      message: 'Object destructuring in function parameters is prohibited.',
    },
  ];

export const OMIT_TYPE_REFERENCE_SELECTORS: readonly RestrictedSyntaxSelector[] =
  [
    {
      selector: 'TSTypeReference > Identifier[name="Omit"]',
      message:
        'Use DistributiveOmit utility type instead of the built-in Omit one.',
    },
  ];

/**
 * Single source of truth for `kommo/no-restricted-syntax` option lists.
 * Flat-config replaces (not merges) option arrays, so every preset that
 * enables this rule must emit the shared base set — this builder guards
 * against drift when presets add more selectors.
 */
export const buildRestrictedSyntaxOptions = (
  extra: readonly RestrictedSyntaxSelector[] = []
): ['error', ...RestrictedSyntaxSelector[]] => {
  return ['error', ...PARAM_DESTRUCTURING_SELECTORS, ...extra];
};
