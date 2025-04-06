// src/commands/index.ts
import { handleConfig as prettier_handleConfig } from './prettier.ts'
import { handleConfig as verify_commit_handleConfig } from './verify-commit.ts'
// 定义命令处理函数的类型
type HandleConfig = () => void

export const commands: Record<string, HandleConfig> = {
  prettier: prettier_handleConfig,
  verifyCommit: verify_commit_handleConfig
}
