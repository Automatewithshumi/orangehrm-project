import { Page } from '@playwright/test';

export class PimPage {
  constructor(private page: Page) {}

  async clickAddEmployee() {
    await this.page.getByRole('button', { name: 'Add' }).click();
  }

  async goToEmployeeList() {
    await this.page.getByRole('link', { name: 'Employee List' }).click();


  }
}