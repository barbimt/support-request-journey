import AxeBuilder from '@axe-core/playwright'
import { devices, expect, test, type Page } from '@playwright/test'

const pages = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services' },
  { name: 'request support', path: '/request-support' },
  { name: 'manage services', path: '/manage/services' },
] as const

const themes = ['light', 'dark'] as const
const mobileViewport = devices['iPhone 13'].viewport!

for (const theme of themes) {
  for (const { name, path } of pages) {
    test(`${name} page has no accessibility violations (${theme} mode, desktop)`, async ({ page }) => {
      await assertPageHasNoViolations(page, { name, path, theme })
    })
  }
}

for (const theme of themes) {
  for (const { name, path } of pages) {
    test(`${name} page has no accessibility violations (${theme} mode, mobile)`, async ({ page }) => {
      await page.setViewportSize(mobileViewport)
      await assertPageHasNoViolations(page, { name, path, theme, viewport: 'mobile' })
    })
  }

  test(`home page with mobile menu open has no accessibility violations (${theme} mode)`, async ({ page }) => {
    await page.setViewportSize(mobileViewport)
    await setTheme(page, theme)
    await page.goto('/')
    await waitForPageReady(page)

    if (theme === 'dark') {
      await expect(page.locator('html')).toHaveClass(/dark/)
    }

    await openMobileMenu(page)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(
      results.violations,
      formatViolations('home (mobile menu open)', theme, results.violations, 'mobile'),
    ).toEqual([])
  })
}

async function assertPageHasNoViolations(
  page: Page,
  options: {
    name: string
    path: string
    theme: 'light' | 'dark'
    viewport?: 'desktop' | 'mobile'
  },
): Promise<void> {
  const { name, path, theme, viewport = 'desktop' } = options

  await setTheme(page, theme)
  await page.goto(path)
  await waitForPageReady(page)

  if (theme === 'dark') {
    await expect(page.locator('html')).toHaveClass(/dark/)
  }

  if (viewport === 'mobile') {
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Switch to (light|dark) mode/i })).toBeVisible()
  }

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(
    results.violations,
    formatViolations(name, theme, results.violations, viewport),
  ).toEqual([])
}

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

  await expect(page.locator('#main-nav').getByRole('link', { name: 'Home' })).toBeVisible()
}

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.addInitScript((mode) => {
    localStorage.setItem('support-journey-theme', mode)
  }, theme)
}

function formatViolations(
  pageName: string,
  theme: 'light' | 'dark',
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
  viewport: 'desktop' | 'mobile' = 'desktop',
) {
  if (violations.length === 0) {
    return undefined
  }

  const summary = violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `  - ${node.target.join(' ')}: ${node.failureSummary}`)
        .join('\n')

      return `[${violation.impact}] ${violation.id}: ${violation.help}\n${nodes}`
    })
    .join('\n\n')

  return `Accessibility violations on ${pageName} (${theme} mode, ${viewport}):\n\n${summary}`
}
