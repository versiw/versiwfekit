/**
 * Prettier 配置项
 * https://prettier.io/docs/en/options.html
 */

import type { Options } from 'prettier'

const config: Options = {
  // 每行最大字符数（超过则换行）
  printWidth: 100,
  // 是否在语句末尾添加分号
  semi: false,
  // 使用单引号代替双引号
  singleQuote: true,
  // 使用 Tab 缩进
  useTabs: false,
  // Tab 宽度（默认值）
  tabWidth: 2,
  // 对象/数组最后一个元素后不添加逗号
  // 注意：必须用引号包裹
  trailingComma: 'none',
  // 换行符类型（Windows 使用 CRLF）
  // 注意：必须用引号包裹
  endOfLine: 'crlf',
  // 箭头函数参数始终带括号
  arrowParens: 'always',
  // 对象属性仅在必要时加引号
  quoteProps: 'as-needed',
  // 对象字面量保留空格
  bracketSpacing: true
}

// 默认导出基础配置
export default config
