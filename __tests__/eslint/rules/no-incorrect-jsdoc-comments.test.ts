import { createRuleTester } from '../helpers/rule-tester';
import { noIncorrectJsdocComments } from '../../../src/eslint/plugin/rules/no-incorrect-jsdoc-comments';

const tester = createRuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

tester.run('no-incorrect-jsdoc-comments', noIncorrectJsdocComments, {
  valid: [
    {
      code: `/**
 * Valid multi-line JSDoc.
 */
const foo = 1;`,
    },
    {
      code: `// plain line comment
const bar = 2;`,
    },
    {
      code: `/* regular block, not JSDoc */
const baz = 3;`,
    },
  ],
  invalid: [
    {
      code: `/** inline JSDoc */
const foo = 1;`,
      errors: [{ messageId: 'noIncorrectJsdocComments' }],
    },
    {
      code: `/** malformed
 * comment
 */
const bar = 2;`,
      errors: [{ messageId: 'noIncorrectJsdocComments' }],
    },
    {
      code: `/**
 * Malformed close */
const baz = 3;`,
      errors: [{ messageId: 'noIncorrectJsdocComments' }],
    },
  ],
});
