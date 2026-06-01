import { expect, type Locator, type Page } from '@playwright/test'
import { copy } from '../copy'
import { appPages, type AppPageId } from '../routes'
import { mobileViewport, openMobileMenu as openMobileMenuOnPage, waitForPageReady } from '../e2e-helpers'

export class AppShellPage {
  readonly page: Page
  readonly skipLink: Locator
  readonly mainContent: Locator
  readonly menuToggle: Locator
  readonly nav: Locator
  readonly homeNavLink: Locator
  readonly requestSupportNavLink: Locator

  constructor(page: Page) {
    this.page = page
    this.skipLink = page.getByRole('link', { name: copy.nav.skipToMain })
    this.mainContent = page.locator('#main-content')
    this.menuToggle = page.getByRole('button', { name: /^(Open|Close) menu$/ })
    this.nav = page.locator('#main-nav')
    this.homeNavLink = this.nav.getByRole('link', { name: copy.nav.home })
    this.requestSupportNavLink = this.nav.getByRole('link', { name: copy.nav.requestSupport })
  }

  themeToggle(mode: 'light' | 'dark'): Locator {
    return this.page.getByRole('button', {
      name: mode === 'light' ? copy.theme.darkModeButton : copy.theme.lightModeButton,
    })
  }

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

  async expectOpenMenuButtonVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  }
}
