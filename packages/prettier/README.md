# 项目名称

versiw 使用的 Prettier 配置

## 安装方法

使用 npm ：

```sh
npm i -D @versiwfekit/prettier
```

## 用法

添加配置项到 package.json

```sh
npm pkg set prettier='@versiwfekit/prettier'
```

使用单独的配置文件

```sh
echo "module.exports = require('@versiwfekit/prettier')" > .prettierrc.js
```
