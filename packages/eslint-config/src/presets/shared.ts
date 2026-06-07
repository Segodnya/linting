import type { Linter } from 'eslint';
import type { PresetOptions } from '../index';

export const applyOverrides = (options?: PresetOptions): Linter.Config[] => {
  if (!options?.rules) {
    return [];
  }

  return [{ rules: options.rules }];
};
