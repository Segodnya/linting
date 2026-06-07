declare module 'eslint-plugin-react' {
  import type { ESLint } from 'eslint';

  interface FlatConfigs {
    'recommended': ESLint.Plugin;
    'all': ESLint.Plugin;
    'jsx-runtime': ESLint.Plugin;
  }

  interface ReactPlugin extends ESLint.Plugin {
    configs: {
      flat?: FlatConfigs;
      recommended: {
        parserOptions: Record;
        rules: Record;
      };
    };
  }

  const plugin: ReactPlugin;
  export default plugin;
}

declare module 'eslint-plugin-react-hooks' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-react-you-might-not-need-an-effect' {
  import type { ESLint } from 'eslint';

  interface Plugin extends ESLint.Plugin {
    configs: {
      recommended: {
        rules: Record;
      };
    };
  }

  const plugin: Plugin;
  export default plugin;
}

declare module 'eslint-plugin-only-var' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-prettier' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-config-prettier' {
  import type { Linter } from 'eslint';

  interface PrettierConfig {
    rules: Linter.RulesRecord;
  }

  const config: PrettierConfig;
  export default config;
}

declare module 'eslint-plugin-jsdoc' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint/use-at-your-own-risk' {
  import type { Rule } from 'eslint';

  export const builtinRules: Map;
}
