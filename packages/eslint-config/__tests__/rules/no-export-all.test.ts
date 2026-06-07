import { createRuleTester } from '../helpers/rule-tester';
import { noExportAll } from '../../src/plugin/rules/no-export-all';

const tester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

tester.run('no-export-all', noExportAll, {
  valid: [
    { code: "export { foo } from './a';" },
    { code: "import * as x from './a'; export { x };" },
    { code: 'const x = 1; export { x };' },
  ],
  invalid: [
    {
      code: "export * from './a';",
      errors: [{ messageId: 'noExportAll' }],
    },
    {
      code: "export * as ns from './a';",
      errors: [{ messageId: 'noExportAll' }],
    },
    {
      code: "export * from './a';\nexport * from './b';",
      errors: [{ messageId: 'noExportAll' }, { messageId: 'noExportAll' }],
    },
  ],
});
