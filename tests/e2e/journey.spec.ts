import { copy } from './copy'
import { expect, test } from './fixtures'
import { appPages } from './routes'
import { waitForPageReady, waitForServiceCards } from './e2e-helpers'

test('support request journey from home to success', async ({ page, appShell, requestSupport }) => {
  await appShell.goto('home')

  await page.getByRole('link', { name: copy.nav.browseServices }).click()
  await expect(page).toHaveURL(appPages.services.path)
  await waitForPageReady(page)
  await waitForServiceCards(page)

  await page.getByRole('link', { name: copy.services.viewDetailsLink }).first().click()
  await expect(page).toHaveURL(/\/services\/.+/)
  await waitForPageReady(page)

  await appShell.mainContent.getByRole('link', { name: copy.services.requestSupportFromDetail }).click()
  await expect(page).toHaveURL(appPages.requestSupport.path)
  await waitForPageReady(page)

  await requestSupport.fillValidForm()

  const submitResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/support-requests') && response.request().method() === 'POST',
  )
  await requestSupport.submitButton.click()
  await submitResponse

  await expect(requestSupport.successMessage).toContainText(copy.supportRequest.submitSuccess, {
    timeout: 15_000,
  })
})
