/**
 * 表示提交类型的接口。
 * 每个提交类型包含一个值和一个标签。
 */
interface CommitType {
  /**
   * 提交类型的唯一标识符，例如 'feat', 'fix' 等。
   */
  value: string

  /**
   * 提交类型的显示标签，通常包含表情符号以增强可读性。
   * 例如: 'feat: ✨ 新功能'
   */
  label: string
}

/**
 * 表示提交配置的接口。
 * 包含提交类型、范围、消息模板以及其他相关配置。
 */
export interface CommitConfig {
  /**
   * 可用的提交类型列表。
   * 每个类型都是一个 `CommitType` 对象。
   */
  types: CommitType[]

  /**
   * 可选的提交范围列表。
   * 每个范围包含一个名称，用于描述修改的范围。
   * 例如: [{ name: 'accounts' }, { name: 'admin' }]
   */
  scopes?: { name: string }[]

  /**
   * 提交消息的模板，包含各种部分的提示信息。
   */
  messages: {
    /**
     * 提示用户选择提交类型的消息。
     */
    type: string

    /**
     * 提示用户输入修改范围的消息。
     */
    scope: string

    /**
     * 提示用户简要描述提交内容的消息。
     */
    subject: string

    /**
     * 提示用户输入详细描述（可选）的消息。
     */
    body?: string

    /**
     * 提示用户输入要关闭的 issue 编号（可选）的消息。
     */
    footer?: string

    /**
     * 确认提交时显示的消息。
     */
    confirmCommit: string

    /**
     * 表示“是”的标签，通常用于确认操作。
     */
    active: string

    /**
     * 表示“否”的标签，通常用于取消操作。
     */
    inactive: string
  }

  /**
   * 可选的跳过问题列表。
   * 这些问题在提交过程中将被忽略。
   * 例如: ['body', 'footer']
   */
  skipQuestions?: string[]

  /**
   * 提交消息的主题部分的字符限制。
   * 用于防止主题过长导致换行。
   * 默认值为 72 字符。
   */
  subjectLimit: number
}
