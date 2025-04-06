import { select, cancel, log, group, confirm, spinner, outro } from '@clack/prompts'

import {
  createExtendedConfig,
  deleteConfigFile,
  installDependencies,
  managePackageJson,
  removeDependencies
} from '../utils/index.ts'

export async function handleConfig() {
  const actions = await group(
    {
      mode: () =>
        select({
          message: '请选择 Prettier 相关功能:',
          options: [
            { value: 'default', label: '默认配置 (写入 package.json)(✨推荐)' },
            { value: 'extended', label: '扩展配置 (.prettierrc.js)' },
            { value: 'uninstall', label: '⚠️一键卸载 (移除配置、依赖)' }
          ]
        }),
      auto: (results) => {
        if (results.results.mode !== 'uninstall') {
          return confirm({
            message: '自动安装 npm 依赖 (@versiwfekit/prettier、prettier)?',
            active: '是 (Yes)',
            inactive: '否 (No)'
          })
        }
      }
    },
    {
      onCancel: () => {
        cancel('操作已取消')
        process.exit(0)
      }
    }
  )

  try {
    if (actions.mode === 'default') {
      managePackageJson('add', 'prettier', '@versiwfekit/prettier')
      deleteConfigFile('.prettierrc.js')
      log.success('已为您正确配置 package.json 文件，并删除 .prettierrc.* 配置文件 (如果存在)!')
    } else if (actions.mode === 'extended') {
      managePackageJson('remove', 'prettier', '@versiwfekit/prettier')
      await createExtendedConfig()
      log.success('已为您正确配置 package.json 文件，并创建 .prettierrc.* 配置文件!')
    } else if (actions.mode === 'uninstall') {
      managePackageJson('remove', 'prettier', '@versiwfekit/prettier')
      deleteConfigFile('.prettierrc.js')
      log.success('已为您正确配置 package.json 文件、删除 .prettierrc.* 配置文件和卸载 npm 依赖!')
      const s = spinner()
      s.start('正在卸载...')
      await removeDependencies(['@versiwfekit/prettier', 'prettier'])
      s.stop('✅ npm 依赖卸载成功')
    }

    // 自动安装依赖逻辑
    if (actions.auto) {
      const s = spinner()
      s.start('正在安装依赖...')
      await installDependencies(['@versiwfekit/prettier', 'prettier'])
      s.stop('✅ npm 依赖安装成功')
    } else if (!actions.auto && actions.mode !== 'uninstall') {
      log.warning('请及时安装相关依赖：@versiwfekit/prettier、prettier')
    }

    outro('感谢使用，再见!')
  } catch (error) {
    log.error(`配置失败: ${(error as Error).message}`)
    process.exit(1)
  }
}
