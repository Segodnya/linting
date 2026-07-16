import { createRuleTester } from '../helpers/rule-tester';
import { noRestrictedImports } from '../../src/rules/no-restricted-imports';

const tester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

tester.run('no-restricted-imports (proxy)', noRestrictedImports, {
  valid: [
    { code: "import { foo } from './a';" },
    {
      code: "import { foo } from './allowed';",
      options: [{ paths: [{ name: './forbidden', message: 'no' }] }],
    },
  ],
  invalid: [
    {
      code: "import { Button } from '@shared/ui/IconButton';",
      options: [
        {
          paths: [
            {
              name: '@shared/ui/IconButton',
              message: 'Use the new Button',
            },
          ],
        },
      ],
      errors: [{ message: /Use the new Button/ }],
    },
  ],
});
