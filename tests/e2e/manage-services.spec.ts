import { expect, test, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

async function waitForManagePageReady(page: Page): Promise<void> {
  await page.locator('#main-content').waitFor({ state: 'visible' })
  await page.getByRole('heading', { name: 'Manage services' }).waitFor({ state: 'visible' })
  await page.locator('#title').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
}

async function fillServiceTitle(page: Page, title: string): Promise<void> {
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

async function createManageService(page: Page, title: string): Promise<void> {
  await page.goto('/services')
  await page.getByRole('link', { name: 'Add a service to the directory' }).click()
  await waitForManagePageReady(page)

  await fillServiceTitle(page, title)
  await page.locator('#category').selectOption('mental-health')
  await page.locator('#description').fill('E2E test service description.')

  await page.getByRole('button', { name: 'Create service' }).click()
  await expect(page.getByRole('status')).toContainText(title, { timeout: 15_000 })
  await expect(page.getByRole('status')).toContainText('has been added.')
}

async function findServiceRow(page: Page, serviceHref: string) {
  const row = page.locator('tr').filter({
    has: page.locator(`a[href="${serviceHref}"]`),
  })

  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (await row.isVisible()) {
      return row
    }

    const nextButton = page.getByRole('button', { name: 'Next' })
    if (!(await nextButton.isEnabled())) {
      break
    }

    await nextButton.click()
  }

  return row
}

async function getCreatedServiceRow(page: Page) {
  const detailsHref = await page.getByRole('link', { name: 'View service details' }).getAttribute('href')

  if (!detailsHref) {
    throw new Error('Expected a service details link after creating a service.')
  }

  await page.getByRole('heading', { name: 'Existing services' }).scrollIntoViewIfNeeded()
  await expect(page.locator(`a[href="${detailsHref}"]`)).toBeVisible({ timeout: 15_000 })

  return findServiceRow(page, detailsHref)
}

async function openEditFromSuccessLink(page: Page): Promise<void> {
  await page.getByRole('link', { name: 'View service details' }).click()
  await page.getByRole('link', { name: 'Edit service' }).click()
  await expect(page).toHaveURL(/\/manage\/services\//)
}

test('create service from manage page', async ({ page }) => {
  await page.goto('/services')

  await page.getByRole('link', { name: 'Add a service to the directory' }).click()
  await expect(page).toHaveURL('/manage/services')
  await waitForManagePageReady(page)

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

test('update service from manage page', async ({ page }) => {
  const title = `E2E update ${Date.now()}`
  const updatedTitle = `${title} updated`

  await createManageService(page, title)
  await openEditFromSuccessLink(page)

  await fillServiceTitle(page, updatedTitle)
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.getByRole('status')).toContainText(updatedTitle, { timeout: 15_000 })
  await expect(page.getByRole('status')).toContainText('has been updated.')
})

test('delete service from manage page', async ({ page }) => {
  const title = `E2E delete ${Date.now()}`

  await createManageService(page, title)

  const row = await getCreatedServiceRow(page)
  await expect(row).toBeVisible({ timeout: 15_000 })
  await row.getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByRole('alertdialog')).toBeVisible()
  await expect(page.getByRole('alertdialog')).toContainText('Delete this service?')

  await page.getByRole('button', { name: 'Yes, delete service' }).click()

  await expect(page.getByRole('alertdialog')).not.toBeVisible()
  await expect(page.getByRole('link', { name: title })).not.toBeVisible()
})
