# GlobalChain — Selenium E2E Tests

End-to-end browser tests for the **GlobalChain Web Dashboard** using Selenium WebDriver + Mocha.

---

## 📁 Folder Structure

```
selenium-tests/
├── tests/
│   └── login.test.js     # Login page E2E tests (12 test cases)
├── config.js             # Browser & test user configuration
├── package.json          # Dependencies & npm scripts
├── .env.example          # Environment variable template
└── README.md             # This file
```

---

## ⚙️ Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 18.x |
| Google Chrome | Latest stable |
| ChromeDriver | Auto-matched via `chromedriver` npm package |

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
cd web-dashboard/selenium-tests
npm install
```

### 2. Configure environment
```bash
copy .env.example .env
# Edit .env with your Supabase test credentials
```

### 3. Make sure the app is running
```bash
# In the web-dashboard folder:
npm run dev
# App will be at http://localhost:3000
```

### 4. Run tests
```bash
# Run all tests
npm test

# Run only login tests
npm run test:login

# Run in headless mode (no browser window)
npm run test:headless
```

---

## 🧪 Test Cases — login.test.js

| Test | Description |
|---|---|
| TC-01 | Page loads with all required UI elements |
| TC-02 | Prevents submission with empty fields |
| TC-03 | Browser validates invalid email format |
| TC-04 | Shows error for unknown organization email |
| TC-05 | Shows "pending approval" error |
| TC-06 | Shows "access suspended" error |
| TC-07 | Shows "rejected" error |
| TC-08 | Redirects to `/dashboard/executive` on success |
| TC-09 | Shows loading spinner during authentication |
| TC-10 | Navigates to `/auth/forgot-password` |
| TC-11 | Navigates to `/auth/signup` |
| TC-12 | Navigates to `/admin/login` |

---

## 🗄️ Seeding Test Users in Supabase

Insert these rows into the `organizations` table before running tests:

```sql
INSERT INTO organizations (email, status) VALUES
  ('approved@testorg.com',  'Approved'),
  ('pending@testorg.com',   'Pending'),
  ('suspended@testorg.com', 'Suspended'),
  ('rejected@testorg.com',  'Rejected');
```

---

## 📌 Notes

- Tests use **Mocha** as the test runner with a 30s timeout per test.
- The `config.js` reads from environment variables, falling back to defaults.
- All selectors are based on the actual GlobalChain login page structure.
