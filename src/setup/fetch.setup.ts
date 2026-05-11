/**
 * 本系统业务数据全部由 src/store 与 localStorage 模拟，不依赖远程 REST 接口。
 * 保留 patch 入口以便将来扩展；当前不发起外网请求。
 */
export function setupFetch() {
  /* no-op */
}
