import { expect, test, type Page } from '@playwright/test'
import { waitForPageReady, waitForServiceCards } from './e2e-helpers'

async function waitForHydratedForm(page: Page): Promise<void> {
  await expect(async () => {
    const field = page.locator('#fullName')
    await field.click()
    await field.fill('hydration-check')
    await expect(field).toHaveValue('hydration-check')
    await field.fill('')
    await expect(field).toHaveValue('')
  }).toPass({ timeout: 10_000 })
}

async function fillSupportRequestForm(page: Page): Promise<void> {
  await waitForHydratedForm(page)

  await page.locator('#fullName').fill('Jordan Lee')
  await page.locator('#email').fill('jordan@example.com')
  await page.locator('#supportFor').selectOption('myself')
  await page.locator('#supportType').selectOption('family')
  await page.locator('input[type="radio"][name="preferredContact"][value="email"]').check()
  await page.locator('#message').fill(
    'We would like information about local family support groups and how to refer.',
  )
  await page.locator('#consent').check()

  await expect(page.locator('#fullName')).toHaveValue('Jordan Lee')
  await expect(page.locator('#supportFor')).toHaveValue('myself')
  await expect(page.locator('#consent')).toBeChecked()
}

test('support request journey from home to success', async ({ page }) => {
  await page.goto('/')
  await waitForPageReady(page)

  await page.getByRole('link', { name: 'Browse support services' }).click()
  await expect(page).toHaveURL('/services')
  await waitForPageReady(page)
  await waitForServiceCards(page)

  await page.getByRole('link', { name: /View service details for/i }).first().click()
  await expect(page).toHaveURL(/\/services\/.+/)
  await waitForPageReady(page)

  await page.locator('#main-content').getByRole('link', { name: 'Request support' }).click()
  await expect(page).toHaveURL('/request-support')
  await waitForPageReady(page)

  await fillSupportRequestForm(page)

  const submitResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/support-requests') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: 'Send support request' }).click()
  await submitResponse

  await expect(page.getByRole('status')).toContainText('Your support request has been submitted', {
    timeout: 15_000,
  })
})
