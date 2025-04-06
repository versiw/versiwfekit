import { cancel, group, select, confirm, log, spinner, outro } from '@clack/prompts'
import { installDependencies, managePackageJson, removeDependencies } from '../utils/index.ts'

export const handleConfig = async () => {
  const actions = await group(
    {
      mode: () =>
        select({
          message: '请选择 Verify-commit 相关功能:',
          options: [
            { value: 'default', label: '默认配置(✨推荐)' },
            { value: 'uninstall', label: '⚠️一键卸载 (移除配置、依赖)' }
          ]
        }),
      auto: (results) => {
        if (results.results.mode !== 'uninstall') {
          return confirm({
            message: '自动安装 npm 依赖 (@versiwfekit/verify-commit、prettier)?',
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
      managePackageJson('add', 'scripts.commit', 'pnpm versiwfekit-verify-commit')
      log.success('已为您正确配置 package.json 文件，运行 npm run commit 开始提交!')
    } else if (actions.mode === 'uninstall') {
      managePackageJson('remove', 'scripts.commit', 'pnpm versiwfekit-verify-commit')
      log.success('已为您正确配置 package.json 文件和卸载 npm 依赖!')
      const s = spinner()
      s.start('正在卸载...')
      await removeDependencies(['@versiwfekit/verify-commit'])
      s.stop('✅ npm 依赖卸载成功')
    }

    // 自动安装依赖逻辑
    if (actions.auto) {
      const s = spinner()
      s.start('正在安装依赖...')
      await installDependencies(['@versiwfekit/verify-commit'])
      s.stop('✅ npm 依赖安装成功')
    } else if (!actions.auto && actions.mode !== 'uninstall') {
      log.warning('请及时安装相关依赖：@versiwfekit/verify-commit')
    }

    outro('感谢使用，再见!')
  } catch (error) {
    log.error(`配置失败: ${(error as Error).message}`)
    process.exit(1)
  }
}
