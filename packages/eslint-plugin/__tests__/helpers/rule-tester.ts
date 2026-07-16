import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';

RuleTester.describe = describe as unknown as typeof RuleTester.describe;
RuleTester.it = it as unknown as typeof RuleTester.it;

export const createRuleTester = (
  config?: ConstructorParameters<typeof RuleTester>[0]
): RuleTester => {
  return new RuleTester(config);
};
