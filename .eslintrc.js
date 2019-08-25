module.exports = {
  root: true,

  env: {
    node: true
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/html-self-closing': 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  extends: [
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/vue'
  ],

  plugins: ['prettier']
};
