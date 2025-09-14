import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PIMPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';

test.describe('Negative Test Cases - Employee Management', () => {
  test('Add Employee without Last Name should show validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PimPage(page);
    const addEmployeePage = new AddEmployeePage(page);

    // Login
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');

    // Go to PIM and Add Employee
    await dashboardPage.verifyDashboard();
    await dashboardPage.goToPIM();
    await pimPage.clickAddEmployee();

    // Fill only First and Middle Name, leave Last Name blank
    await addEmployeePage.fillName('Jane', 'X', '');
    await addEmployeePage.save();

    // Expect validation error for Last Name
    await expect(page.getByText('Required')).toBeVisible();
  });
});
