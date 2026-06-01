import { expect, type Locator, type Page } from '@playwright/test'
import { copy } from '../copy'
import { appPages } from '../routes'
import { waitForPageReady } from '../e2e-helpers'

export class RequestSupportPage {
  readonly page: Page
  readonly fullName: Locator
  readonly email: Locator
  readonly supportFor: Locator
  readonly supportType: Locator
  readonly preferredContactEmail: Locator
  readonly message: Locator
  readonly consent: Locator
  readonly submitButton: Locator
  readonly successMessage: Locator
  readonly errorSummary: Locator

  constructor(page: Page) {
    this.page = page
    this.fullName = page.getByLabel('Full name', { exact: false })
    this.email = page.getByLabel('Email address', { exact: false })
    this.supportFor = page.locator('#supportFor')
    this.supportType = page.locator('#supportType')
    this.preferredContactEmail = page.locator('input[type="radio"][name="preferredContact"][value="email"]')
    this.message = page.locator('#message')
    this.consent = page.locator('#consent')
    this.submitButton = page.getByRole('button', { name: copy.supportRequest.submitButton })
    this.successMessage = page.getByRole('status')
    this.errorSummary = page.getByRole('alert').filter({
      has: page.getByRole('heading', { name: copy.validation.problemHeading }),
    })
  }

  async goto(): Promise<void> {
    await this.page.goto(appPages.requestSupport.path)
    await waitForPageReady(this.page)
  }

  async submitEmpty(): Promise<void> {
    await this.goto()

    await expect(async () => {
      await this.fullName.click()
      await this.submitButton.click()
      await expect(this.page.getByRole('heading', { name: copy.validation.problemHeading })).toBeVisible()
    }).toPass({ timeout: 10_000 })
  }

  async waitForHydratedForm(): Promise<void> {
    await expect(async () => {
      await this.fullName.click()
      await this.fullName.fill('hydration-check')
      await expect(this.fullName).toHaveValue('hydration-check')
      await this.fullName.fill('')
      await expect(this.fullName).toHaveValue('')
    }).toPass({ timeout: 10_000 })
  }

  async fillValidForm(): Promise<void> {
    await this.waitForHydratedForm()

    await this.fullName.fill('Jordan Lee')
    await this.email.fill('jordan@example.com')
    await this.supportFor.selectOption('myself')
    await this.supportType.selectOption('family')
    await this.preferredContactEmail.check()
    await this.message.fill(
      'We would like information about local family support groups and how to refer.',
    )
    await this.consent.check()

    await expect(this.fullName).toHaveValue('Jordan Lee')
    await expect(this.supportFor).toHaveValue('myself')
    await expect(this.consent).toBeChecked()
  }
}
