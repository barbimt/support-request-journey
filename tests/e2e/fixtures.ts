import { test as base } from '@playwright/test'
import { AppShellPage } from './pages/app-shell'
import { ManageServicesPage } from './pages/manage-services'
import { RequestSupportPage } from './pages/request-support'

type PageFixtures = {
  appShell: AppShellPage
  requestSupport: RequestSupportPage
  manageServices: ManageServicesPage
}

export const test = base.extend<PageFixtures>({
  appShell: async ({ page }, use) => {
    await use(new AppShellPage(page))
  },
  requestSupport: async ({ page }, use) => {
    await use(new RequestSupportPage(page))
  },
  manageServices: async ({ page }, use) => {
    await use(new ManageServicesPage(page))
  },
})

export { expect } from '@playwright/test'
