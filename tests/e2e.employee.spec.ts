import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PimPage } from '../pages/PIMPage';
import { AddEmployeePage, PersonalDetails, JobDetails } from '../pages/AddEmployeePage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { readPersonalDetailsFromCSV } from '../utils/readCsv';
 

test('End-to-End Employee Management from CSV', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const pimPage = new PimPage(page);
  const addEmployeePage = new AddEmployeePage(page);
  const employeeListPage = new EmployeeListPage(page);

  const username = process.env.ORANGEHRM_USERNAME;
  const password = process.env.ORANGEHRM_PASSWORD;

  if (!username || !password) {
    throw new Error('Please set ORANGEHRM_USERNAME and ORANGEHRM_PASSWORD in environment variables.');
  }

  
  const [csvData] = readPersonalDetailsFromCSV('test-data/personal-details.csv');

const testData = {
  username,
  password,
  firstName: csvData.firstName,
  middleName: csvData.middleName,
  lastName: csvData.lastName,
  personal: {
    nationality: csvData.nationality,
    maritalStatus: csvData.maritalStatus,
    dob: csvData.dob,
    gender: csvData.gender as 'Male' | 'Female',
    smoker: csvData.smoker,
  } as PersonalDetails,
  filePath: 'tests/files/dummy.pdf',
  job: {
    joinedDate: csvData.joinedDate,
    jobTitle: csvData.jobTitle,
    category: csvData.category,
    subUnit: csvData.subUnit,
    location: csvData.location,
    status: csvData.status,
  } as JobDetails
};


  // Step 1-2: Login
  await loginPage.goto();
  await loginPage.login(testData.username, testData.password);

  // Step 3: Verify Dashboard
  await dashboardPage.verifyDashboard();

  // Step 4: Go to PIM
  await dashboardPage.goToPIM();

  // Step 5: Add Employee
  await pimPage.clickAddEmployee();

  // Step 6: Fill Name and Save
  await addEmployeePage.fillName(testData.firstName, testData.middleName, testData.lastName);
  await addEmployeePage.save();
  await addEmployeePage.verifySuccess();

  // Step 7: Fill Personal Details and Save
  await addEmployeePage.fillPersonalDetails(testData.personal);
  await addEmployeePage.save();
  await addEmployeePage.verifySuccess();

  // Step 8: Attach File
  await addEmployeePage.attachFile(testData.filePath);

  // Step 9-10: Fill Job Details and Save
  await addEmployeePage.goToJobTab();
  await addEmployeePage.fillJobDetails(testData.job);
  await addEmployeePage.save();
  await addEmployeePage.verifySuccess();

  // Step 11: Go to Employee List
  await pimPage.goToEmployeeList();

  // Step 12: Search and Verify Employee
  const fullName = `${testData.firstName} ${testData.lastName}`;
  await employeeListPage.searchByName(fullName);
  await employeeListPage.verifyEmployeeInTable(fullName, testData.job.jobTitle, testData.job.location);

  // Step 13: Screenshot
  await page.screenshot({ path: 'employee-search.png', fullPage: true });
});
