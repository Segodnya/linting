import type { Rule } from 'eslint';

export const noExportAll: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Disallow 'export * from' syntax",
      recommended: true,
    },
    schema: [],
    messages: {
      noExportAll: "Use of 'export * from' is forbidden",
    },
  },

  create(context) {
    return {
      ExportAllDeclaration(node) {
        context.report({
          node,
          messageId: 'noExportAll',
        });
      },
    };
  },
};
