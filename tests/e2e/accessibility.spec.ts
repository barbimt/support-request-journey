import {
  assertNoAxeViolations,
  visitAndAssertNoViolations,
  visitMobileMenuOpenAndAssertNoViolations,
} from './a11y-helpers'
import { copy } from './copy'
import { expect, test } from './fixtures'
import {
  axePageScenarios,
  axeScenarioLabel,
  errorPages,
  mobileMenuAxePages,
} from './routes'
import {
  navigateToFirstServiceDetail,
  setTheme,
  visitPage,
  waitForPageReady,
} from './e2e-helpers'

test.describe('pages', () => {
  for (const scenario of axePageScenarios) {
    test(`${axeScenarioLabel(scenario)} has no accessibility violations`, async ({ page }) => {
      await visitAndAssertNoViolations(page, scenario)
    })
  }

  for (const theme of ['light', 'dark'] as const) {
    for (const pageId of mobileMenuAxePages) {
      test(`${axeScenarioLabel({ page: pageId, theme, viewport: 'mobile' })} with menu open has no accessibility violations`, async ({ page }) => {
        await visitMobileMenuOpenAndAssertNoViolations(page, { page: pageId, theme })
      })
    }
  }

  test('service detail page (light mode, desktop) has no accessibility violations', async ({ page }) => {
    await setTheme(page, 'light')
    await navigateToFirstServiceDetail(page)
    await assertNoAxeViolations(page, 'service detail', { theme: 'light' })
  })

  test('edit service page (light mode, desktop) has no accessibility violations', async ({ page, manageServices }) => {
    await setTheme(page, 'light')
    await manageServices.waitForTable()
    await manageServices.firstEditLink.click()
    await expect(page).toHaveURL(/\/manage\/services\/.+/)
    await waitForPageReady(page)

    await assertNoAxeViolations(page, 'edit service', { theme: 'light' })
  })
})

test.describe('error pages', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`${errorPages.notFound.label} (${theme} mode) has no accessibility violations`, async ({ page }) => {
      await visitPage(page, { path: errorPages.notFound.path, theme })

      await expect(page.getByRole('heading', { name: copy.errors.notFound404Heading })).toBeVisible()

      await assertNoAxeViolations(page, errorPages.notFound.label, { theme })
    })
  }

  test(`${errorPages.serviceNotFound.label} has no accessibility violations`, async ({ page }) => {
    await page.goto(errorPages.serviceNotFound.path)
    await waitForPageReady(page)

    await expect(page.getByRole('heading', { name: copy.errors.serviceNotFoundHeading })).toBeVisible()

    await assertNoAxeViolations(page, errorPages.serviceNotFound.label)
  })
})

test.describe('interactive states', () => {
  test('request support validation state has no accessibility violations', async ({ page, requestSupport }) => {
    await requestSupport.submitEmpty()

    await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible()

    await assertNoAxeViolations(page, 'request support (validation errors)')
  })

  test('manage services validation state has no accessibility violations', async ({ page, manageServices }) => {
    await manageServices.submitEmptyCreate()

    await expect(manageServices.titleError).toContainText(copy.validation.serviceTitleRequired)

    await assertNoAxeViolations(page, 'manage services (validation errors)')
  })

  test('delete confirmation dialog has no accessibility violations', async ({ page, manageServices }) => {
    await manageServices.openDeleteDialogForFirstService()

    await expect(manageServices.deleteDialog).toContainText(copy.deleteDialog.title)

    await assertNoAxeViolations(page, 'manage services (delete dialog open)')
  })
})
