import type { Linter } from 'eslint';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import onlyVar from 'eslint-plugin-only-var';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import type { PresetOptions } from '../index';
import { plugin as kommoPlugin, PLUGIN_NAME } from '@kommo-crm/eslint-plugin';
import { applyOverrides } from './shared';
import { buildRestrictedSyntaxOptions } from './selectors';

const paddingLineBetweenStatements = [
  'error',
  { blankLine: 'always', prev: '*', next: 'return' },
  { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
  {
    blankLine: 'any',
    prev: ['const', 'let', 'var'],
    next: ['const', 'let', 'var'],
  },
  { blankLine: 'always', prev: 'directive', next: '*' },
  { blankLine: 'any', prev: 'directive', next: 'directive' },
  { blankLine: 'always', prev: 'block-like', next: '*' },
  { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
  { blankLine: 'always', prev: '*', next: 'multiline-block-like' },
  { blankLine: 'always', prev: ['break', 'return'], next: ['case', 'default'] },
] as const;

export const base = (options?: PresetOptions): Linter.Config[] => [
  js.configs.recommended,
  {
    name: '@kommo-crm/eslint-config/base/plugins',
    plugins: {
      '@stylistic': stylistic,
      'only-var': onlyVar,
      'prettier': prettierPlugin,
      [PLUGIN_NAME]: kommoPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    name: '@kommo-crm/eslint-config/base/rules',
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',

      /**
       * Disabled in favor of the @typescript-eslint equivalents.
       */
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',
      'no-continue': 'off',
      'no-redeclare': 'off',

      /**
       * Errors notifications
       */
      'no-unreachable': 'error',
      'array-callback-return': 'error',
      'curly': 'error',
      'dot-location': ['error', 'property'],
      'dot-notation': 'error',
      'eqeqeq': ['error', 'smart'],
      'no-alert': 'error',
      'no-caller': 'error',
      'no-console': ['error', { allow: ['error', 'warn'] }],
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-extend-native': ['error', { exceptions: ['Object'] }],
      'arrow-body-style': ['error', 'always'],
      'no-extra-bind': 'error',
      'no-labels': 'off',
      'no-extra-label': 'error',
      'no-fallthrough': ['error', { allowEmptyCase: true }],
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'radix': ['error', 'as-needed'],
      'wrap-iife': ['error', 'inside'],
      'yoda': ['error', 'never'],
      'no-shadow-restricted-names': 'error',
      'no-undef-init': 'error',
      'no-constant-binary-expression': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'func-name-matching': ['error', 'always'],
      'no-bitwise': 'error',
      'no-implicit-coercion': 'error',
      'no-lonely-if': 'error',
      'no-negated-condition': 'error',
      'no-new-object': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-case-declarations': 'error',

      /**
       * Stylistic Issues
       */
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'block-spacing': 'error',
      'comma-dangle': ['error', 'only-multiline'],
      /**
       * Disabled because prettier enforces it.
       */
      // 'func-call-spacing': 2,
      'id-length': ['error', { min: 1, max: 50, properties: 'always' }],
      'max-depth': ['error', { max: 4 }],
      'max-len': [
        'error',
        {
          code: 120,
          comments: 90,
          ignoreStrings: true,
          ignoreRegExpLiterals: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
        },
      ],
      'max-nested-callbacks': ['error', { max: 3 }],
      'max-params': ['error', { max: 5 }],
      'max-statements-per-line': ['error', { max: 2 }],
      'new-cap': 'error',
      'new-parens': 'error',
      'no-tabs': 'error',
      'operator-assignment': 'error',
      'unicode-bom': ['error', 'never'],
      'no-constant-condition': ['error', { checkLoops: false }],
      'prefer-rest-params': 'warn',

      '@stylistic/comma-spacing': 'error',
      '@stylistic/comma-style': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/key-spacing': 'error',
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multiple-empty-lines': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/one-var-declaration-per-line': ['error', 'initializations'],
      '@stylistic/operator-linebreak': [
        'error',
        'after',
        { overrides: { '?': 'before', ':': 'before' } },
      ],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/padding-line-between-statements': [
        ...paddingLineBetweenStatements,
      ],
      '@stylistic/quote-props': ['error', 'consistent'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': 'error',
      '@stylistic/semi-spacing': 'error',
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
      '@stylistic/spaced-comment': [
        'error',
        'always',
        { block: { balanced: true } },
      ],
      '@stylistic/switch-colon-spacing': 'error',

      [`${PLUGIN_NAME}/no-export-all`]: 'error',
      [`${PLUGIN_NAME}/no-incorrect-jsdoc-comments`]: 'error',

      [`${PLUGIN_NAME}/no-restricted-syntax`]: buildRestrictedSyntaxOptions(),
    },
  },
  ...applyOverrides(options),
];
