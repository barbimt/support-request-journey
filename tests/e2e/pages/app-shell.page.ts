import { expect, type Page } from '@playwright/test'
import { copy } from '../copy'
import { appPages, type AppPageId } from '../routes'
import { mobileViewport, openMobileMenu as openMobileMenuOnPage, waitForPageReady } from '../e2e-helpers'

export class AppShellPage {
  constructor(private readonly page: Page) {}

  skipLink = this.page.getByRole('link', { name: copy.nav.skipToMain })
  mainContent = this.page.locator('#main-content')
  menuToggle = this.page.getByRole('button', { name: /^(Open|Close) menu$/ })
  nav = this.page.locator('#main-nav')
  homeNavLink = this.nav.getByRole('link', { name: copy.nav.home })
  requestSupportNavLink = this.nav.getByRole('link', { name: copy.nav.requestSupport })

  async goto(pageId: AppPageId = 'home'): Promise<void> {
    await this.page.goto(appPages[pageId].path)
    await waitForPageReady(this.page)
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize(mobileViewport)
  }

  async openMobileMenu(): Promise<void> {
    await openMobileMenuOnPage(this.page)
  }

  themeToggle(mode: 'light' | 'dark'): ReturnType<Page['getByRole']> {
    return this.page.getByRole('button', {
      name: mode === 'light' ? copy.theme.darkModeButton : copy.theme.lightModeButton,
    })
  }

  async expectOpenMenuButtonVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  }
}
