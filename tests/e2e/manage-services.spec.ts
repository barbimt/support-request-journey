import { copy } from './copy'
import { expect, test } from './fixtures'
import type { ManageServicesPage } from './pages/manage-services'
import { appPages } from './routes'
import { isServicesListResponse } from './e2e-helpers'

test.describe.configure({ mode: 'serial' })

async function createManageService(manage: ManageServicesPage, title: string): Promise<void> {
  await manage.page.goto(appPages.services.path)
  await manage.page.getByRole('link', { name: copy.manageServices.addServiceLink }).click()
  await manage.waitForFormReady()

  await manage.fillTitle(title)
  await manage.categoryField.selectOption('mental-health')
  await manage.descriptionField.fill('E2E test service description.')
  await manage.createButton.click()

  await expect(manage.successMessage).toContainText(title, { timeout: 15_000 })
  await expect(manage.successMessage).toContainText(copy.manageServices.serviceAddedSuffix)
}

async function openEditFromSuccessLink(manage: ManageServicesPage): Promise<void> {
  await manage.page.getByRole('status').getByRole('link', { name: copy.manageServices.viewDetailsLink }).click()
  await manage.page.getByRole('link', { name: copy.manageServices.editServiceLink }).click()
  await expect(manage.page).toHaveURL(/\/manage\/services\//)
}

test('create service from manage page', async ({ manageServices }) => {
  await manageServices.page.goto(appPages.services.path)
  await manageServices.page.getByRole('link', { name: copy.manageServices.addServiceLink }).click()
  await expect(manageServices.page).toHaveURL(appPages.manageServices.path)
  await manageServices.waitForFormReady()

  await manageServices.createButton.click()

  await expect(manageServices.page.getByRole('heading', { name: copy.validation.problemHeading })).toBeVisible()
  await expect(manageServices.titleError).toContainText(copy.validation.serviceTitleRequired)

  await manageServices.titleField.fill('Community wellbeing drop-in')
  await manageServices.categoryField.selectOption('mental-health')
  await manageServices.descriptionField.fill('Weekly drop-in sessions with trained wellbeing advisors.')
  await manageServices.createButton.click()

  await expect(manageServices.successMessage).toContainText('Community wellbeing drop-in')
  await expect(manageServices.successMessage).toContainText(copy.manageServices.serviceAddedSuffix)
})

test('update service from manage page', async ({ manageServices }) => {
  const title = `E2E update ${Date.now()}`
  const updatedTitle = `${title} updated`

  await createManageService(manageServices, title)
  await openEditFromSuccessLink(manageServices)

  await manageServices.fillTitle(updatedTitle)
  await manageServices.saveButton.click()

  await expect(manageServices.successMessage).toContainText(updatedTitle, { timeout: 15_000 })
  await expect(manageServices.successMessage).toContainText(copy.manageServices.serviceUpdatedSuffix)
})

test('delete service from manage page', async ({ manageServices }) => {
  const title = `E2E delete ${Date.now()}`

  await createManageService(manageServices, title)

  const href = await manageServices.page
    .getByRole('status')
    .getByRole('link', { name: copy.manageServices.viewDetailsLink })
    .getAttribute('href')

  if (!href) {
    throw new Error('Expected a service details link after creating a service.')
  }

  const serviceId = href.replace('/services/', '')
  const row = await manageServices.findServiceRow(title)

  await row.getByRole('button', { name: copy.deleteDialog.deleteButton }).click()

  await expect(manageServices.deleteDialog).toBeVisible()
  await expect(manageServices.deleteDialog).toContainText(copy.deleteDialog.title)

  const deleteResponsePromise = manageServices.page.waitForResponse(
    (response) =>
      response.request().method() === 'DELETE'
      && response.url().includes(`/api/services/${serviceId}`)
      && response.ok(),
  )

  await manageServices.deleteConfirmButton.click()
  await deleteResponsePromise
  await manageServices.page.waitForResponse(isServicesListResponse)

  await expect(manageServices.deleteDialog).toBeHidden()
  await expect(
    manageServices.serviceRow(title),
    'deleted service should disappear from the existing services table',
  ).toHaveCount(0, { timeout: 15_000 })
})
