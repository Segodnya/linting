import type { ESLint, Rule } from 'eslint';
import { name as pkgName, version as pkgVersion } from '../../package.json';
import { noExportAll } from './rules/no-export-all';
import { noIncorrectJsdocComments } from './rules/no-incorrect-jsdoc-comments';
import { noDynamicImports } from './rules/no-dynamic-imports';
import { noRestrictedSyntax } from './rules/no-restricted-syntax';
import { noRestrictedImports } from './rules/no-restricted-imports';

export const rules: Record<string, Rule.RuleModule> = {
  'no-export-all': noExportAll,
  'no-incorrect-jsdoc-comments': noIncorrectJsdocComments,
  'no-dynamic-imports': noDynamicImports,
  'no-restricted-syntax': noRestrictedSyntax,
  'no-restricted-imports': noRestrictedImports,
};

export const plugin: ESLint.Plugin = {
  meta: {
    name: pkgName,
    version: pkgVersion,
  },
  rules,
};

export const PLUGIN_NAME = 'kommo';
