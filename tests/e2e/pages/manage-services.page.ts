import { expect, type Locator, type Page } from '@playwright/test'
import { copy } from '../copy'
import { appPages } from '../routes'
import {
  fillServiceTitle,
  waitForManagePageReady,
  waitForManageServicesClientReady,
  waitForManageServicesTable,
} from '../e2e-helpers'

export class ManageServicesPage {
  constructor(private readonly page: Page) {}

  heading = this.page.getByRole('heading', { name: copy.manageServices.heading })
  existingServicesHeading = this.page.getByRole('heading', { name: copy.manageServices.existingServicesHeading })
  titleField = this.page.getByLabel('Service title', { exact: false })
  categoryField = this.page.getByLabel('Category', { exact: false })
  descriptionField = this.page.getByLabel('Description', { exact: false })
  createButton = this.page.getByRole('button', { name: copy.manageServices.createButton })
  saveButton = this.page.getByRole('button', { name: copy.manageServices.saveButton })
  successMessage = this.page.getByRole('status')
  searchField = this.page.locator('#existingServicesSearch')
  servicesTable = this.page.locator('#existing-services-table')
  firstDeleteButton = this.servicesTable.getByRole('button', { name: copy.deleteDialog.deleteButton }).first()
  firstEditLink = this.page.getByRole('link', { name: copy.manageServices.editLink }).first()
  deleteDialog = this.page.getByRole('alertdialog')
  deleteConfirmButton = this.page.getByRole('button', { name: copy.deleteDialog.confirmButton })

  errorSummary = this.page.getByRole('alert').filter({
    has: this.page.getByRole('heading', { name: copy.validation.problemHeading }),
  })

  titleError = this.page.locator('#title-error')

  async goto(): Promise<void> {
    await waitForManageServicesClientReady(this.page, () => this.page.goto(appPages.manageServices.path))
  }

  async waitForTable(): Promise<void> {
    await waitForManageServicesTable(this.page)
  }

  async waitForFormReady(): Promise<void> {
    await waitForManagePageReady(this.page)
  }

  async submitEmptyCreate(): Promise<void> {
    await this.goto()

    await expect(async () => {
      await this.titleField.click()
      await this.createButton.click()
      await expect(this.page.getByRole('heading', { name: copy.validation.problemHeading })).toBeVisible()
    }).toPass({ timeout: 10_000 })
  }

  async openDeleteDialogForFirstService(): Promise<void> {
    await this.waitForTable()
    await this.existingServicesHeading.scrollIntoViewIfNeeded()

    await expect(async () => {
      if (await this.page.getByRole('heading', { name: copy.errors.pageLoadHeading }).isVisible()) {
        await waitForManageServicesClientReady(this.page, () => this.page.goto(appPages.manageServices.path))
      }

      await expect(this.heading).toBeVisible()
      await this.firstDeleteButton.click()
      await expect(this.deleteDialog).toBeVisible()
    }).toPass({ timeout: 15_000 })
  }

  async fillTitle(title: string): Promise<void> {
    await fillServiceTitle(this.page, title)
  }

  serviceRow(title: string): Locator {
    return this.servicesTable.locator('tbody').getByRole('row', { name: new RegExp(title) })
  }

  async findServiceRow(title: string): Promise<Locator> {
    await this.existingServicesHeading.scrollIntoViewIfNeeded()
    await this.searchField.fill(title)

    const row = this.serviceRow(title)
    await expect(row).toBeVisible({ timeout: 15_000 })

    return row
  }
}
