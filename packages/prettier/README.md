# 项目名称

`versiw` 使用的 `Prettier` 配置

## 安装方法

使用 `npm` ：

```sh
npm i -D @versiwfekit/prettier
```

使用 `pnpm` ：

```sh
pnpm add -D @versiwfekit/prettier
```

## 用法

> [!WARNING]
> 更新 `prettier` 配置后，请重新加载窗口

### 使用默认配置

添加配置项到 `package.json`

```sh
npm pkg set prettier='@versiwfekit/prettier'
```

### 使用扩展配置

```sh
echo 'import versiwfekitPrettierConfig from "@versiwfekit/prettier";

/** @type {import("prettier").Config} */
const config = {
  ...versiwfekitPrettierConfig,
  // 自定义 prettier 配置
  semi: true
};

export default config;' > .prettierrc.js
```

### 使用 `vfk` 管理器一键配置

<div align="center">

<img src="https://gcore.jsdelivr.net/gh/versiw/FavPic/images/202504071400157.gif" alt="示例动画" width="800" >

<div>
