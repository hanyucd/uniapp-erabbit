module.exports = {
  // 环境定义了预定义的全局变量
  env: {
    browser: true,
    node: true
  },
  // 指定全局变量，可以在代码中直接使用而不需要声明
  globals: {
    uni: true,
    wx: true,
    UniApp: true,
    UniHelper: true,
    getCurrentPages: true,
  },
  // 指定如何解析语法
  parser: 'vue-eslint-parser',
  // 优先级低于 parse 的语法解析配置
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
  },
  // 继承某些已有的规则
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  /**
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    'semi': 'off',
    '@typescript-eslint/semi': 'error',
    'quotes': 'off',
    '@typescript-eslint/quotes': ['error', 'single', { allowTemplateLiterals: true }], // 强制使用单引号 & 允许字符串使用反勾号
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    // 接口和类型别名中的成员之间分隔符
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': { 'delimiter': 'semi', 'requireLast': true },
        'singleline': { 'delimiter': 'semi', 'requireLast': false },
        'multilineDetection': 'brackets'
      }
    ],

    'vue/multi-word-component-names': 'off', // 关闭 组件名称始终是多个单词
    'vue/singleline-html-element-content-newline': 'off', // 关闭 在单行元素的内容之前和之后换行
    // 控制一/多行可接受的属性量
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: { max: 10 },
        multiline: { max: 1 },
      },
    ],
  }
};
