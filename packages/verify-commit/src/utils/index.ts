import { SpawnOptions } from 'node:child_process'
const spawn = require('cross-spawn')

/**
 * spawn 的 Promise 简单实现
 *
 * @param command 命令
 * @param args 参数
 * @param options 符合 cross-spawn 的 options 配置
 * @returns status: 状态码    stdout: 标准输出    stderr: 错误输出
 */
export const spawnAsync = async (
  command: string,
  args: string[],
  options: SpawnOptions = {}
): Promise<{ status: number; stdout: string; stderr: string }> => {
  const child = spawn(command, args, { ...options })
  let stdout = ''
  let stderr = ''
  child.stdout?.on('data', (data: Buffer[]) => {
    stdout += data.toString()
  })
  child.stderr?.on('data', (data: Buffer[]) => {
    stderr += data.toString()
  })
  return new Promise((resolve, reject) => {
    child.on('error', (e: any) => reject(e))
    child.on('close', (status: number) => resolve({ status, stdout, stderr }))
  })
}
