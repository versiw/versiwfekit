#!/usr/bin/env node
import { program } from 'commander'
import { commands } from './commands/index.ts'
import { cancel, intro, isCancel, select } from '@clack/prompts'

// program.name(__NAME__).description(__DESCRIPTION__).version(__VERSION__)

program.action(async () => {
  try {
    intro('🛠️  欢迎使用 create-vfk 前端工具集管理器')

    const category = await select({
      message: '请选择需要配置的功能:',
      options: [
        { value: 'prettier', label: '代码格式化配置 (@versiwfekit/prettier)' },
        { value: 'verifyCommit', label: 'Commit Message 规范提交配置 (@versiwfekit/verify-commit)' }
      ]
    })
    if (isCancel(category)) {
      cancel('操作已取消')
      return process.exit(0)
    }
    commands[category]()
  } catch (error) {
    console.log('菜单读取发生错误：', error)
    process.exit(1)
  }
})

program.parse(process.argv)
