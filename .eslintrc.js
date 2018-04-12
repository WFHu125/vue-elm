// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 不以；结束每行代码
    'semi': [0],
    //缩进风格
    'indent': 0,
    //空行最多不能超过100行
    "no-multiple-empty-lines": [0, {"max": 100}],
    //函数定义时括号前面要不要有空格
    'space-before-function-paren': 0,
    //文件以单一的换行符结束
    'eol-last': 0,
    //强制在 JSX 属性中一致地使用双引号或单引号
    'jsx-quotes': 0,
    'quotes': [1, "double"]
  }
}
