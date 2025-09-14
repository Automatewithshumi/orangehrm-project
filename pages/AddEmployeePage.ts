import { Page, expect } from '@playwright/test';


export interface PersonalDetails {
  nationality: string;
  maritalStatus: string;
  dob: string;
  gender: 'Male' | 'Female';
  smoker: boolean;
}

export interface JobDetails {
  joinedDate: string;
  jobTitle: string;
  category: string;
  subUnit: string;
  location: string;
  status: string;
}

export class AddEmployeePage {
  constructor(private page: Page) {}

  async fillName(first: string, middle: string, last: string) {
    await this.page.fill('input[name="firstName"]', first);
    await this.page.fill('input[name="middleName"]', middle);
    await this.page.fill('input[name="lastName"]', last);
  }

 async save() {
   await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 10000 });
  const allSaveButtons = this.page.getByRole('button', { name: 'Save' });
  await allSaveButtons.last().click({ force: true });
  await allSaveButtons.last().click();

}


  async verifySuccess() {
  await expect(this.page.getByText('Success', { exact: true })).toBeVisible({ timeout: 5000 });

  }

  async fillPersonalDetails(details: PersonalDetails) {
  await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 15000 });

  
 await this.page.locator('.oxd-select-wrapper').nth(0).click();
await this.page.getByRole('option', { name: details.nationality }).click();

await this.page.locator('.oxd-select-wrapper').nth(1).click();
await this.page.getByRole('option', { name: details.maritalStatus }).click();

}


  async attachFile(filePath: string) {
  await this.page.locator('//button[normalize-space()="Add"]').click();
  const fileInput = this.page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  await this.page.getByRole('button', { name: 'Save' }).nth(2).click();

}


  async goToJobTab() {
    await this.page.getByRole('tab', { name: 'Job' }).click();
  }

  async fillJobDetails(details: JobDetails) {
  await this.page.waitForSelector('h6:has-text("Job Details")', { timeout: 10000 });

 const dateInput = this.page.getByPlaceholder('yyyy-dd-mm');
await dateInput.waitFor({ state: 'visible' });
await dateInput.fill(details.joinedDate);


  const selectDropdown = async (labelText: string, value: string) => {
  const loader = this.page.locator('.oxd-form-loader');

  if (await loader.count() > 0 && await loader.isVisible()) {
    await loader.waitFor({ state: 'hidden', timeout: 10000 });
  }

  const label = this.page.locator(`label:has-text("${labelText}")`);
  const container = label.locator('xpath=ancestor::div[contains(@class, "oxd-grid-item")]');
  const dropdown = container.locator('.oxd-select-wrapper');

  await dropdown.waitFor({ state: 'visible', timeout: 10000 });
  await dropdown.click();

  const options = this.page.locator('.oxd-select-dropdown .oxd-select-option');
  await options.first().waitFor({ state: 'visible', timeout: 5000 });

  const count = await options.count();
  for (let i = 0; i < count; i++) {
    const optionText = await options.nth(i).textContent();
    if (optionText?.trim().toLowerCase() === value.toLowerCase()) {
      await options.nth(i).click();
      return;
    }
  }

  throw new Error(`Option "${value}" not found for dropdown labeled "${labelText}"`);
};


  await selectDropdown('Job Title', details.jobTitle);
  await selectDropdown('Job Category', details.category);
  await selectDropdown('Sub Unit', details.subUnit);
  await selectDropdown('Location', details.location);
  await selectDropdown('Employment Status', details.status);

  const saveButton = this.page.getByRole('button', { name: 'Save' });
  await saveButton.waitFor({ state: 'visible', timeout: 10000 });
  await saveButton.click();

await this.save();

// verify success toast appears
const toast = this.page.locator('.oxd-toast');
await expect(toast).toBeVisible({ timeout: 10000 });
await toast.waitFor({ state: 'hidden', timeout: 10000 });
await expect(toast).toContainText('Success');
}

}