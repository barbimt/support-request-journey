import { expect, test } from '@playwright/test'
import {
  assertNoAxeViolations,
  openDeleteConfirmDialog,
  submitEmptyManageService,
  submitEmptySupportRequest,
  visitAndAssertNoViolations,
  visitMobileMenuOpenAndAssertNoViolations,
} from './a11y-helpers'
import {
  navigateToFirstServiceDetail,
  setTheme,
  visitPage,
  waitForManageServicesTable,
  waitForPageReady,
} from './e2e-helpers'

const basePages = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services' },
  { name: 'request support', path: '/request-support' },
  { name: 'manage services', path: '/manage/services' },
] as const

const mobileMenuPages = [
  { name: 'home', path: '/' as const },
  { name: 'services', path: '/services' as const },
] as const

const pageScans = [
  ...basePages.map(({ name, path }) => ({
    name,
    path,
    theme: 'light' as const,
    viewport: 'desktop' as const,
    label: `${name} page (light mode, desktop)`,
  })),
  {
    name: 'home',
    path: '/',
    theme: 'dark' as const,
    viewport: 'desktop' as const,
    label: 'home page (dark mode, desktop)',
  },
  ...(['home', 'services'] as const).map((name) => ({
    name,
    path: name === 'home' ? '/' : '/services',
    theme: 'light' as const,
    viewport: 'mobile' as const,
    label: `${name} page (light mode, mobile)`,
  })),
]

test.describe('pages', () => {
  for (const scan of pageScans) {
    test(`${scan.label} has no accessibility violations`, async ({ page }) => {
      await visitAndAssertNoViolations(page, scan)
    })
  }

  for (const theme of ['light', 'dark'] as const) {
    for (const { name, path } of mobileMenuPages) {
      test(`${name} page with mobile menu open (${theme} mode) has no accessibility violations`, async ({ page }) => {
        await visitMobileMenuOpenAndAssertNoViolations(page, { path, name, theme })
      })
    }
  }

  test('service detail page (light mode, desktop) has no accessibility violations', async ({ page }) => {
    await setTheme(page, 'light')
    await navigateToFirstServiceDetail(page)
    await assertNoAxeViolations(page, 'service detail', { theme: 'light' })
  })

  test('edit service page (light mode, desktop) has no accessibility violations', async ({ page }) => {
    await setTheme(page, 'light')
    await waitForManageServicesTable(page)

    await page.getByRole('link', { name: 'Edit' }).first().click()
    await expect(page).toHaveURL(/\/manage\/services\/.+/)
    await waitForPageReady(page)

    await assertNoAxeViolations(page, 'edit service', { theme: 'light' })
  })
})

test.describe('error pages', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`404 error page (${theme} mode) has no accessibility violations`, async ({ page }) => {
      await visitPage(page, { path: '/this-route-does-not-exist', theme })

      await expect(page.getByRole('heading', { name: 'This page does not exist' })).toBeVisible()

      await assertNoAxeViolations(page, '404 error page', { theme })
    })
  }

  test('service not found page has no accessibility violations', async ({ page }) => {
    await page.goto('/services/nonexistent-id-999')
    await waitForPageReady(page)

    await expect(page.getByRole('heading', { name: 'Service not found' })).toBeVisible()

    await assertNoAxeViolations(page, 'service not found')
  })
})

test.describe('interactive states', () => {
  test('request support validation state has no accessibility violations', async ({ page }) => {
    await submitEmptySupportRequest(page)

    await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible()

    await assertNoAxeViolations(page, 'request support (validation errors)')
  })

  test('manage services validation state has no accessibility violations', async ({ page }) => {
    await submitEmptyManageService(page)

    await expect(page.locator('#title-error')).toContainText('Enter a service title.')

    await assertNoAxeViolations(page, 'manage services (validation errors)')
  })

  test('delete confirmation dialog has no accessibility violations', async ({ page }) => {
    await openDeleteConfirmDialog(page)

    await expect(page.getByRole('alertdialog')).toContainText('Delete this service?')

    await assertNoAxeViolations(page, 'manage services (delete dialog open)')
  })
})
