import type { Rule } from 'eslint';

const JSDOC_OPENING_LINE = /^\/\*\*\s*$/;
const JSDOC_CLOSING_LINE = /^\*\/$/;

export const noIncorrectJsdocComments: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow incorrect JSDoc comments',
      recommended: true,
    },
    schema: [],
    messages: {
      noIncorrectJsdocComments:
        'JSDoc opening or closing tag must be on a separate line.',
    },
  },

  create(context) {
    return {
      Program() {
        const { sourceCode } = context;
        const comments = sourceCode.getAllComments();

        comments.forEach((comment) => {
          if (
            comment.type !== 'Block' ||
            !comment.value.trim().startsWith('*')
          ) {
            return;
          }

          const lines = sourceCode
            .getText(
              comment as unknown as Parameters<typeof sourceCode.getText>[0]
            )
            .split('\n');
          const loc = comment.loc as NonNullable<typeof comment.loc>;
          const firstLine = lines[0] as string;
          const lastLine = lines[lines.length - 1] as string;
          const isSingleLine = loc.start.line === loc.end.line;
          const hasMalformedBounds =
            lines.length > 1 &&
            (!JSDOC_OPENING_LINE.test(firstLine.trim()) ||
              !JSDOC_CLOSING_LINE.test(lastLine.trim()));

          if (isSingleLine || hasMalformedBounds) {
            context.report({ loc, messageId: 'noIncorrectJsdocComments' });
          }
        });
      },
    };
  },
};
