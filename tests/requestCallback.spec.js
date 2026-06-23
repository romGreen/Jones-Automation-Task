import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LeadFormPage } from '../src/leadFormPage.js';
import { leadFormData } from '../src/testData.js';

const SCREENSHOT_PATH = path.join('screenshots', 'before-request-call-back.png');

test.describe('Request a call back - lead form', () => {
  test('fills the form, takes a screenshot, submits, and reaches the thank you page', async ({ page }) => {
    const leadForm = new LeadFormPage(page);

    // 1. Open the landing page and confirm the form is actually loaded.
    await leadForm.goto();
    await expect(leadForm.formHeading).toBeVisible();
    await expect(leadForm.submitButton).toBeVisible();

    // 2. Fill in Name, Email, Phone, Company and Website.
    await leadForm.fillContactDetails(leadFormData);
    await expect(leadForm.nameInput).toHaveValue(leadFormData.name);
    await expect(leadForm.emailInput).toHaveValue(leadFormData.email);
    await expect(leadForm.phoneInput).toHaveValue(leadFormData.phone);
    await expect(leadForm.companyInput).toHaveValue(leadFormData.company);
    await expect(leadForm.websiteInput).toHaveValue(leadFormData.website);

    // 3. Bonus: change Number of Employees from "1-10" to "51-500".
    await leadForm.selectNumberOfEmployees(leadFormData.numberOfEmployees);
    await expect(leadForm.employeesSelect).toHaveValue(leadFormData.numberOfEmployees);

    // 4. Take a screenshot BEFORE clicking "Request a call back".
    await leadForm.takeBeforeSubmitScreenshot(SCREENSHOT_PATH);
    expect(fs.existsSync(SCREENSHOT_PATH), 'before-submit screenshot should be saved').toBeTruthy();

    // 5. Click "Request a call back".
    await leadForm.submit();

    // 6. Confirm we reached the thank you page.
    await expect(page).toHaveURL(/thank-you\.html/);
    await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible();

    console.log('Reached the thank you page successfully.');
  });
});
