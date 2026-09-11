# 梦战工具 · 三个计算器前端

基于 [maiyaoqiang-org/langrissar](https://github.com/maiyaoqiang-org/langrissar) 的前端工作副本。本轮调整单点、AOE、面板模拟计算器的视觉与操作体验，采用 Vue 3、Element Plus、Vite、mathjs 和 big.js。

## 从哪里接着看

- [CHANGELOG.md](CHANGELOG.md)：每轮修改的摘要和状态。
- [2026-09-12 三个计算器前端改版记录](docs/2026-09-12-三个计算器前端改版记录.md)：本轮相对 GitHub 原版的完整记录，含设计决定、代码位置、验证和暂缓事项。
- [AGENTS.md](AGENTS.md)：后续 AI 或开发者接手时需要遵守的项目约定。

本轮前端已于 2026-09-12 发布，前端提交为 [`3378d81`](https://github.com/maiyaoqiang-org/langrissar/commit/3378d8114e5b36e21c0dbe36d43ee53af8535a80)，[生产部署成功](https://github.com/maiyaoqiang-org/langrissar/actions/runs/34640007830)。对比基线为 GitHub `main` 的 `baa0b074ceac759a674c27acd56d3f020d95f5fa`；发布后的文档补记不改变前端版本。

线上入口：[单点计算器](https://maiyaoqiang.fun/#/pages/ddjsq-el) · [AOE 计算器](https://maiyaoqiang.fun/#/pages/aoejsq-el) · [面板模拟计算器](https://maiyaoqiang.fun/#/pages/mbjs-el)。

## 本地使用

已安装依赖且已有预览服务时，直接访问以下地址即可。新环境安装依赖后可运行：

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5400 --strictPort
```

| 页面 | 本地地址 |
| --- | --- |
| 单点计算器 | http://127.0.0.1:5400/#/pages/ddjsq-el |
| AOE 计算器 | http://127.0.0.1:5400/#/pages/aoejsq-el |
| 面板模拟计算器 | http://127.0.0.1:5400/#/pages/mbjs-el |

面板真实数据沿用项目现有的 NocoDB 读取接口。本地临时配置放在被 Git 忽略的 `.env.development.local`，使用 `VITE_NOCODB_XC_TOKEN`；具体令牌不写入代码或文档。数据接入和边界见详细记录。

## 验证

```sh
node --test tests/calculator-formula.test.mjs tests/calculator-display.test.mjs
npm run build
git diff --check
```

构建不等于部署。现有 GitHub Actions 会在推送 `main` 或 `test` 时触发对应流程，具体见 [.github/workflows/docker-deploy.yml](.github/workflows/docker-deploy.yml)。
