import { expect, test, type Page } from '@playwright/test'

async function fillSupportRequestForm(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')

  const fullName = page.locator('#fullName')
  await fullName.click()
  await fullName.fill('Jordan Lee')
  await expect(fullName).toHaveValue('Jordan Lee')

  const email = page.locator('#email')
  await email.click()
  await email.fill('jordan@example.com')
  await expect(email).toHaveValue('jordan@example.com')

  await page.locator('#supportFor').selectOption('myself')
  await expect(page.locator('#supportFor')).toHaveValue('myself')

  await page.locator('#supportType').selectOption('family')
  await expect(page.locator('#supportType')).toHaveValue('family')

  await page.getByRole('radio', { name: 'Email', exact: true }).check()

  const message = page.locator('#message')
  await message.click()
  await message.fill('We would like information about local family support groups and how to refer.')
  await expect(message).toHaveValue(/local family support groups/)

  await page.locator('#consent').check()
  await expect(page.locator('#consent')).toBeChecked()
}

test('support request journey from home to success', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Browse support services' }).click()
  await expect(page).toHaveURL('/services')

  await expect(async () => {
    if ((await page.getByRole('link', { name: /View service details/i }).count()) === 0) {
      await page.reload({ waitUntil: 'networkidle' })
    }

    await expect(page.getByRole('link', { name: /View service details/i }).first()).toBeVisible()
  }).toPass({ timeout: 20_000 })

  await page.getByRole('link', { name: /View service details/i }).first().click()
  await expect(page).toHaveURL(/\/services\/.+/)

  await page.locator('#main-content').getByRole('link', { name: 'Request support' }).click()
  await expect(page).toHaveURL('/request-support')
  await expect(page.getByRole('heading', { name: 'Request support' })).toBeVisible()

  await fillSupportRequestForm(page)

  await page.getByRole('button', { name: 'Send support request' }).click()

  await expect(page.getByRole('status')).toContainText('Your support request has been submitted', {
    timeout: 10_000,
  })
})
