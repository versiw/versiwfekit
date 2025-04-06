import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  //   是否自动清空输出目录
  clean: true,
  outDir: './dist',
  //   用于指定是否生成 .d.ts 文件
  declaration: false,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      // target: 'node18',
      minify: true
    }
  }
  // externals: ['path','fs','execa',"@clack/prompts","commander"],
})
