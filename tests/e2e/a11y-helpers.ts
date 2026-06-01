import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'
import {
  appPages,
  axeScenarioLabel,
  mobileMenuAxePages,
  type AppPageId,
} from './routes'
import {
  assertDarkThemeApplied,
  mobileViewport,
  openMobileMenu,
  setTheme,
  visitAppPage,
  waitForPageReady,
  waitForServiceCards,
} from './e2e-helpers'

export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const

export {
  mobileViewport,
  setTheme,
  visitAppPage,
  waitForManageServicesTable,
  waitForPageReady,
  waitForServiceCards,
} from './e2e-helpers'

export async function assertNoAxeViolations(
  page: Page,
  pageName: string,
  options: {
    theme?: 'light' | 'dark'
    viewport?: 'desktop' | 'mobile'
  } = {},
): Promise<void> {
  const { theme, viewport = 'desktop' } = options

  const results = await new AxeBuilder({ page })
    .withTags([...AXE_TAGS])
    .exclude('nuxt-error-overlay')
    .exclude('nuxt-devtools-frame')
    .analyze()

  expect(
    results.violations,
    formatViolations(pageName, theme, results.violations, viewport),
  ).toEqual([])
}

export type A11yScanOptions = {
  page: AppPageId
  theme?: 'light' | 'dark'
  viewport?: 'desktop' | 'mobile'
}

export async function visitAndAssertNoViolations(page: Page, options: A11yScanOptions): Promise<void> {
  const { page: pageId, theme = 'light', viewport = 'desktop' } = options

  await visitAppPage(page, { page: pageId, theme, viewport })
  await assertNoAxeViolations(page, appPages[pageId].label, { theme, viewport })
}

export async function visitMobileMenuOpenAndAssertNoViolations(
  page: Page,
  options: {
    page: AppPageId
    theme: 'light' | 'dark'
  },
): Promise<void> {
  const { page: pageId, theme } = options
  const { path, label } = appPages[pageId]

  await page.setViewportSize(mobileViewport)
  await setTheme(page, theme)
  await page.goto(path)
  await waitForPageReady(page)

  if (pageId === 'services') {
    await waitForServiceCards(page)
  }

  if (theme === 'dark') {
    await assertDarkThemeApplied(page)
  }

  await openMobileMenu(page)
  await assertNoAxeViolations(page, `${label} (mobile menu open)`, { theme, viewport: 'mobile' })
}

export { axeScenarioLabel, mobileMenuAxePages }

export function formatViolations(
  pageName: string,
  theme: 'light' | 'dark' | undefined,
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
  viewport: 'desktop' | 'mobile' = 'desktop',
) {
  if (violations.length === 0) {
    return undefined
  }

  const modeLabel = theme ? `${theme} mode, ` : ''

  const summary = violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `  - ${node.target.join(' ')}: ${node.failureSummary}`)
        .join('\n')

      return `[${violation.impact}] ${violation.id}: ${violation.help}\n${nodes}`
    })
    .join('\n\n')

  return `Accessibility violations on ${pageName} (${modeLabel}${viewport}):\n\n${summary}`
}
