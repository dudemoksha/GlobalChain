/**
 * GlobalChain Web Dashboard — Data Upload E2E Tests
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

  describe('GlobalChain — Data Upload E2E Tests', function () {
    this.timeout(60000);
    let driver;

    before(async function () {
      if (!process.env.TEST_USER_APPROVED_EMAIL) {
        console.log('  ⚠ Data upload tests skipped — TEST_USER_APPROVED_EMAIL secret not set');
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

    it('TC-17: Should load Data Engine upload page', async function () {
      await driver.get(`${config.baseUrl}/data/upload`);
      await driver.wait(until.elementLocated(By.css('h2')), 15000);
      
      const title = await driver.findElement(By.css('h2'));
      const titleText = await title.getText();
      
      assert.ok(
        titleText.toUpperCase().includes('DATA ENGINE'),
        `Expected Data Engine title, got: "${titleText}"`
      );
    });

    it('TC-18: Should contain file upload dropzone', async function () {
      const dropzone = await driver.findElement(By.xpath("//*[contains(text(), 'Ingest Operational Graph') or contains(text(), 'Drag and drop')]"));
      assert.ok(dropzone, 'Upload dropzone should exist');
    });

    it('TC-19: Should contain infrastructure template download buttons', async function () {
      const supplierTemplateBtn = await driver.findElement(By.xpath("//button[.//p[contains(text(), 'Supplier Registry')]]"));
      const mappingTemplateBtn = await driver.findElement(By.xpath("//button[.//p[contains(text(), 'Dependency Graph')]]"));
      
      assert.ok(supplierTemplateBtn, 'Supplier Registry template button should exist');
      assert.ok(mappingTemplateBtn, 'Dependency Graph template button should exist');
    });
  });
}
