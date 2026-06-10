/**
 * GlobalChain Web Dashboard — Admin Portal E2E Tests
 */

'use strict';

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const config = require('../config');

if (require.main === module) {
  const Mocha = require('mocha');
  const mocha = new Mocha({ timeout: 60000, reporter: 'spec' });
  delete require.cache[require.resolve(__filename)];
  mocha.addFile(__filename);
  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
} else {
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
      '--remote-allow-origins=*',
      '--window-size=1366,768'
    );

    const localDriver = path.resolve(__dirname, '../chromedriver.exe');
    const isWindows = process.platform === 'win32';
    const builder = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options);

    if (isWindows && fs.existsSync(localDriver)) {
      builder.setChromeService(new chrome.ServiceBuilder(localDriver));
    }

    return builder.build();
  }

  describe('GlobalChain — Admin Portal E2E Tests', function () {
    this.timeout(60000);
    let driver;

    before(async function () {
      if (!process.env.TEST_USER_APPROVED_EMAIL) {
        console.log('  ⚠ Admin tests skipped — TEST_USER_APPROVED_EMAIL secret not set');
        this.skip();
      }

      driver = await getDriver();
      
      // Login first
      await driver.get(`${config.baseUrl}/auth/login`);
      await driver.wait(until.elementLocated(By.css('form')), 15000);
      await driver.wait(until.elementLocated(By.css('input[type="email"]')), 15000);
      
      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      await emailInput.sendKeys(config.testUsers.approved.email);
      await passwordInput.sendKeys(config.testUsers.approved.password);
      
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await submitBtn.click();
      
      // Wait for redirect to dashboard
      await driver.wait(until.urlContains('/dashboard/executive'), 15000);
    });

    after(async function () {
      if (driver) await driver.quit();
    });

    it('TC-20: Should load System Integrity Dashboard', async function () {
      await driver.get(`${config.baseUrl}/admin-portal`);
      await driver.wait(until.elementLocated(By.css('h2')), 15000);
      
      const title = await driver.findElement(By.css('h2'));
      const titleText = await title.getText();
      
      assert.ok(
        titleText.toUpperCase().includes('SYSTEM_INTEGRITY_DASHBOARD'),
        `Expected System Integrity Dashboard title, got: "${titleText}"`
      );
    });

    it('TC-21: Should contain Clear Terminal button', async function () {
      const clearBtn = await driver.findElement(By.xpath("//button[contains(., 'Clear Terminal')]"));
      assert.ok(clearBtn, 'Clear Terminal button should exist');
    });

    it('TC-22: Should contain Export Log Audit button', async function () {
      const exportBtn = await driver.findElement(By.xpath("//button[contains(., 'Export Log Audit')]"));
      assert.ok(exportBtn, 'Export Log Audit button should exist');
    });
  });
}
