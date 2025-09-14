import { Page, expect } from '@playwright/test';

export class EmployeeListPage {
  constructor(private page: Page) {}

  
  async searchByName(name: string) {
  const nameInput = this.page.locator(
    "//div[@class='oxd-autocomplete-text-input oxd-autocomplete-text-input--focus']//input[@placeholder='Type for hints...']"
  ).first();

  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
  await nameInput.fill(name);
  await this.page.waitForTimeout(1000); 

  const suggestion = this.page
    .locator('//div[@role="listbox"]//span[not(contains(text(), "Searching"))]')
    .first();


  if (await suggestion.isVisible({ timeout: 3000 }).catch(() => false)) {
    await suggestion.click();
  }

  
  const searchButton = this.page.locator("//button[@type='submit']");
  await searchButton.waitFor({ state: 'visible', timeout: 10000 });
  await searchButton.click();
}

  async searchById(employeeId: string) {
    const idInput = this.page.locator(
      "//label[contains(.,'Employee Id')]/following::input[1]"
    ).first();

    await idInput.fill(employeeId);

    // Click Search
    const searchButton = this.page.getByRole('button', { name: /Search/i });
    await expect(searchButton).toBeVisible({ timeout: 10000 });
    await searchButton.click();
  }

  // Verify employee details in the table
  async verifyEmployeeInTable(employeeName: string, jobTitle: string, location: string, employeeId?: string) {
    // Wait for table and rows
    await this.page.waitForSelector('//div[contains(@class, "oxd-table")]', { state: 'visible', timeout: 30000 });
    await this.page.waitForSelector('//div[contains(@class, "oxd-table-row")]', { state: 'visible', timeout: 15000 });

    // Get table header cells
    const headers = this.page.locator('//div[@role="table"]/div[@role="rowgroup"][1]/div[@role="row"]/div');
    const headerCount = await headers.count();

    let nameIndex = -1;
    let jobTitleIndex = -1;
    let locationIndex = -1;
    let idIndex = -1;

    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headers.nth(i).innerText()).trim();
      if (headerText === "Employee Name") nameIndex = i;
      if (headerText === "Job Title") jobTitleIndex = i;
      if (headerText === "Location") locationIndex = i;
      if (headerText === "Id" || headerText === "Employee Id") idIndex = i;
    }

    if (nameIndex === -1 || jobTitleIndex === -1 || locationIndex === -1) {
      throw new Error('Could not find required column headers.');
    }

    // Find the row matching employee name or ID
    const rows = this.page.locator('//div[@role="table"]/div[@role="rowgroup"][2]/div[@role="row"]');
    const rowCount = await rows.count();
    let found = false;

    for (let i = 0; i < rowCount; i++) {
      const nameCell = rows.nth(i).locator('div').nth(nameIndex);
      const nameText = (await nameCell.innerText()).trim();

      let idMatches = true;
      if (employeeId && idIndex !== -1) {
        const idCell = rows.nth(i).locator('div').nth(idIndex);
        const idText = (await idCell.innerText()).trim();
        idMatches = idText === employeeId;
      }

      if ((nameText === employeeName || (employeeId && idMatches))) {
        // Found the correct row, now check job title and location
        const jobTitleCell = rows.nth(i).locator('div').nth(jobTitleIndex);
        const locationCell = rows.nth(i).locator('div').nth(locationIndex);

        await expect(jobTitleCell).toHaveText(jobTitle);
        await expect(locationCell).toHaveText(location);
        found = true;
        break;
      }
    }

    expect(found).toBeTruthy();
  }
}