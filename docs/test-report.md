# 门诊管理系统馆管理系统 — 测试报告

## 执行概要

| 项 | 值 |
|----|-----|
| 执行日期 | 2026-04-28 |
| 被测版本 | 仓库当前工作区（`package.json` version 1.0.0） |
| 执行命令 | `pnpm test:e2e`（Playwright 通过 `webServer` 启动 `pnpm dev`，端口 `3333`） |
| 浏览器 | Chromium（Playwright 捆绑） |
| 结果 | **9 passed**，0 failed（总耗时约 17s，含 dev 冷启动） |

## 执行环境

| 项 | 值 |
|----|-----|
| Node.js | v21.7.1（执行机实测 `node -v`） |
| 包管理器 | pnpm 10.6.5（见 [package.json](../package.json) `packageManager`） |
| 操作系统 | darwin（macOS） |

> 说明：Playwright 在 macOS 12 arm64 上提示当前系统上的 ffmpeg 浏览器通道不再更新，不影响本次用例通过；升级操作系统可获得更新浏览器通道。

## 自动化测试结果（与 [test-cases.md](./test-cases.md) 映射）

| 文档用例 ID | Playwright 用例名 | 结果 |
|-------------|-------------------|------|
| E2E-AUTH-01 | 未登录访问 / 跳转登录 | Pass |
| E2E-AUTH-02 | 未登录访问 /home 带 redirect | Pass |
| E2E-LOGIN-02 | 错误密码提示 | Pass |
| E2E-LOGIN-03 | user001 登录进入用户端 | Pass |
| E2E-AUTH-04 | 普通用户不可访问 /back | Pass |
| E2E-LOGIN-04 + E2E-BACK-01 | admin001 登录管理端侧栏 | Pass |
| E2E-AUTH-06 | 管理员可访问 /home | Pass |
| E2E-APP-01 + E2E-APP-02 | 管理员切换用户端 | Pass |
| E2E-HOME-01 + E2E-HOME-04 | 用户端顶栏与欢迎区 | Pass |

## 未纳入自动化的用例（回归建议）

以下条目见 [test-cases.md](./test-cases.md)，本次未通过 Playwright 执行，建议在发版前手工或通过后续补充用例覆盖：

- ENV-03 / ENV-04（`pnpm build` / `pnpm preview`）
- AUTH-03、AUTH-05、LOGIN-01、HOME-02、HOME-03、BACK-02 等
- LOGIN-05（禁用账号，种子数据当前无「禁用」用户，标为 N/A）

## 失败与修复记录

首轮执行中，`E2E-APP-01 + E2E-APP-02` 因 `getByText('管理端')` 与侧栏文案「门诊管理系统馆管理端」产生 **strict mode** 多元素匹配失败。已改为在 `.n-radio-group` 内使用 `exact: true` 限定「用户端 / 管理端」切换区后 **全部通过**。

## 产物与命令

- 用例说明：[test-cases.md](./test-cases.md)
- E2E 规格：`e2e/auth.spec.ts`
- 配置：`playwright.config.ts`
- 本地复查：`pnpm test:e2e`（若已有 `pnpm dev` 占用 3333 端口，Playwright 会按 `reuseExistingServer` 复用，见配置）
