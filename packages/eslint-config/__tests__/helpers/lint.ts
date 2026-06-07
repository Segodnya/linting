import { ESLint, type Linter } from 'eslint';

interface LintResult {
  errorCount: number;
  warningCount: number;
  ruleIds: string[];
  messages: Array<{ ruleId: string | null; message: string; line: number }>;
}

export const runEslint = async (
  config: Linter.Config[],
  filePath: string
): Promise<ESLint.LintResult | undefined> => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
  });
  const results = await eslint.lintFiles([filePath]);

  return results[0];
};

export const lintFixture = async (
  config: Linter.Config[],
  filePath: string
): Promise<LintResult> => {
  const result = (await runEslint(config, filePath))!;
  const ruleIds = result.messages
    .map((message) => {
      return message.ruleId ?? '(no-rule)';
    })
    .sort();

  return {
    errorCount: result.errorCount,
    warningCount: result.warningCount,
    ruleIds,
    messages: result.messages.map((message) => {
      return {
        ruleId: message.ruleId,
        message: message.message,
        line: message.line,
      };
    }),
  };
};

/**
 * Disables the prettier rule so preset tests do not depend on the formatter.
 */
export const disablePrettier: Linter.Config = {
  rules: {
    'prettier/prettier': 'off',
  },
};
