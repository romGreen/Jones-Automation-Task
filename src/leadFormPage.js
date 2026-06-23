// Page Object for the "Request a call back" lead form on https://test.netlify.app/
//
// Selector strategy: prefer semantic locators (getByLabel / getByRole) over
// fragile CSS. Every input on the page is associated with a <label for="...">,
// so getByLabel resolves to a single, accessible element.
export class LeadFormPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.phoneInput = page.getByLabel('Phone');
    this.companyInput = page.getByLabel('Company');
    this.websiteInput = page.getByLabel('Website');
    this.employeesSelect = page.getByLabel('Number of Employees');
    this.submitButton = page.getByRole('button', { name: 'Request a call back' });
    this.formHeading = page.getByRole('heading', { name: 'Interested in our Service?' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillContactDetails({ name, email, phone, company, website }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.companyInput.fill(company);
    await this.websiteInput.fill(website);
  }

  // Accepts the option value/label, e.g. "51-500".
  async selectNumberOfEmployees(value) {
    await this.employeesSelect.selectOption(value);
  }

  async takeBeforeSubmitScreenshot(filePath) {
    await this.page.screenshot({ path: filePath, fullPage: true });
  }

  // The form is a standard GET submit that navigates to thank-you.html.
  async submit() {
    await this.submitButton.click();
  }
}
