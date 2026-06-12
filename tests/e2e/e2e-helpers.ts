import { devices, expect, type Page, type Response } from '@playwright/test'
import { copy } from './copy'
import { appPages, type AppPageId } from './routes'

export const mobileViewport = devices['iPhone 13'].viewport!

export async function waitForPageReady(page: Page): Promise<void> {
  await page.locator('#main-content').waitFor({ state: 'visible' })
  await page.locator('header .site-title').waitFor({ state: 'visible' })
  await waitForHydration(page)
}

/**
 * Interactions that land before Vue hydration update the DOM but not the
 * reactive state (e.g. a filled input is reset to the empty model). Wait for
 * the Vue app instance to be attached before interacting with the page.
 */
export async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null
    return Boolean(root?.__vue_app__)
  })
}

export async function waitForManagePageReady(page: Page): Promise<void> {
  await waitForPageReady(page)
  await page.getByRole('heading', { name: copy.manageServices.heading }).waitFor({ state: 'visible' })
  await page.locator('#title').waitFor({ state: 'visible' })
}

export async function waitForServiceCards(page: Page): Promise<void> {
  await expect(async () => {
    const detailsLink = page.getByRole('link', { name: copy.services.viewDetailsLink }).first()

    if (!(await detailsLink.isVisible())) {
      const retryButton = page.getByRole('button', { name: copy.manageServices.tryAgainButton })

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
  await waitForManageServicesClientReady(page, () => page.goto(appPages.manageServices.path))

  await expect(async () => {
    if (await page.getByRole('heading', { name: copy.errors.pageLoadHeading }).isVisible()) {
      await waitForManageServicesClientReady(page, () => page.reload())
    }

    await waitForManagePageReady(page)

    const editLink = page.getByRole('link', { name: copy.manageServices.editLink }).first()

    if (!(await editLink.isVisible())) {
      const retryButton = page.getByRole('button', { name: copy.manageServices.tryAgainButton })

      if (await retryButton.isVisible()) {
        await retryButton.click()
        await page.waitForResponse(isServicesListResponse)
      } else {
        await waitForManageServicesClientReady(page, () => page.reload())
      }
    }

    await expect(editLink).toBeVisible()
    await expect(
      page.locator('#existing-services-table').getByRole('button', { name: copy.deleteDialog.deleteButton }).first(),
    ).toBeVisible()
  }).toPass({ timeout: 30_000 })
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

  await expect(page.locator('#main-nav').getByRole('link', { name: copy.nav.home })).toBeVisible()
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
  await page.goto(appPages.services.path)
  await waitForPageReady(page)
  await waitForServiceCards(page)

  await page.getByRole('link', { name: copy.services.viewDetailsLink }).first().click()
  await expect(page).toHaveURL(/\/services\/.+/)
  await waitForPageReady(page)
}

export type VisitAppPageOptions = {
  page: AppPageId
  theme?: 'light' | 'dark'
  viewport?: 'desktop' | 'mobile'
}

export async function visitAppPage(page: Page, options: VisitAppPageOptions): Promise<void> {
  const { page: pageId, theme = 'light', viewport = 'desktop' } = options
  const { path } = appPages[pageId]

  await setTheme(page, theme)

  if (viewport === 'mobile') {
    await page.setViewportSize(mobileViewport)
  }

  if (pageId === 'manageServices') {
    await waitForManageServicesClientReady(page, () => page.goto(path))
  } else {
    await page.goto(path)
    await waitForPageReady(page)
  }

  if (pageId === 'services') {
    await waitForServiceCards(page)
  }

  if (theme === 'dark') {
    await assertDarkThemeApplied(page)
  }

  if (viewport === 'mobile') {
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  }
}

/** Visit a path by string — for error routes outside appPages. Prefer visitAppPage when possible. */
export async function visitPage(
  page: Page,
  options: { path: string, theme?: 'light' | 'dark', viewport?: 'desktop' | 'mobile' },
): Promise<void> {
  const pageId = Object.entries(appPages).find(([, config]) => config.path === options.path)?.[0] as AppPageId | undefined

  if (pageId) {
    await visitAppPage(page, {
      page: pageId,
      theme: options.theme,
      viewport: options.viewport,
    })
    return
  }

  await setTheme(page, options.theme ?? 'light')

  if (options.viewport === 'mobile') {
    await page.setViewportSize(mobileViewport)
  }

  await page.goto(options.path)
  await waitForPageReady(page)

  if (options.theme === 'dark') {
    await assertDarkThemeApplied(page)
  }
}
