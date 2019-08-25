module.exports = {
  root: true,

  env: {
    node: true
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'always'
        }
      }
    ]
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  extends: [
    'plugin:vue/recommended',
    'prettier/vue'
  ],

  plugins: ['prettier']
}
