import { devices, expect, test, type Page } from '@playwright/test'

const mobileViewport = devices['iPhone 13'].viewport!

test('skip link moves focus to main content', async ({ page }) => {
  await page.goto('/')
  await waitForPageReady(page)

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
})

test('mobile menu supports keyboard open, focus, and escape close', async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto('/')
  await waitForPageReady(page)

  const menuToggle = page.getByRole('button', { name: /^(Open|Close) menu$/ })

  await expect(async () => {
    await menuToggle.focus()
    await expect(menuToggle).toBeFocused()
    await page.keyboard.press('Space')
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
  }).toPass()

  await expect(page.locator('#main-nav').getByRole('link', { name: 'Home' })).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(menuToggle).toBeFocused()
})

test('mobile menu traps focus with Tab from last to first link', async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto('/')
  await waitForPageReady(page)

  await openMobileMenu(page)

  const requestSupportLink = page.locator('#main-nav').getByRole('link', { name: 'Request support' })
  await requestSupportLink.focus()
  await page.keyboard.press('Tab')

  await expect(page.locator('#main-nav').getByRole('link', { name: 'Home' })).toBeFocused()
})

async function waitForPageReady(page: Page): Promise<void> {
  await page.locator('#main-content').waitFor({ state: 'visible' })
  await page.locator('header .site-title').waitFor({ state: 'visible' })
}

async function openMobileMenu(page: Page): Promise<void> {
  const menuToggle = page.getByRole('button', { name: /^(Open|Close) menu$/ })

  await expect(menuToggle).toBeVisible()

  await expect(async () => {
    if ((await menuToggle.getAttribute('aria-expanded')) !== 'true') {
      await menuToggle.click()
    }

    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
  }).toPass()
}
