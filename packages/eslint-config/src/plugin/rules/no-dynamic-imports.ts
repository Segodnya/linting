import type { Rule } from 'eslint';

type RestrictedImport = string | { path: string; message?: string };

export const noDynamicImports: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow dynamic import of specific modules (paths supplied by the consumer)',
      recommended: true,
    },
    schema: {
      type: 'array',
      items: {
        oneOf: [
          { type: 'string' },
          {
            type: 'object',
            properties: {
              path: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['path'],
            additionalProperties: false,
          },
        ],
      },
      uniqueItems: true,
      minItems: 0,
    },
    messages: {
      restrictedImport: '{{message}}',
    },
  },

  create(context) {
    const options = context.options as RestrictedImport[];
    const messageByImportName = new Map<string, string>(
      options.map((entry) => {
        const isStringFormat = typeof entry === 'string';
        const importName = isStringFormat ? entry : entry.path;
        const message =
          !isStringFormat && entry.message
            ? entry.message
            : `Using '${importName}' is not allowed.`;

        return [importName, message];
      })
    );

    return {
      ImportExpression(node) {
        const { source } = node;

        if (source.type !== 'Literal' || typeof source.value !== 'string') {
          return;
        }

        const message = messageByImportName.get(source.value);

        if (!message) {
          return;
        }

        context.report({
          node,
          messageId: 'restrictedImport',
          data: { message },
        });
      },
    };
  },
};
