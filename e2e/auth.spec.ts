import { expect, test } from '@playwright/test'

async function loginAs(page: import('@playwright/test').Page, role: '管理员' | '医生' | '患者', account: string, password: string) {
  await page.goto('/login')
  await page.getByRole('radio', { name: role }).click()
  const ph = role === '医生' ? '医生工号' : role === '管理员' ? '管理员用户名' : '患者用户名'
  await page.getByPlaceholder(ph).fill(account)
  await page.getByPlaceholder('密码').fill(password)
  await page.getByRole('button', { name: '登录' }).click()
}

test.describe('E2E-AUTH / E2E-LOGIN', () => {
  test('E2E-AUTH-01: 未登录访问 / 跳转登录', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('E2E-AUTH-02: 未登录访问 /home 带 redirect', async ({ page }) => {
    await page.goto('/home')
    await expect(page).toHaveURL(/\/login/)
    const u = new URL(page.url())
    expect(u.searchParams.get('redirect')).toContain('/home')
  })

  test('E2E-LOGIN-02: 错误密码提示', async ({ page }) => {
    await loginAs(page, '患者', 'patient001', 'wrong-password')
    await expect(page.getByText('用户名或密码错误')).toBeVisible({ timeout: 5000 })
  })

  test('E2E-LOGIN-03: 患者登录进入患者端', async ({ page }) => {
    await loginAs(page, '患者', 'patient001', '123456')
    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByText('门诊患者端', { exact: true }).first()).toBeVisible()
  })

  test('E2E-AUTH-04: 患者不可访问 /back', async ({ page }) => {
    await loginAs(page, '患者', 'patient001', '123456')
    await expect(page).toHaveURL(/\/home/)
    await page.goto('/back')
    await expect(page).toHaveURL(/\/home(?:\/|$)/)
  })

  test('E2E-LOGIN-04 + E2E-BACK-01: 管理员登录管理端侧栏', async ({ page }) => {
    await loginAs(page, '管理员', 'admin001', '123456')
    await expect(page).toHaveURL(/\/back/)
    await expect(page.getByText('门诊管理后台')).toBeVisible()
  })

  test('E2E-AUTH-06: 管理员可访问 /home', async ({ page }) => {
    await loginAs(page, '管理员', 'admin001', '123456')
    await expect(page).toHaveURL(/\/back/)
    await page.goto('/home')
    await expect(page).toHaveURL(/\/home/)
    await expect(page.getByText('门诊患者端', { exact: true }).first()).toBeVisible()
  })

  test('E2E-APP-01 + E2E-APP-02: 管理员切换患者端', async ({ page }) => {
    await loginAs(page, '管理员', 'admin001', '123456')
    await expect(page).toHaveURL(/\/back/)
    const modeSwitch = page.locator('.n-radio-group').filter({ has: page.locator('.n-radio-button') }).first()
    await expect(modeSwitch.getByText('患者端', { exact: true })).toBeVisible()
    await expect(modeSwitch.getByText('管理端', { exact: true })).toBeVisible()
    await modeSwitch.getByText('患者端', { exact: true }).click()
    await expect(page).toHaveURL(/\/home/)
  })
})

test.describe('E2E-HOME', () => {
  test('E2E-HOME-01 + E2E-HOME-04: 患者端顶栏与欢迎区', async ({ page }) => {
    await loginAs(page, '患者', 'patient001', '123456')
    await expect(page.getByText('赵患者')).toBeVisible()
    await expect(page.getByText('欢迎使用门诊管理系统患者端')).toBeVisible()
  })
})
