import { CommitConfig } from './commitConfig.d.js'

const defaultConfig: CommitConfig = {
  types: [
    { value: 'feat', label: 'feat:       ✨ 新功能' },
    { value: 'fix', label: 'fix:        🐛 修复 BUG' },
    { value: 'wip', label: 'wip:        🚧 工作进行中' },
    { value: 'docs', label: 'docs:       📝 文档变更' },
    { value: 'style', label: 'style:      💎 代码格式 (不影响代码运行的变动)' },
    { value: 'refactor', label: 'refactor:   🛠️  重构、优化 (既不是增加 Feature，也不是修复 BUG)' },
    { value: 'perf', label: 'perf:       📈 性能优化' },
    { value: 'test', label: 'test:       🧪 增加测试' },
    { value: 'chore', label: 'chore:      🚀 构建过程或辅助工具的变动' },
    { value: 'revert', label: 'revert:     ↩️  回退' },
    { value: 'build', label: 'build:      📦 打包' },
    { value: 'ci', label: 'ci:         🤖 CI/CD 配置变更' }
  ],

  // scopes: [{ name: 'accounts' }, { name: 'admin' }, { name: 'exampleScope' }, { name: 'changeMe' }],

  messages: {
    type: '请选择提交类型:',
    // scope: '请输入文件修改范围(可选):',
    scope: '请输入修改范围(❓可选):',
    subject: '请简要描述提交(❗必选):',
    // body: '请输入详细描述(❓可选):',
    // footer: '请输入要关闭的issue(❓可选):',
    confirmCommit: '确认使用以上信息提交？',
    active: '是',
    inactive: '否'
  },
  // skipQuestions: ['body', 'footer'],
  // subject部分简要描述，默认是72字符，防止换行
  subjectLimit: 72
}

export default defaultConfig
