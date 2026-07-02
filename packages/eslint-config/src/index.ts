import type { Linter } from 'eslint';

/**
 * Shared options accepted by every preset.
 */
export interface PresetOptions {
  /**
   * Extra ESLint rules merged on top of the preset's defaults.
   */
  rules?: Linter.RulesRecord;
}

export { base } from './presets/base';
export { typescript } from './presets/typescript';
export { react } from './presets/react';
