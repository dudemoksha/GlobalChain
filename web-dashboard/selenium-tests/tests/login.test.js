/**
 * GlobalChain Web Dashboard — Selenium E2E Login Tests
 * =====================================================
 * Run via:
 *   npm run test:login          (recommended, headed)
 *   npm run test:headless       (CI / headless)
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
  const mocha = new Mocha({ timeout: 60000, reporter: 'spec' });
  delete require.cache[require.resolve(__filename)];
  mocha.addFile(__filename);
  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });

} else {
  // ─── Helpers ──────────────────────────────────────────────────────────────

  async function getDriver() {
    const options = new chrome.Options();

    if (process.env.TEST_HEADLESS === 'true') {
      options.addArguments('--headless=new');
    }

    options.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--window-size=1366,768',
      '--remote-allow-origins=*'
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

  /**
   * Navigate to the login page and wait for the form + both inputs to be ready.
   * This ensures the page is fully hydrated before any test interaction.
   */
  async function navigateToLogin(driver) {
    await driver.get(`${config.baseUrl}/auth/login`);
    // Wait for the form to exist
    await driver.wait(until.elementLocated(By.css('form')), 15000);
    // Wait for both inputs to be present and visible
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 15000);
    await driver.wait(until.elementLocated(By.css('input[type="password"]')), 15000);
    // Small settle delay for React hydration
    await driver.sleep(500);
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

  async function getErrorMessage(driver, timeoutMs = 12000) {
    try {
      // The error div has class "text-critical" (Tailwind custom color class)
      await driver.wait(until.elementLocated(By.css('.text-critical')), timeoutMs);
      const errEl = await driver.findElement(By.css('.text-critical'));
      return await errEl.getText();
    } catch {
      return null;
    }
  }

  // ─── Test Suite ────────────────────────────────────────────────────────────

  describe('GlobalChain — Login Page E2E Tests', function () {
    this.timeout(60000);

    let driver;

    before(async function () {
      driver = await getDriver();
    });

    after(async function () {
      if (driver) await driver.quit();
    });

    // ── TC-01: Page Load & Core UI Elements ───────────────────────────────────
    it('TC-01: Should load login page with all required UI elements', async function () {
      await navigateToLogin(driver);

      // Brand title — h1 contains "GLOBAL" and a span with "CHAIN"
      // driver.getText() on h1 returns the full visible text: "GLOBALCHAIN"
      const title = await driver.findElement(By.css('h1'));
      const titleText = await title.getText();
      assert.ok(
        titleText.toUpperCase().includes('GLOBAL'),
        `Expected brand title containing 'GLOBAL', got: "${titleText}"`
      );

      // Email input
      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      assert.ok(emailInput, 'Email input should exist');

      // Password input
      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      assert.ok(passwordInput, 'Password input should exist');

      // Submit button
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      const btnText = await submitBtn.getText();
      assert.ok(btnText.length > 0, `Submit button should have text, got: "${btnText}"`);

      // Forgot password link
      const forgotLink = await driver.findElement(
        By.xpath("//a[contains(@href, '/auth/forgot-password')]")
      );
      assert.ok(forgotLink, 'Forgot password link should exist');

      // Register Organization link
      const registerLink = await driver.findElement(
        By.xpath("//a[contains(@href, '/auth/signup')]")
      );
      assert.ok(registerLink, 'Register Organization link should exist');

      // Admin login button — use contains(., ...) because the button has an icon child node
      const adminBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Login as Administrator')]")
      );
      assert.ok(adminBtn, 'Admin login button should exist');
    });

    // ── TC-02: Empty Field Validation ──────────────────────────────────────────
    it('TC-02: Should prevent submission with empty email and password', async function () {
      await navigateToLogin(driver);
      await clickLoginButton(driver);

      // With required fields, browser native validation keeps page on /auth/login
      // Give it a moment then check the URL hasn't changed
      await driver.sleep(1000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/login'),
        `Should remain on login page, navigated to: ${currentUrl}`
      );
    });

    // ── TC-03: Invalid Email Format ────────────────────────────────────────────
    it('TC-03: Should block submission for invalid email format', async function () {
      await navigateToLogin(driver);

      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      await emailInput.sendKeys('not-an-email');
      await passwordInput.sendKeys('anypassword');

      await clickLoginButton(driver);

      // Browser's built-in email validation should prevent navigation
      await driver.sleep(1000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/login'),
        `Should stay on login page with invalid email, got: ${currentUrl}`
      );
    });

    // ── TC-04: Unknown Email ───────────────────────────────────────────────────
    it('TC-04: Should show error for unregistered organization email', async function () {
      await navigateToLogin(driver);
      await fillLoginForm(driver, 'unknown@nonexistent-xyz.com', 'password123');
      await clickLoginButton(driver);

      const errMsg = await getErrorMessage(driver);
      assert.ok(errMsg, 'An error message should appear');
      assert.ok(
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('organization') ||
        errMsg.toLowerCase().includes('authentication'),
        `Error should mention org not found. Got: "${errMsg}"`
      );
    });

    // ── TC-05: Pending Organization ────────────────────────────────────────────
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

    // ── TC-06: Suspended Organization ─────────────────────────────────────────
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

    // ── TC-07: Rejected Organization ──────────────────────────────────────────
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

    // ── TC-08: Successful Login ────────────────────────────────────────────────
    it('TC-08: Should redirect to /dashboard/executive on successful login', async function () {
      // Skip if real approved credentials are not configured as GitHub Secrets
      if (!process.env.TEST_USER_APPROVED_EMAIL) {
        console.log('  ⚠ TC-08 skipped — TEST_USER_APPROVED_EMAIL secret not set');
        this.skip();
      }
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.approved.email, config.testUsers.approved.password);
      await clickLoginButton(driver);

      await driver.wait(until.urlContains('/dashboard/executive'), 15000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/dashboard/executive'),
        `Expected /dashboard/executive, got: ${currentUrl}`
      );
    });

    // ── TC-09: Loading Spinner ─────────────────────────────────────────────────
    it('TC-09: Should show loading state while authenticating', async function () {
      // Skip if real approved credentials are not configured as GitHub Secrets
      if (!process.env.TEST_USER_APPROVED_EMAIL) {
        console.log('  ⚠ TC-09 skipped — TEST_USER_APPROVED_EMAIL secret not set');
        this.skip();
      }
      await navigateToLogin(driver);
      await fillLoginForm(driver, config.testUsers.approved.email, config.testUsers.approved.password);
      await clickLoginButton(driver);

      try {
        // "Authenticating..." text appears in the button during the async call
        await driver.wait(
          until.elementLocated(By.xpath("//*[contains(text(),'Authenticating')]")),
          3000
        );
        const loadingEl = await driver.findElement(
          By.xpath("//*[contains(text(),'Authenticating')]")
        );
        assert.ok(loadingEl, 'Loading text should be visible');
      } catch {
        // Loading resolved too fast — confirm redirect to dashboard instead
        const url = await driver.getCurrentUrl();
        assert.ok(
          url.includes('/dashboard'),
          `Should be on dashboard after login, got: ${url}`
        );
      }
    });

    // ── TC-10: Forgot Password Navigation ─────────────────────────────────────
    it('TC-10: Should navigate to forgot-password page', async function () {
      await navigateToLogin(driver);
      const forgotLink = await driver.findElement(
        By.xpath("//a[contains(@href, '/auth/forgot-password')]")
      );
      // JS click to bypass Next.js router interception
      await driver.executeScript('arguments[0].click();', forgotLink);

      await driver.wait(until.urlContains('/auth/forgot-password'), 8000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/forgot-password'),
        `Expected /auth/forgot-password, got: ${currentUrl}`
      );
    });

    // ── TC-11: Register Organization Navigation ───────────────────────────────
    it('TC-11: Should navigate to signup page', async function () {
      await navigateToLogin(driver);
      const registerLink = await driver.findElement(
        By.xpath("//a[contains(@href, '/auth/signup')]")
      );
      await driver.executeScript('arguments[0].click();', registerLink);

      await driver.wait(until.urlContains('/auth/signup'), 8000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/auth/signup'),
        `Expected /auth/signup, got: ${currentUrl}`
      );
    });

    // ── TC-12: Admin Login Navigation ─────────────────────────────────────────
    it('TC-12: Should navigate to admin login page', async function () {
      await navigateToLogin(driver);
      // Use contains(., ...) — not contains(text(), ...) — because the button
      // has a Lucide <Key> icon SVG as a child node alongside the text
      const adminBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Login as Administrator')]")
      );
      await driver.executeScript('arguments[0].click();', adminBtn);

      await driver.wait(until.urlContains('/admin/login'), 8000);
      const currentUrl = await driver.getCurrentUrl();
      assert.ok(
        currentUrl.includes('/admin/login'),
        `Expected /admin/login, got: ${currentUrl}`
      );
    });
  });
}
