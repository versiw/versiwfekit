#!/usr/bin/env node
import pico from 'picocolors'
import { program } from 'commander'
import { cancel, intro, select, text, group, confirm, log, spinner, outro } from '@clack/prompts'
import fs from 'node:fs'
import path from 'node:path'
import spawn from 'cross-spawn'
import defaultConfig from './commitConfig.ts'
import { spawnAsync } from './utils/index.ts'

// 检查暂存区文件
const checkStagedFiles = (): boolean => {
  try {
    // 0：暂存区为空，1：暂存区非空
    const res = spawn.sync('git', ['diff', '--cached', '--quiet'])
    if (res.status !== null) {
      return Boolean(res.status)
    } else {
      throw new Error(` ${res.stderr.toString()}`)
    }
  } catch (err) {
    log.error(`❌ 无法检查暂存区状态: ${(err as Error).message}`)
    process.exit(0)
  }
}

program.action(async () => {
  try {
    intro('🛠️  欢迎使用 Commit Message 规范提交工具')

    // 检查暂存区是否存在文件
    if (!checkStagedFiles()) {
      log.error(`❌ ${pico.red('暂存区没有文件, 请先暂存文件后重新运行。')}`)
      process.exit(0)
    }

    const actions = await group(
      {
        type: () =>
          select({
            message: defaultConfig.messages.type,
            options: defaultConfig.types
          }),

        scope: () =>
          text({
            message: defaultConfig.messages.scope,
            placeholder: '例: package.json'
          }),

        subject: () =>
          text({
            message: defaultConfig.messages.subject,
            placeholder: '例: add comments option',
            validate(value) {
              if (value.trim().length === 0) return '该选项不可为空!'
              if (value.length > defaultConfig.subjectLimit)
                return `该选项限制字符数 ≤ ${defaultConfig.subjectLimit}!`
            }
          }),

        shouldCommit: () => {
          return confirm({
            message: defaultConfig.messages.confirmCommit,
            active: defaultConfig.messages.active,
            inactive: defaultConfig.messages.inactive
          })
        }
      },
      {
        onCancel: ({}) => {
          cancel('操作已取消.')
          process.exit(0)
        }
      }
    )

    // 构建提交消息模板
    const commitTemplate = `${actions.type}${actions.scope === undefined ? '' : actions.scope.trim().length !== 0 ? `(${actions.scope.trim()})` : ''}: ${actions.subject.trim()}`

    if (actions.shouldCommit) {
      const commitMessage = commitTemplate.trim()
      const msgPath = path.resolve('.git/COMMIT_EDITMSG')
      fs.writeFileSync(msgPath, commitMessage)
      log.info(`🌱 生成的提交消息: ${pico.green(commitMessage)}`)
      try {
        const s = spinner()
        s.start('正在提交...')
        const res = await spawnAsync('git', ['commit', '-m', commitMessage])
        // const res = spawn.sync('git', ['commit', '-m', commitMessage])
        if (!res.status) {
          s.stop('✅ 提交消息已验证并暂存。')
          outro(`提交成功!`)
        } else {
          throw new Error(` ${res.stderr}`)
        }
      } catch (err) {
        log.error(`❌ 提交消息失败: ${(err as Error).message}`)
        process.exit(1)
      }
    } else {
      log.warning(`warning已取消提交`)
      process.exit(0)
    }
  } catch (error) {
    console.log('菜单读取发生错误：', error)
    process.exit(1)
  }
})

program.parse(process.argv)
