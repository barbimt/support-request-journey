import { expect, test } from '@playwright/test'

test('create service from manage page', async ({ page }) => {
  await page.goto('/services')

  await page.getByRole('link', { name: 'Manage services' }).click()
  await expect(page).toHaveURL('/manage/services')

  await page.getByRole('button', { name: 'Create service' }).click()

  await expect(page.getByRole('heading', { name: 'There is a problem' })).toBeVisible()
  await expect(page.locator('#title-error')).toContainText('Enter a service title.')

  await page.getByLabel('Service title').fill('Community wellbeing drop-in')
  await page.getByLabel('Category').selectOption('mental-health')
  await page.getByLabel('Description').fill('Weekly drop-in sessions with trained wellbeing advisors.')

  await page.getByRole('button', { name: 'Create service' }).click()

  await expect(page.getByRole('status')).toContainText('Community wellbeing drop-in')
  await expect(page.getByRole('status')).toContainText('has been added.')
})
