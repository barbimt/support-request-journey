import { expect, test, type Page } from '@playwright/test'
import { copy } from './copy'
import { AppShellPage } from './pages/app-shell.page'
import { ManageServicesPage } from './pages/manage-services.page'
import { RequestSupportPage } from './pages/request-support.page'
import { appPages } from './routes'
import { isServicesListResponse } from './e2e-helpers'

test.describe.configure({ mode: 'serial' })

async function createManageService(page: Page, title: string): Promise<void> {
  const manage = new ManageServicesPage(page)

  await page.goto(appPages.services.path)
  await page.getByRole('link', { name: copy.manageServices.addServiceLink }).click()
  await manage.waitForFormReady()

  await manage.fillTitle(title)
  await manage.categoryField.selectOption('mental-health')
  await manage.descriptionField.fill('E2E test service description.')
  await manage.createButton.click()

  await expect(manage.successMessage).toContainText(title, { timeout: 15_000 })
  await expect(manage.successMessage).toContainText(copy.manageServices.serviceAddedSuffix)
}

async function openEditFromSuccessLink(page: Page): Promise<void> {
  await page.getByRole('status').getByRole('link', { name: copy.manageServices.viewDetailsLink }).click()
  await page.getByRole('link', { name: copy.manageServices.editServiceLink }).click()
  await expect(page).toHaveURL(/\/manage\/services\//)
}

test('create service from manage page', async ({ page }) => {
  const manage = new ManageServicesPage(page)

  await page.goto(appPages.services.path)
  await page.getByRole('link', { name: copy.manageServices.addServiceLink }).click()
  await expect(page).toHaveURL(appPages.manageServices.path)
  await manage.waitForFormReady()

  await manage.createButton.click()

  await expect(page.getByRole('heading', { name: copy.validation.problemHeading })).toBeVisible()
  await expect(manage.titleError).toContainText(copy.validation.serviceTitleRequired)

  await manage.titleField.fill('Community wellbeing drop-in')
  await manage.categoryField.selectOption('mental-health')
  await manage.descriptionField.fill('Weekly drop-in sessions with trained wellbeing advisors.')
  await manage.createButton.click()

  await expect(manage.successMessage).toContainText('Community wellbeing drop-in')
  await expect(manage.successMessage).toContainText(copy.manageServices.serviceAddedSuffix)
})

test('update service from manage page', async ({ page }) => {
  const manage = new ManageServicesPage(page)
  const title = `E2E update ${Date.now()}`
  const updatedTitle = `${title} updated`

  await createManageService(page, title)
  await openEditFromSuccessLink(page)

  await manage.fillTitle(updatedTitle)
  await manage.saveButton.click()

  await expect(manage.successMessage).toContainText(updatedTitle, { timeout: 15_000 })
  await expect(manage.successMessage).toContainText(copy.manageServices.serviceUpdatedSuffix)
})

test('delete service from manage page', async ({ page }) => {
  const manage = new ManageServicesPage(page)
  const title = `E2E delete ${Date.now()}`

  await createManageService(page, title)

  const href = await page
    .getByRole('status')
    .getByRole('link', { name: copy.manageServices.viewDetailsLink })
    .getAttribute('href')

  if (!href) {
    throw new Error('Expected a service details link after creating a service.')
  }

  const serviceId = href.replace('/services/', '')
  const row = await manage.findServiceRow(title)

  await row.getByRole('button', { name: copy.deleteDialog.deleteButton }).click()

  await expect(manage.deleteDialog).toBeVisible()
  await expect(manage.deleteDialog).toContainText(copy.deleteDialog.title)

  const deleteResponsePromise = page.waitForResponse(
    (response) =>
      response.request().method() === 'DELETE'
      && response.url().includes(`/api/services/${serviceId}`)
      && response.ok(),
  )

  await manage.deleteConfirmButton.click()
  await deleteResponsePromise
  await page.waitForResponse(isServicesListResponse)

  await expect(manage.deleteDialog).toBeHidden()
  await expect(
    manage.serviceRow(title),
    'deleted service should disappear from the existing services table',
  ).toHaveCount(0, { timeout: 15_000 })
})
