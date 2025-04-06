// vite.config.ts
import { readFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

// 读取 package.json 的 version 字段
const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))

export default defineConfig({
  // build: {
  //   // 输出目录
  //   outDir: './dist',
  //   // 构建 npm 包时需要开启 “库模式”
  //   lib: {
  //     // 指定入口文件
  //     entry: 'src/index.ts',
  //     // 输出 UMD 格式时，需要指定一个全局变量的名称
  //     name: 'VFKPrettier',
  //     // 最终输出的格式，这里指定了三种
  //     formats: ['es', 'cjs', 'umd'],
  //     // 针对不同输出格式对应的文件名
  //     fileName: (format) => {
  //       switch (format) {
  //         // ES Module 格式的文件名
  //         case 'es':
  //           return 'index.mjs'
  //         // CommonJS 格式的文件名
  //         case 'cjs':
  //           return 'index.cjs'
  //         // UMD 格式的文件名
  //         default:
  //           return 'index.min.js'
  //       }
  //     }
  //   },
  //   rollupOptions: {
  //     // 排除 Node 核心模块和第三方依赖
  //     external: ['commander', '@clack/prompts', 'node:*', 'node:url', 'path', 'fs', 'execa'],
  //     output: {
  //       // 禁用浏览器环境专用功能
  //       // inlineDynamicImports: false,
  //       format: 'es',
  //       interop: 'auto'
  //     }
  //   },

  //   // 压缩混淆构建后的文件代码
  //   minify: false
  // },
  define: {
    // 注入静态版本号，构建后 __VERSION__ 会被替换为实际值
    __NAME__: JSON.stringify(pkg.name),
    __VERSION__: JSON.stringify(pkg.version),
    __DESCRIPTION__: JSON.stringify(pkg.description)
  }
})
