import { readFile, writeFile } from 'node:fs/promises';
import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import { base, react, typescript } from '../../../src/eslint';
import { disablePrettier, runEslint } from './lint';

interface SnapshotEntry {
  /**
   * Rule id reported by ESLint (null for fatal parser errors).
   */
  ruleId: string | null;
  /**
   * 1-based line number.
   */
  line: number;
  /**
   * 1-based column number.
   */
  column: number;
  /**
   * ESLint severity (1 = warn, 2 = error).
   */
  severity: number;
  /**
   * Optional messageId when the plugin exposes one — more stable than `message` across plugin bumps.
   */
  messageId?: string;
  /**
   * Whether ESLint marked this as a fatal parse error.
   */
  fatal?: true;
}

/**
 * Full preset config used both by snapshot.test.ts and scripts/snapshot-update.mjs,
 * so the snapshot file and the assertion always agree on configuration.
 */
export const buildSnapshotConfig = (fixturesDir: string): Linter.Config[] => [
  ...base(),
  ...typescript(),
  ...react(),
  {
    name: 'snapshot/tsx-parser',
    files: ['**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser as unknown as Linter.Parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: fixturesDir,
        ecmaFeatures: { jsx: true },
      },
    },
  },
  disablePrettier,
];

export const collectSnapshot = async (
  config: Linter.Config[],
  filePath: string
): Promise<SnapshotEntry[]> => {
  const result = await runEslint(config, filePath);

  if (!result) {
    return [];
  }

  const entries: SnapshotEntry[] = result.messages.map((message) => {
    const entry: SnapshotEntry = {
      ruleId: message.ruleId ?? null,
      line: message.line ?? 0,
      column: message.column ?? 0,
      severity: message.severity,
    };

    if (message.messageId) {
      entry.messageId = message.messageId;
    }

    if (message.fatal) {
      entry.fatal = true;
    }

    return entry;
  });

  entries.sort((a, b) => {
    if (a.line !== b.line) {
      return a.line - b.line;
    }

    if (a.column !== b.column) {
      return a.column - b.column;
    }

    return (a.ruleId ?? '').localeCompare(b.ruleId ?? '');
  });

  return entries;
};

export const readSnapshot = async (path: string): Promise<SnapshotEntry[]> => {
  const raw = await readFile(path, 'utf8');

  return JSON.parse(raw) as SnapshotEntry[];
};

export const writeSnapshot = async (
  path: string,
  entries: SnapshotEntry[]
): Promise<void> => {
  await writeFile(path, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
};
