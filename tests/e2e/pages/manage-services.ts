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
  readonly page: Page
  readonly heading: Locator
  readonly existingServicesHeading: Locator
  readonly titleField: Locator
  readonly categoryField: Locator
  readonly descriptionField: Locator
  readonly createButton: Locator
  readonly saveButton: Locator
  readonly successMessage: Locator
  readonly searchField: Locator
  readonly servicesTable: Locator
  readonly firstDeleteButton: Locator
  readonly firstEditLink: Locator
  readonly deleteDialog: Locator
  readonly deleteConfirmButton: Locator
  readonly errorSummary: Locator
  readonly titleError: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: copy.manageServices.heading })
    this.existingServicesHeading = page.getByRole('heading', { name: copy.manageServices.existingServicesHeading })
    this.titleField = page.getByLabel('Service title', { exact: false })
    this.categoryField = page.getByLabel('Category', { exact: false })
    this.descriptionField = page.getByLabel('Description', { exact: false })
    this.createButton = page.getByRole('button', { name: copy.manageServices.createButton })
    this.saveButton = page.getByRole('button', { name: copy.manageServices.saveButton })
    this.successMessage = page.getByRole('status').filter({
      has: page.getByRole('link', { name: copy.manageServices.viewDetailsLink }),
    })
    this.searchField = page.locator('#existingServicesSearch')
    this.servicesTable = page.locator('#existing-services-table')
    this.firstDeleteButton = this.servicesTable.getByRole('button', { name: copy.deleteDialog.deleteButton }).first()
    this.firstEditLink = page.getByRole('link', { name: copy.manageServices.editLink }).first()
    this.deleteDialog = page.getByRole('alertdialog')
    this.deleteConfirmButton = page.getByRole('button', { name: copy.deleteDialog.confirmButton })
    this.errorSummary = page.getByRole('alert').filter({
      has: page.getByRole('heading', { name: copy.validation.problemHeading }),
    })
    this.titleError = page.locator('#title-error')
  }

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
