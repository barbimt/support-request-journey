import { expect, test } from '@playwright/test'

test('support request journey from home to success', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Browse support services' }).click()
  await expect(page).toHaveURL('/services')

  await page.getByRole('link', { name: /View service details/i }).first().click()
  await expect(page).toHaveURL(/\/services\/.+/)

  await page.locator('#main-content').getByRole('link', { name: 'Request support' }).click()
  await expect(page).toHaveURL('/request-support')

  await page.getByLabel('Full name').fill('Jordan Lee')
  await page.getByLabel('Email address').fill('jordan@example.com')
  await page.getByLabel('Who are you asking support for?').selectOption('myself')
  await page.getByLabel('Type of support needed').selectOption('family')
  await page.getByRole('radio', { name: 'Email', exact: true }).check()
  await page.getByLabel('Your message').fill('We would like information about local family support groups and how to refer.')
  await page.getByLabel(/I agree that my details/).check()

  await page.getByRole('button', { name: 'Send support request' }).click()

  await expect(page.getByRole('status')).toContainText('Your support request has been submitted')
})
