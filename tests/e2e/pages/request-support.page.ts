import { expect, type Page } from '@playwright/test'
import { copy } from '../copy'
import { appPages } from '../routes'
import { waitForPageReady } from '../e2e-helpers'

export class RequestSupportPage {
  constructor(private readonly page: Page) {}

  fullName = this.page.getByLabel('Full name', { exact: false })
  email = this.page.getByLabel('Email address', { exact: false })
  supportFor = this.page.locator('#supportFor')
  supportType = this.page.locator('#supportType')
  preferredContactEmail = this.page.locator('input[type="radio"][name="preferredContact"][value="email"]')
  message = this.page.locator('#message')
  consent = this.page.locator('#consent')
  submitButton = this.page.getByRole('button', { name: copy.supportRequest.submitButton })
  successMessage = this.page.getByRole('status')

  errorSummary = this.page.getByRole('alert').filter({
    has: this.page.getByRole('heading', { name: copy.validation.problemHeading }),
  })

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
