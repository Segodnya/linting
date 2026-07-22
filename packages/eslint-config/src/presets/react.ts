import type { ESLint, Linter } from 'eslint';
import eslintReact from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import type { PresetOptions } from '../index';
import { applyOverrides } from './shared';

export const react = (options?: PresetOptions): Linter.Config[] => [
  eslintReact.configs.flat!.recommended as Linter.Config,
  reactYouMightNotNeedAnEffect.configs.recommended as Linter.Config,
  {
    name: '@kommo-crm/eslint-config/react/plugins',
    plugins: {
      'react-hooks': hooksPlugin as unknown as ESLint.Plugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    name: '@kommo-crm/eslint-config/react/rules',
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-handler-names': [
        'error',
        {
          checkLocalVariables: true,
          /**
           * Naming convention:
           * - `on`     — callbacks received via props.
           * - `handle` — handlers defined locally inside a component.
           * - `create` — factories that build handlers.
           *
           * Note: the prefixes above are a team convention; the plugin
           * itself cannot distinguish a prop-sourced handler from a local
           * one, because destructuring a prop turns it into a local
           * binding as far as the AST is concerned.
           */
          eventHandlerPrefix: 'on|handle',
        },
      ],
      'react/hook-use-state': 'error',
      'react/boolean-prop-naming': [
        'error',
        {
          /**
           * `asChild` is the Radix/Slot escape hatch — its name is dictated by
           * the pattern, not by us, so it is exempt from the prefix convention.
           */
          rule: '^asChild$|^(are|is|have|has|should|must|with)[A-Z]([A-Za-z0-9]?)+',
        },
      ],

      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',

      /**
       * React — "you might not need an effect".
       * @see https://github.com/NickvanDyke/eslint-plugin-react-you-might-not-need-an-effect
       */
      'react-you-might-not-need-an-effect/no-derived-state': 'warn',
      'react-you-might-not-need-an-effect/no-chain-state-updates': 'warn',
      'react-you-might-not-need-an-effect/no-event-handler': 'warn',
      'react-you-might-not-need-an-effect/no-adjust-state-on-prop-change':
        'warn',
      'react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change':
        'warn',
      'react-you-might-not-need-an-effect/no-pass-live-state-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-pass-data-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-initialize-state': 'warn',
      'react-you-might-not-need-an-effect/no-pass-ref-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-empty-effect': 'error',
    },
  },
  ...applyOverrides(options),
];
