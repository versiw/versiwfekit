import { log } from '@clack/prompts'
import { SpawnOptions } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
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

export const managePackageJson = (
  action: 'add' | 'remove',
  keyPath: string,
  value?: any,
  options: { overwrite?: boolean } = {}
) => {
  const pkgPath = path.join(process.cwd(), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const keys = keyPath.split('.')

  /**
   * 递归函数，用于获取或设置嵌套对象的值
   *
   * @param obj 当前对象
   * @param keys 剩余的键路径
   * @param setValue 要设置的值（仅在设置时需要）
   * @returns 返回最终的值
   */
  const getOrSetNested = (obj: Record<string, any>, keys: string[], setValue?: any): any => {
    const key = keys[0]
    if (keys.length === 1) {
      // 最后一级键，执行操作
      if (action === 'add') {
        if (setValue === undefined) {
          throw new Error(`添加操作需要提供值。键路径: ${keyPath}`)
        }
        if (!options.overwrite && obj.hasOwnProperty(key)) {
          throw new Error(`键 "${key}" 已存在且不允许覆盖。键路径: ${keyPath}`)
        }
        obj[key] = setValue
      } else if (action === 'remove') {
        if (obj.hasOwnProperty(key)) {
          delete obj[key]
        } else {
          console.warn(`键 "${key}" 在 package.json 中不存在。键路径: ${keyPath}`)
        }
      }
      return obj[key]
    } else {
      // 中间级键，确保其存在且为对象
      if (!obj.hasOwnProperty(key) || typeof obj[key] !== 'object' || obj[key] === null) {
        obj[key] = {} // 初始化为空对象
      }
      return getOrSetNested(obj[key], keys.slice(1), setValue)
    }
  }

  getOrSetNested(pkg, keys, value)

  // if (action === 'add') {
  //   pkg.prettier = '@versiwfekit/prettier'
  // } else {
  //   delete pkg.prettier
  // }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8')
}

/**
 * 安全删除文件（含错误处理和日志记录）
 * @param filename 要删除的文件路径
 */
export const deleteConfigFile = (filename: string) => {
  try {
    const filePath = path.join(process.cwd(), filename)
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      // log.info(`文件 ${filename} 不存在，跳过删除`)
      return
    }

    // 获取文件状态
    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      log.error(`${filename} 不是文件类型`)
      return false
    }

    // 执行删除操作
    fs.unlinkSync(filePath)
    return true
  } catch (error) {
    const err = error as NodeJS.ErrnoException

    // 处理特殊错误类型
    if (err.code === 'EPERM') {
      log.error(`删除失败：文件可能被其他程序占用，请关闭相关程序后重试 [错误码 EPERM]`)
    } else if (err.code === 'EBUSY') {
      log.error(`删除失败：文件系统繁忙，请稍后重试 [错误码 EBUSY]`)
    } else {
      log.error(`删除失败：${err.message}`)
    }
    return false
  }
}

export const createExtendedConfig = async () => {
  const configContent = `// 扩展配置参考文档：https://prettier.io/docs/configuration
  import versiwfekitPrettierConfig from "@versiwfekit/prettier";
  
  /** @type {import("prettier").Config} */
  const config = {
    ...versiwfekitPrettierConfig,
    semi: true,
  };
  
  export default config;`

  fs.writeFileSync(path.join(process.cwd(), '.prettierrc.js'), configContent)
}

// 新增安装依赖函数
export const installDependencies = async (dependencies: string[]) => {
  try {
    const res = await spawnAsync('npm', ['install', '-D', ...dependencies])
    if (res.status) {
      throw new Error(` ${res.stderr}`)
    }
  } catch (err) {
    log.error(`依赖安装失败: ${(err as Error).message}`)
    process.exit(1)
  }
}

// 新增移除依赖函数
export const removeDependencies = async (dependencies: string[]) => {
  try {
    const res = await spawnAsync('npm', ['remove', '-D', ...dependencies])
    if (res.status) {
      throw new Error(` ${res.stderr}`)
    }
  } catch (err) {
    log.error(`依赖移除失败: ${(err as Error).message}`)
    process.exit(1)
  }
}
