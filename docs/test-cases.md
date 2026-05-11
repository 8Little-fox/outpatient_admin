# 门诊管理系统馆管理系统 — 测试用例

## 文档溯源

| 来源 | 说明 |
|------|------|
| [README.md](../README.md) | 依赖安装、`pnpm dev` / `pnpm build` / `pnpm preview` |
| [src/pages/login/index.vue](../src/pages/login/index.vue) | 登录页文案、演示账号、空账号/错误密码/禁用账号提示 |
| [src/setup/auth.setup.ts](../src/setup/auth.setup.ts) | `/home`、`/back`、`/login` 路由守卫行为 |
| [src/pages/home.vue](../src/pages/home.vue) | 用户端顶部导航与退出 |
| [src/pages/back.vue](../src/pages/back.vue) | 管理端侧栏菜单 |
| [src/App.vue](../src/App.vue) | 管理员「用户端 / 管理端」切换 |
| [rsbuild.config.ts](../rsbuild.config.ts) | 开发服务端口 `3333` |

**自动化映射**：部分用例由 Playwright 覆盖，规格文件见仓库根目录 `e2e/`，用例 ID 与下表「自动化」列对应。

---

## 1. 环境与构建（README）

| ID | 前置条件 | 步骤 | 预期结果 | 自动化 |
|----|----------|------|----------|--------|
| ENV-01 | 已安装 Node、pnpm | 在项目根目录执行 `pnpm install` | 依赖安装成功，无致命错误 | 手工 |
| ENV-02 | 依赖已安装 | 执行 `pnpm dev` | 开发服务器启动，可访问 `http://localhost:3333` | E2E（webServer 隐式验证） |
| ENV-03 | 依赖已安装 | 执行 `pnpm build` | 产出生产构建成功 | 手工 |
| ENV-04 | 已完成 build | 执行 `pnpm preview` | 可本地预览构建结果 | 手工 |

---

## 2. 路由与鉴权（auth.setup + index 重定向）

| ID | 前置条件 | 步骤 | 预期结果 | 自动化 |
|----|----------|------|----------|--------|
| AUTH-01 | 未登录（干净会话） | 访问 `/` | 跳转至 `/login` | E2E-AUTH-01 |
| AUTH-02 | 未登录 | 访问 `/home` 或任意 `/home/...` | 跳转至 `/login`，且 URL 含 `redirect` 查询参数 | E2E-AUTH-02 |
| AUTH-03 | 未登录 | 访问 `/back` 或 `/back/...` | 跳转至 `/login` | 手工 |
| AUTH-04 | 已登录为**普通用户** | 直接访问 `/back` | 重定向至 `/home`（非管理员不可进管理端） | E2E-AUTH-04 |
| AUTH-05 | 已登录 | 访问 `/login` | 普通用户进 `/home`，管理员进 `/back` | 手工（与登录后跳转合并验证） |
| AUTH-06 | 已登录为**管理员** | 访问 `/home` | 允许进入（注释说明管理员也可进用户端） | E2E-AUTH-06 |

---

## 3. 登录页（login/index.vue）

| ID | 前置条件 | 步骤 | 预期结果 | 自动化 |
|----|----------|------|----------|--------|
| LOGIN-01 | 未登录，在登录页 | 用户名、密码均为空，点击「登录」 | 提示「请输入用户名或密码」 | 手工 |
| LOGIN-02 | 未登录 | 输入错误密码（如 `user001` / `wrong`），点击「登录」 | 提示「账号或密码错误」 | E2E-LOGIN-02 |
| LOGIN-03 | 未登录 | 使用演示账号 `user001` / `123456` 登录 | 提示「登录成功」，进入用户端 `/home` | E2E-LOGIN-03 |
| LOGIN-04 | 未登录 | 使用演示账号 `admin001` / `123456` 登录 | 提示「登录成功」，进入管理端 `/back` | E2E-LOGIN-04 |
| LOGIN-05 | 种子数据 | 使用状态为「禁用」的用户登录 | 提示「账号已被禁用」 | **N/A**：当前 [user.store.ts](../src/store/user.store.ts) 种子用户均为「正常」，无禁用账号数据 |

