/**
 * GlobalChain Web Dashboard — Smoke Tests
 * =====================================================
 * This suite visits all 85+ pages in the application to ensure
 * they render without critical React/Next.js crashes.
 */

'use strict';

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');
const config = require('../config');

// List of all frontend routes derived from Next.js App Router
const routes = [
  '/',
  '/admin-portal',
  '/admin-portal/api',
  '/admin-portal/audit',
  '/admin-portal/database',
  '/admin-portal/disaster-feed',
  '/admin-portal/orgs',
  '/admin-portal/permissions',
  '/admin-portal/users',
  '/auth/forgot-password',
  '/auth/login',
  '/auth/signup',
  '/admin/audit',
  '/admin/system',
  '/analytics/cyber',
  '/analytics/demand',
  '/analytics/dependency',
  '/analytics/financial',
  '/analytics/forecast',
  '/analytics/geopolitical',
  '/analytics/health',
  '/analytics/inventory',
  '/analytics/logistics',
  '/analytics/manufacturing',
  '/analytics/matrix',
  '/analytics/predictive',
  '/analytics/recommendations',
  '/analytics/recovery',
  '/analytics/resilience',
  '/dashboard/executive',
  '/dashboard/global',
  '/dashboard/health',
  '/dashboard/operational',
  '/dashboard/profile',
  '/dashboard/realtime',
  '/dashboard/risk',
  '/data/csv',
  '/data/excel',
  '/data/mapping',
  '/data/status',
  '/data/templates',
  '/data/upload',
  '/data/validation',
  '/intelligence/alerts',
  '/intelligence/disaster',
  '/intelligence/disaster-feed',
  '/intelligence/models',
  '/intelligence/recommendations',
  '/intelligence/reports',
  '/intelligence/timeline',
  '/intelligence/weather',
  '/settings/general',
  '/settings/retention',
  '/simulations/center',
  '/simulations/cyber',
  '/simulations/disaster',
  '/simulations/earthquake',
  '/simulations/flood',
  '/simulations/history',
  '/simulations/logistics',
  '/simulations/port',
  '/simulations/traffic',
  '/simulations/war',
  '/suppliers/backup',
  '/suppliers/backups',
  '/suppliers/comparison',
  '/suppliers/contracts',
  '/suppliers/details',
  '/suppliers/health',
  '/suppliers/history',
  '/suppliers/list',
  '/suppliers/manage',
  '/suppliers/mapping',
  '/suppliers/search',
  '/suppliers/tier1',
  '/suppliers/tier2',
  '/suppliers/tier3',
  '/visualization/density',
  '/visualization/disasters',
  '/visualization/globe',
  '/visualization/heatmaps',
  '/visualization/shipping',
  '/visualization/traffic',
  '/admin/login',
  '/welcome'
];

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
    const fs = require('fs');
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

    // On Windows use local chromedriver.exe; on Linux/CI use system chromedriver
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

  describe('GlobalChain — Full Application Smoke Test', function () {
    this.timeout(600000); // 10 minutes total for all routes

    let driver;

    before(async function () {
      if (!process.env.TEST_USER_APPROVED_EMAIL) {
        console.log('  ⚠ Smoke tests skipped — TEST_USER_APPROVED_EMAIL secret not set');
        this.skip();
      }

      driver = await getDriver();
      
      // Step 1: Login so we have an active session for protected routes
      await driver.get(`${config.baseUrl}/auth/login`);
      await driver.wait(until.elementLocated(By.css('form')), 10000);
      
      const emailInput = await driver.findElement(By.css('input[type="email"]'));
      const passwordInput = await driver.findElement(By.css('input[type="password"]'));
      await emailInput.sendKeys(config.testUsers.approved.email);
      await passwordInput.sendKeys(config.testUsers.approved.password);
      
      const loginBtn = await driver.findElement(By.css('button[type="submit"]'));
      await driver.executeScript("arguments[0].click();", loginBtn);

      // Wait to be on the dashboard
      await driver.wait(until.urlContains('/dashboard'), 15000);
    });

    after(async function () {
      if (driver) await driver.quit();
    });

    // Test every single route dynamically
    for (const route of routes) {
      it(`Should load ${route} without crashing`, async function () {
        await driver.get(`${config.baseUrl}${route}`);
        
        // Wait a small moment to allow client-side hydration
        await driver.sleep(1000);
        
        // Check 1: Did we hit a Next.js 404 page?
        const pageSource = await driver.getPageSource();
        const is404 = pageSource.includes('This page could not be found');
        assert.ok(!is404, `Route ${route} returned a 404 Not Found error.`);
        
        // Check 2: Did we hit a React runtime crash / Error boundary?
        // Usually Next.js overlays have an id like `nextjs-portal` or show "Application error"
        const isAppError = pageSource.includes('Application error: a client-side exception has occurred');
        assert.ok(!isAppError, `Route ${route} triggered a React application error (crash).`);
      });
    }
  });
}
