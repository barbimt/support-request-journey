import { devices, expect, test } from '@playwright/test'
import {
  openDeleteConfirmDialog,
  openMobileMenu,
  setTheme,
  submitEmptySupportRequest,
  waitForPageReady,
} from './e2e-helpers'

const mobileViewport = devices['iPhone 13'].viewport!

test('skip link moves focus to main content', async ({ page }) => {
  await page.goto('/')
  await waitForPageReady(page)

  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
})

test('mobile menu supports keyboard open, focus, and escape close', async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto('/')
  await waitForPageReady(page)

  const menuToggle = page.getByRole('button', { name: /^(Open|Close) menu$/ })

  await expect(async () => {
    await menuToggle.focus()
    await expect(menuToggle).toBeFocused()
    await page.keyboard.press('Space')
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true')
  }).toPass()

  await expect(page.locator('#main-nav').getByRole('link', { name: 'Home' })).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(menuToggle).toBeFocused()
})

test('mobile menu traps focus with Tab from last to first link', async ({ page }) => {
  await page.setViewportSize(mobileViewport)
  await page.goto('/')
  await waitForPageReady(page)

  await openMobileMenu(page)

  const requestSupportLink = page.locator('#main-nav').getByRole('link', { name: 'Request support' })
  await requestSupportLink.focus()
  await page.keyboard.press('Tab')

  await expect(page.locator('#main-nav').getByRole('link', { name: 'Home' })).toBeFocused()
})

test('validation summary receives focus after invalid submit', async ({ page }) => {
  await submitEmptySupportRequest(page)

  await expect(page.locator('.alert-error').first()).toBeFocused()
})

test('delete dialog closes with Escape and returns focus to trigger', async ({ page }) => {
  await openDeleteConfirmDialog(page)

  await expect(page.getByRole('alertdialog')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Yes, delete service' })).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(page.getByRole('alertdialog')).toBeHidden()
  await expect(page.locator('#existing-services-table').getByRole('button', { name: 'Delete' }).first()).toBeFocused()
})

test('theme toggle updates pressed state with keyboard', async ({ page }) => {
  await setTheme(page, 'light')
  await page.goto('/')
  await waitForPageReady(page)

  const themeToggle = page.getByRole('button', { name: 'Dark mode' })
  await themeToggle.focus()

  await expect(async () => {
    await page.keyboard.press('Enter')
    await expect(page.getByRole('button', { name: 'Light mode' })).toBeVisible()
  }).toPass()

  await expect(page.getByRole('button', { name: 'Light mode' })).toHaveAttribute('aria-pressed', 'true')
})
