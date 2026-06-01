import { devices, expect, type Page, type Response } from '@playwright/test'

export const mobileViewport = devices['iPhone 13'].viewport!

export async function waitForPageReady(page: Page): Promise<void> {
  await page.locator('#main-content').waitFor({ state: 'visible' })
  await page.locator('header .site-title').waitFor({ state: 'visible' })
}

export async function waitForManagePageReady(page: Page): Promise<void> {
  await waitForPageReady(page)
  await page.getByRole('heading', { name: 'Manage services' }).waitFor({ state: 'visible' })
  await page.locator('#title').waitFor({ state: 'visible' })
}

export async function waitForServiceCards(page: Page): Promise<void> {
  await expect(async () => {
    const detailsLink = page.getByRole('link', { name: /View service details for/i }).first()

    if (!(await detailsLink.isVisible())) {
      const retryButton = page.getByRole('button', { name: 'Try again' })

      if (await retryButton.isVisible()) {
        await retryButton.click()
      } else {
        await page.reload()
        await waitForPageReady(page)
      }
    }

    await expect(detailsLink).toBeVisible()
  }).toPass({ timeout: 20_000 })
}

export function isServicesListResponse(response: Response): boolean {
  const url = new URL(response.url())

  return response.request().method() === 'GET'
    && url.pathname === '/api/services'
    && response.ok()
}

export async function waitForManageServicesClientReady(
  page: Page,
  navigate: () => Promise<unknown>,
): Promise<void> {
  const servicesResponse = page.waitForResponse(isServicesListResponse)

  await navigate()
  await waitForPageReady(page)

  await Promise.race([
    servicesResponse,
    page.waitForTimeout(3_000),
  ])
}

export async function waitForManageServicesTable(page: Page): Promise<void> {
  await waitForManageServicesClientReady(page, () => page.goto('/manage/services'))

  await expect(async () => {
    if (await page.getByRole('heading', { name: 'We could not load this page' }).isVisible()) {
      await waitForManageServicesClientReady(page, () => page.reload())
    }

    await waitForManagePageReady(page)

    const editLink = page.getByRole('link', { name: 'Edit' }).first()

    if (!(await editLink.isVisible())) {
      const retryButton = page.getByRole('button', { name: 'Try again' })

      if (await retryButton.isVisible()) {
        await retryButton.click()
        await page.waitForResponse(isServicesListResponse)
      } else {
        await waitForManageServicesClientReady(page, () => page.reload())
      }
    }

    await expect(editLink).toBeVisible()
    await expect(page.locator('#existing-services-table').getByRole('button', { name: 'Delete' }).first()).toBeVisible()
  }).toPass({ timeout: 30_000 })
}

export async function submitEmptySupportRequest(page: Page): Promise<void> {
  await page.goto('/request-support')
  await waitForPageReady(page)

  await expect(async () => {
    await page.locator('#fullName').click()
    await page.getByRole('button', { name: 'Send support request' }).click()
    await expect(page.getByRole('heading', { name: 'There is a problem' })).toBeVisible()
  }).toPass({ timeout: 10_000 })
}

export async function submitEmptyManageService(page: Page): Promise<void> {
  await waitForManageServicesClientReady(page, () => page.goto('/manage/services'))

  await expect(async () => {
    await page.locator('#title').click()
    await page.getByRole('button', { name: 'Create service' }).click()
    await expect(page.getByRole('heading', { name: 'There is a problem' })).toBeVisible()
  }).toPass({ timeout: 10_000 })
}

export async function openDeleteConfirmDialog(page: Page): Promise<void> {
  await waitForManageServicesTable(page)

  await expect(async () => {
    if (await page.getByRole('heading', { name: 'We could not load this page' }).isVisible()) {
      await waitForManageServicesClientReady(page, () => page.goto('/manage/services'))
    }

    await expect(page.getByRole('heading', { name: 'Manage services' })).toBeVisible()
    await page.getByRole('heading', { name: 'Existing services' }).scrollIntoViewIfNeeded()

    const deleteButton = page.locator('#existing-services-table').getByRole('button', { name: 'Delete' }).first()
    await deleteButton.click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
  }).toPass({ timeout: 15_000 })
}

export async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.addInitScript((mode) => {
    localStorage.setItem('support-journey-theme', mode)
  }, theme)
}

export async function assertDarkThemeApplied(page: Page): Promise<void> {
  await expect(page.locator('html')).toHaveClass(/dark/)
}

export async function openMobileMenu(page: Page): Promise<void> {
  const menuToggle = page.getByRole('button', { name: /^(Open|Close) menu$/ })

  await expect(menuToggle).toBeVisible()

  await expect(async () => {
    if ((await menuToggle.getAttribute('aria-expanded')) !== 'true') {
      await menuToggle.click()
    }

    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
  }).toPass()

  await expect(page.locator('#main-nav').getByRole('link', { name: 'Home' })).toBeVisible()
}

export async function fillServiceTitle(page: Page, title: string): Promise<void> {
  const titleField = page.locator('#title')

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await titleField.click()
    await titleField.fill(title)

    if (await titleField.inputValue() === title) {
      return
    }

    await page.waitForTimeout(200)
  }

  await expect(titleField).toHaveValue(title)
}

export async function navigateToFirstServiceDetail(page: Page): Promise<void> {
  await page.goto('/services')
  await waitForPageReady(page)
  await waitForServiceCards(page)

  await page.getByRole('link', { name: /View service details for/i }).first().click()
  await expect(page).toHaveURL(/\/services\/.+/)
  await waitForPageReady(page)
}

export type PageVisitOptions = {
  path: string
  theme?: 'light' | 'dark'
  viewport?: 'desktop' | 'mobile'
  beforeReady?: (page: Page) => Promise<void>
}

export async function visitPage(page: Page, options: PageVisitOptions): Promise<void> {
  const { path, theme = 'light', viewport = 'desktop', beforeReady } = options

  await setTheme(page, theme)

  if (viewport === 'mobile') {
    await page.setViewportSize(mobileViewport)
  }

  if (path === '/manage/services') {
    await waitForManageServicesClientReady(page, () => page.goto(path))
  } else {
    await page.goto(path)
    await waitForPageReady(page)
  }

  await beforeReady?.(page)

  if (path === '/services') {
    await waitForServiceCards(page)
  }

  if (theme === 'dark') {
    await assertDarkThemeApplied(page)
  }

  if (viewport === 'mobile') {
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  }
}
