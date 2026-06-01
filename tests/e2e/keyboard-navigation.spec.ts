import { expect, test } from '@playwright/test'
import { copy } from './copy'
import { AppShellPage } from './pages/app-shell.page'
import { ManageServicesPage } from './pages/manage-services.page'
import { RequestSupportPage } from './pages/request-support.page'
import { appPages } from './routes'
import { setTheme, waitForServiceCards } from './e2e-helpers'

test('skip link moves focus to main content', async ({ page }) => {
  const shell = new AppShellPage(page)

  await shell.goto('home')

  await page.keyboard.press('Tab')
  await expect(shell.skipLink).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(shell.mainContent).toBeFocused()
})

test('mobile menu supports keyboard open, focus, and escape close', async ({ page }) => {
  const shell = new AppShellPage(page)

  await shell.setMobileViewport()
  await shell.goto('home')

  await expect(async () => {
    await shell.menuToggle.focus()
    await expect(shell.menuToggle).toBeFocused()
    await page.keyboard.press('Space')
    await expect(shell.menuToggle).toHaveAttribute('aria-expanded', 'true')
  }).toPass()

  await expect(shell.homeNavLink).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(shell.menuToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(shell.menuToggle).toBeFocused()
})

test('mobile menu traps focus with Tab from last to first link', async ({ page }) => {
  const shell = new AppShellPage(page)

  await shell.setMobileViewport()
  await shell.goto('home')
  await shell.openMobileMenu()

  await shell.requestSupportNavLink.focus()
  await page.keyboard.press('Tab')

  await expect(shell.homeNavLink).toBeFocused()
})

test('validation summary receives focus after invalid submit', async ({ page }) => {
  const requestSupport = new RequestSupportPage(page)

  await requestSupport.submitEmpty()

  await expect(requestSupport.errorSummary).toBeFocused()
})

test('delete dialog closes with Escape and returns focus to trigger', async ({ page }) => {
  const manage = new ManageServicesPage(page)

  await manage.openDeleteDialogForFirstService()

  await expect(manage.deleteDialog).toBeVisible()
  await expect(manage.deleteConfirmButton).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(manage.deleteDialog).toBeHidden()
  await expect(manage.firstDeleteButton).toBeFocused()
})

test('theme toggle updates pressed state with keyboard', async ({ page }) => {
  const shell = new AppShellPage(page)

  await setTheme(page, 'light')
  await shell.goto('home')

  const themeToggle = shell.themeToggle('light')
  await themeToggle.focus()

  await expect(async () => {
    await page.keyboard.press('Enter')
    await expect(shell.themeToggle('dark')).toBeVisible()
  }).toPass()

  await expect(shell.themeToggle('dark')).toHaveAttribute('aria-pressed', 'true')
})
