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
      'antfu/top-level-function': 'off',
      'no-console': 'off',
      'jsdoc/require-returns-description': 'off',
      // vue
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
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
