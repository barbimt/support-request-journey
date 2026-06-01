import { expect, test } from './fixtures'
import { setTheme } from './e2e-helpers'

test('skip link moves focus to main content', async ({ appShell }) => {
  await appShell.goto('home')

  await appShell.page.keyboard.press('Tab')
  await expect(appShell.skipLink).toBeFocused()

  await appShell.page.keyboard.press('Enter')
  await expect(appShell.mainContent).toBeFocused()
})

test('mobile menu supports keyboard open, focus, and escape close', async ({ appShell }) => {
  await appShell.setMobileViewport()
  await appShell.goto('home')

  await expect(async () => {
    await appShell.menuToggle.focus()
    await expect(appShell.menuToggle).toBeFocused()
    await appShell.page.keyboard.press('Space')
    await expect(appShell.menuToggle).toHaveAttribute('aria-expanded', 'true')
  }).toPass()

  await expect(appShell.homeNavLink).toBeFocused()

  await appShell.page.keyboard.press('Escape')

  await expect(appShell.menuToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(appShell.menuToggle).toBeFocused()
})

test('mobile menu traps focus with Tab from last to first link', async ({ appShell }) => {
  await appShell.setMobileViewport()
  await appShell.goto('home')
  await appShell.openMobileMenu()

  await appShell.requestSupportNavLink.focus()
  await appShell.page.keyboard.press('Tab')

  await expect(appShell.homeNavLink).toBeFocused()
})

test('validation summary receives focus after invalid submit', async ({ requestSupport }) => {
  await requestSupport.submitEmpty()

  await expect(requestSupport.errorSummary).toBeFocused()
})

test('delete dialog closes with Escape and returns focus to trigger', async ({ appShell, manageServices }) => {
  await manageServices.openDeleteDialogForFirstService()

  await expect(manageServices.deleteDialog).toBeVisible()
  await expect(manageServices.deleteConfirmButton).toBeFocused()

  await appShell.page.keyboard.press('Escape')

  await expect(manageServices.deleteDialog).toBeHidden()
  await expect(manageServices.firstDeleteButton).toBeFocused()
})

test('theme toggle updates pressed state with keyboard', async ({ appShell }) => {
  await setTheme(appShell.page, 'light')
  await appShell.goto('home')

  const themeToggle = appShell.themeToggle('light')
  await themeToggle.focus()

  await expect(async () => {
    await appShell.page.keyboard.press('Enter')
    await expect(appShell.themeToggle('dark')).toBeVisible()
  }).toPass()

  await expect(appShell.themeToggle('dark')).toHaveAttribute('aria-pressed', 'true')
})
