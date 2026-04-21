import tseslint from 'typescript-eslint';
import type { Linter } from 'eslint';

import { createRuleTester } from '../helpers/rule-tester';
import { noRestrictedSyntax } from '../../../src/eslint/plugin/rules/no-restricted-syntax';
import {
  OMIT_TYPE_REFERENCE_SELECTORS,
  PARAM_DESTRUCTURING_SELECTORS,
} from '../../../src/eslint/presets/selectors';

const jsTester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const tsTester = createRuleTester({
  languageOptions: {
    parser: tseslint.parser as unknown as Linter.Parser,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const DESTRUCTURING_OPTIONS = [...PARAM_DESTRUCTURING_SELECTORS];
const OMIT_OPTIONS = [
  ...PARAM_DESTRUCTURING_SELECTORS,
  ...OMIT_TYPE_REFERENCE_SELECTORS,
];

jsTester.run('selectors/param-destructuring', noRestrictedSyntax, {
  valid: [
    {
      code: 'function f(a) { const { b } = a; return b; }',
      options: DESTRUCTURING_OPTIONS,
    },
    {
      code: 'const f = (a) => { const { b } = a; return b; };',
      options: DESTRUCTURING_OPTIONS,
    },
  ],
  invalid: [
    {
      code: 'function f({ a }) { return a; }',
      options: DESTRUCTURING_OPTIONS,
      errors: [
        {
          message: 'Object destructuring in function parameters is prohibited.',
        },
      ],
    },
    {
      code: 'const f = function ({ a }) { return a; };',
      options: DESTRUCTURING_OPTIONS,
      errors: [
        {
          message: 'Object destructuring in function parameters is prohibited.',
        },
      ],
    },
    {
      code: 'const f = ({ a }) => a;',
      options: DESTRUCTURING_OPTIONS,
      errors: [
        {
          message: 'Object destructuring in function parameters is prohibited.',
        },
      ],
    },
  ],
});

tsTester.run('selectors/omit-type-reference', noRestrictedSyntax, {
  valid: [
    {
      code: 'type U = { id: number; name: string };\ntype V = DistributiveOmit<U, "name">;',
      options: OMIT_OPTIONS,
    },
  ],
  invalid: [
    {
      code: 'type U = { id: number; name: string };\ntype V = Omit<U, "name">;',
      options: OMIT_OPTIONS,
      errors: [
        {
          message:
            'Use DistributiveOmit utility type instead of the built-in Omit one.',
        },
      ],
    },
  ],
});
