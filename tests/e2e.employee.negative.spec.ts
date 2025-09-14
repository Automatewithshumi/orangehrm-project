import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PIMPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { readPersonalDetailsFromCSV } from '../utils/readCsv';

// Load credentials from .env
const username = process.env.ORANGEHRM_USERNAME;
const password = process.env.ORANGEHRM_PASSWORD;

if (!username || !password) {
  throw new Error('Please set ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD in your .env file.');
}

// Load full personal+job data from CSV
const [csvData] = readPersonalDetailsFromCSV('test-data/personal-details.csv');

test.describe('Negative Test Cases - Employee Management', () => {
  test('Should show validation error when Last Name is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PimPage(page);
    const addEmployeePage = new AddEmployeePage(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(username, password);

    // Step 2: Navigate to PIM > Add Employee
    await dashboardPage.verifyDashboard();
    await dashboardPage.goToPIM();
    await pimPage.clickAddEmployee();

    // Step 3: Fill only first & middle name from CSV; leave last name blank intentionally
    const firstName = csvData.firstName;
    const middleName = csvData.middleName;
    const lastName = ''; 

    await addEmployeePage.fillName(firstName, middleName, lastName);
    await addEmployeePage.save();

    // Step 4: Assert validation message appears
    await expect(page.getByText('Required')).toBeVisible();
  });
});