---

## 4. 用户端壳与导航（home.vue + 子页）

| ID | 前置条件 | 步骤 | 预期结果 | 自动化 |
|----|----------|------|----------|--------|
| HOME-01 | 普通用户已登录 | 打开 `/home`，查看顶栏 | 显示「门诊管理系统馆」、当前用户文案、「退出」 | E2E-HOME-01 |
| HOME-02 | 同上 | 依次点击：场地信息、我的收藏、个人中心、商品信息、教练信息、留言板 | 路由分别为 `/home/court`、`/home/favorite`、`/home/profile`、`/home/product`、`/home/coach`、`/home/message`，页面无白屏 | 手工 |
| HOME-03 | 同上 | 点击「退出」 | 回到 `/login` | 手工 |
| HOME-04 | 普通用户已登录 | 访问 `/home` 首页内容区 | 可见「欢迎使用门诊管理系统馆用户端」等欢迎文案（见 [home/index.vue](../src/pages/home/index.vue)） | E2E-HOME-04 |

---

## 5. 管理端壳与菜单（back.vue）

| ID | 前置条件 | 步骤 | 预期结果 | 自动化 |
|----|----------|------|----------|--------|
| BACK-01 | 管理员已登录 | 打开 `/back` | 侧栏标题「门诊管理系统馆管理端」，含用户管理、场地与资源等分组 | E2E-BACK-01 |
| BACK-02 | 管理员已登录 | 依次打开菜单中的各子路由（用户列表、时间段管理、场地类型…） | 页面加载，与 [back.vue](../src/pages/back.vue) 中 `RouterLink` 路径一致 | 手工 |

---

## 6. 管理员端 / 用户端切换（App.vue）

| ID | 前置条件 | 步骤 | 预期结果 | 自动化 |
|----|----------|------|----------|--------|
| APP-01 | 管理员已登录 | 查看页面右上角 | 存在「用户端」「管理端」单选项 | E2E-APP-01 |
| APP-02 | 同上 | 切换到「用户端」 | 进入用户端布局（`/home` 前缀路由） | E2E-APP-02 |

---

## 7. Playwright 用例 ID 与文件对应关系

| 文档用例 ID | Playwright 测试标题 / 文件 |
|-------------|---------------------------|
| E2E-AUTH-01 | `e2e/auth.spec.ts` — 未登录访问 `/` 跳转登录 |
| E2E-AUTH-02 | `e2e/auth.spec.ts` — 未登录访问 `/home` 带 redirect |
| E2E-AUTH-04 | `e2e/auth.spec.ts` — 普通用户不可访问 `/back` |
| E2E-AUTH-06 | `e2e/auth.spec.ts` — 管理员可访问 `/home` |
| E2E-LOGIN-02 | `e2e/auth.spec.ts` — 错误密码提示 |
| E2E-LOGIN-03 | `e2e/auth.spec.ts` — user001 登录进首页 |
| E2E-LOGIN-04 | `e2e/auth.spec.ts` — admin001 登录进管理端 |
| E2E-HOME-01 | `e2e/auth.spec.ts` — 用户端顶栏 |
| E2E-HOME-04 | `e2e/auth.spec.ts` — 欢迎文案 |
| E2E-BACK-01 | `e2e/auth.spec.ts` — 管理端侧栏 |
| E2E-APP-01 | `e2e/auth.spec.ts` — 管理员切换控件 |
| E2E-APP-02 | `e2e/auth.spec.ts` — 切换到用户端 |

执行命令：`pnpm test:e2e`（由 Playwright 启动 `pnpm dev`，端口 `3333`）。
