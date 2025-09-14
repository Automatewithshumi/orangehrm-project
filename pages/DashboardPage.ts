import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async verifyDashboard() {
      await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible' });
  }

  async goToPIM() {
    await this.page.getByRole('link', { name: 'PIM' }).click();
  }
}