import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const pages = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services' },
  { name: 'request support', path: '/request-support' },
  { name: 'manage services', path: '/manage/services' },
] as const

for (const { name, path } of pages) {
  test(`${name} page has no accessibility violations`, async ({ page }) => {
    await page.goto(path)
    await page.locator('#main-content').waitFor({ state: 'visible' })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(
      results.violations,
      formatViolations(name, results.violations),
    ).toEqual([])
  })
}

function formatViolations(
  pageName: string,
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
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

  return `Accessibility violations on ${pageName}:\n\n${summary}`
}
