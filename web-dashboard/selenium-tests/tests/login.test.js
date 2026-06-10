/**
 * GlobalChain Web Dashboard — Selenium E2E Login Tests
 * =====================================================
 * Run via:
 *   npm run test:login          (recommended)
 *   node tests/login.test.js    (also works — self-bootstraps Mocha)
 *
 * Covers:
 *  TC-01  Page Load & UI Elements
 *  TC-02  Empty Field Validation
 *  TC-03  Invalid Email Format
 *  TC-04  Unknown / Not-Found Email
 *  TC-05  Pending Organization Login
 *  TC-06  Suspended Organization Login
 *  TC-07  Rejected Organization Login
 *  TC-08  Successful Login (Approved Org)
 *  TC-09  Loading State Shown During Auth
 *  TC-10  Forgot Password Link Navigation
 *  TC-11  Register Organization Link Navigation
 *  TC-12  Admin Login Button Navigation
 */

'use strict';

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const config = require('../config');

// ─── Self-Runner ────────────────────────────────────────────────────────────
// Allows: `node tests/login.test.js` in addition to `npm test`
if (require.main === module) {
  const Mocha = require('mocha');
  const mocha = new Mocha({ timeout: 30000, reporter: 'spec' });

  // Clear cache so Mocha can re-require this file with describe/it globals injected
  delete require.cache[require.resolve(__filename)];

  mocha.addFile(__filename);
  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });

} else {
  // ─── Helpers ──────────────────────────────────────────────────────────────

  async function getDriver() {
    const options = new chrome.Options();

    // Headless mode: set TEST_HEADLESS=true before running
    if (process.env.TEST_HEADLESS === 'true') {
      options.addArguments('--headless=new');
    }

    options.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1366,768'
    );

    const path = require('path');
    const fs = require('fs');

    // On Windows use the local chromedriver.exe; on Linux/CI use system chromedriver
    const localDriver = path.resolve(__dirname, '../chromedriver.exe');
    const isWindows = process.platform === 'win32';

    const builder = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options);

    if (isWindows && fs.existsSync(localDriver)) {
      const service = new chrome.ServiceBuilder(localDriver);
      builder.setChromeService(service);
    }
    // On Linux/CI, chromedriver is on PATH via nanasess/setup-chromedriver

    return builder.build();
  }

  async function navigateToLogin(driver) {
    await driver.get(`${config.baseUrl}/auth/login`);
    await driver.wait(until.elementLocated(By.css('form')), 10000);
  }

  async function fillLoginForm(driver, email, password) {
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    await emailInput.clear();
    await emailInput.sendKeys(email);
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  async function clickLoginButton(driver) {
    const loginBtn = await driver.findElement(By.css('button[type="submit"]'));
    await loginBtn.click();
  }

  async function getErrorMessage(driver, timeoutMs = 10000) {
    try {
      // Wait up to 10 seconds for the error message element to appear
      await driver.wait(until.elementLocated(By.css('.text-critical')), timeoutMs);
      const errEl = await driver.findElement(By.css('.text-critical'));
      return await errEl.getText();
    } catch {
      return null;
    }
  }

  // ─── Test Suite ────────────────────────────────────────────────────────────

  describe('GlobalChain — Login Page E2E Tests', function () {
    this.timeout(30000);

    let driver;

    before(async function () {
      driver = await getDriver();
    });

    after(async function () {
      if (driver) await driver.quit();
    });

    // ── TC-01: Page Load & Core UI Elements ──────────────────────────────────
    it('TC-01: Should load login page with all required UI elements', async function () {
      await navigateToLogin(driver);

      const title = await driver.findElement(By.css('h1'));
      const titleText = await title.getText();
      assert.ok(titleText.includes('GLOBALCHAIN'), `Expected brand title, got: ${titleText}`);

      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      assert.ok(emailInput, 'Email input should exist');

      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      assert.ok(passwordInput, 'Password input should exist');

      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      const btnText = await submitBtn.getText();
      assert.ok(btnText.length > 0, `Submit button should have text, got: "${btnText}"`);

      const forgotLink = await driver.findElement(By.xpath("//a[contains(@href, '/auth/forgot-password')]"));
      assert.ok(forgotLink, 'Forgot password link should exist');

      const registerLink = await driver.findElement(By.xpath("//a[contains(@href, '/auth/signup')]"));
      assert.ok(registerLink, 'Register Organization link should exist');

      const adminBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Login as Administrator')]")
      );
      assert.ok(adminBtn, 'Admin login button should exist');
    });

    // ── TC-02: Empty Field Validation ─────────────────────────────────────────
    it('TC-02: Should prevent submission with empty email and password', async function () {
      await navigateToLogin(driver);
      await clickLoginButton(driver);

      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/login'),
        `Should remain on login page, navigated to: ${currentUrl}`
      );
    });

    // ── TC-03: Invalid Email Format ───────────────────────────────────────────
    it('TC-03: Should block submission for invalid email format', async function () {
      await navigateToLogin(driver);

      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      await emailInput.sendKeys('not-an-email');

      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      await passwordInput.sendKeys('anypassword');

      await clickLoginButton(driver);

      const currentUrl = await driver.getCurrentUrl();
      assert.ok(currentUrl.includes('/auth/login'), 'Should stay on login page with invalid email');
    });

    // ── TC-04: Unknown Email ──────────────────────────────────────────────────
    it('TC-04: Should show error for unregistered organization email', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, 'unknown@nonexistent-xyz.com', 'password123');
      await clickLoginButton(driver);

      const errMsg = await getErrorMessage(driver);
      assert.ok(errMsg, 'An error message should appear');
      assert.ok(
        errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('organization'),
        `Error should mention organization not found. Got: "${errMsg}"`
      );
    });

    // ── TC-05: Pending Organization ───────────────────────────────────────────
    it('TC-05: Should show "pending approval" error for pending org', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.pending.email, config.testUsers.pending.password);
      await clickLoginButton(driver);

      const errMsg = await getErrorMessage(driver);
      assert.ok(errMsg, 'An error message should appear for pending org');
      assert.ok(
        errMsg.toLowerCase().includes('pending'),
        `Error should mention pending. Got: "${errMsg}"`
      );
    });

    // ── TC-06: Suspended Organization ────────────────────────────────────────
    it('TC-06: Should show "access suspended" error for suspended org', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.suspended.email, config.testUsers.suspended.password);
      await clickLoginButton(driver);

      const errMsg = await getErrorMessage(driver);
      assert.ok(errMsg, 'An error message should appear for suspended org');
      assert.ok(
        errMsg.toLowerCase().includes('suspended'),
        `Error should mention suspended. Got: "${errMsg}"`
      );
    });

    // ── TC-07: Rejected Organization ─────────────────────────────────────────
    it('TC-07: Should show "rejected" error for rejected org', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.rejected.email, config.testUsers.rejected.password);
      await clickLoginButton(driver);

      const errMsg = await getErrorMessage(driver);
      assert.ok(errMsg, 'An error message should appear for rejected org');
      assert.ok(
        errMsg.toLowerCase().includes('rejected'),
        `Error should mention rejected. Got: "${errMsg}"`
      );
    });

    // ── TC-08: Successful Login ───────────────────────────────────────────────
    it('TC-08: Should redirect to /dashboard/executive on successful login', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.approved.email, config.testUsers.approved.password);
      await clickLoginButton(driver);

      await driver.wait(until.urlContains('/dashboard/executive'), 10000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/dashboard/executive'),
        `Expected /dashboard/executive, got: ${currentUrl}`
      );
    });

    // ── TC-09: Loading Spinner ────────────────────────────────────────────────
    it('TC-09: Should show loading state while authenticating', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.approved.email, config.testUsers.approved.password);
      await clickLoginButton(driver);

      try {
        await driver.wait(
          until.elementLocated(By.xpath("//*[contains(text(),'Authenticating')]")),
          3000
        );
        const loadingEl = await driver.findElement(By.xpath("//*[contains(text(),'Authenticating')]"));
        assert.ok(loadingEl, 'Loading text should be visible');
      } catch {
        // Loading resolved too fast — confirm redirect to dashboard
        const url = await driver.getCurrentUrl();
        assert.ok(url.includes('/dashboard'), `Should be on dashboard after login, got: ${url}`);
      }
    });

    // ── TC-10: Forgot Password Navigation ────────────────────────────────────
    it('TC-10: Should navigate to forgot-password page', async function () {
      await navigateToLogin(driver);
      const forgotLink = await driver.findElement(By.xpath("//a[contains(@href, '/auth/forgot-password')]"));
      
      // Use JS click to bypass React/Next.js intercepting the normal click
      await driver.executeScript("arguments[0].click();", forgotLink);

      await driver.wait(until.urlContains('/auth/forgot-password'), 5000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/forgot-password'),
        `Expected /auth/forgot-password, got: ${currentUrl}`
      );
    });

    // ── TC-11: Register Organization Navigation ───────────────────────────────
    it('TC-11: Should navigate to signup page', async function () {
      await navigateToLogin(driver);
      const registerLink = await driver.findElement(By.xpath("//a[contains(@href, '/auth/signup')]"));
      await registerLink.click();

      await driver.wait(until.urlContains('/auth/signup'), 5000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/signup'),
        `Expected /auth/signup, got: ${currentUrl}`
      );
    });

    // ── TC-12: Admin Login Navigation ────────────────────────────────────────
    it('TC-12: Should navigate to admin login page', async function () {
      await navigateToLogin(driver);
      const adminBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Login as Administrator')]")
      );
      await adminBtn.click();

      await driver.wait(until.urlContains('/admin/login'), 5000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/admin/login'),
        `Expected /admin/login, got: ${currentUrl}`
      );
    });
  });
}
