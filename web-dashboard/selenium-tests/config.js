/**
 * GlobalChain Selenium Test Configuration
 * ----------------------------------------
 * Update testUsers with real Supabase seeded credentials
 * before running tests against a live or staging environment.
 */

// Auto-load .env file if present
require('dotenv').config();

module.exports = {
  // Base URL of the running Next.js app
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',

  // Browser to use: 'chrome' | 'firefox' | 'edge'
  browser: process.env.TEST_BROWSER || 'chrome',

  // Implicit wait timeout (ms)
  implicitWait: 5000,

  // Test user credentials (seeded in Supabase 'organizations' table)
  testUsers: {
    approved: {
      email: process.env.TEST_USER_APPROVED_EMAIL || 'approved@testorg.com',
      password: process.env.TEST_USER_APPROVED_PASS || 'Test@1234',
    },
    pending: {
      email: process.env.TEST_USER_PENDING_EMAIL || 'pending@testorg.com',
      password: process.env.TEST_USER_PENDING_PASS || 'Test@1234',
    },
    suspended: {
      email: process.env.TEST_USER_SUSPENDED_EMAIL || 'suspended@testorg.com',
      password: process.env.TEST_USER_SUSPENDED_PASS || 'Test@1234',
    },
    rejected: {
      email: process.env.TEST_USER_REJECTED_EMAIL || 'rejected@testorg.com',
      password: process.env.TEST_USER_REJECTED_PASS || 'Test@1234',
    },
  },
};
