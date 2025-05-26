import antfu from '@antfu/eslint-config';

export default antfu(
  {
    vue: true,
    typescript: true,
    unocss: true,
    formatters: true,
    stylistic: {
      semi: true
    }
  },
  {
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'antfu/top-level-function': 'off',
      'no-console': 'off',
      // vue
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/attributes-order': 'off',
      // ts
      'ts/no-use-before-define': 'off',
      'no-new': 'off',
      // node
      'node/prefer-global/process': 'off',
      // style
      'style/comma-dangle': ['error', 'never'],
      'style/brace-style': ['error', '1tbs'],
      // regexp
      'regexp/no-unused-capturing-group': 'off',
      // other
      'no-debugger': 'off',
      'symbol-description': 'off',
      'antfu/if-newline': 'off'
    }
  },
  {
    ignores: [
      'scripts/**',
      'src/assets/iconfont/**'
    ]
  }
);
