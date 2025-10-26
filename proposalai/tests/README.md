# ProposifyAI v2.5.0 - Test Suite

This directory contains comprehensive end-to-end tests for ProposifyAI using Playwright.

## Test Structure

```
tests/
├── 01-keyboard-shortcuts.spec.ts    # Keyboard shortcuts modal tests
├── 02-loading-skeleton.spec.ts      # Loading skeleton tests
├── 03-proposal-count-badge.spec.ts  # Proposal count badge tests
├── 04-breadcrumb-navigation.spec.ts # Breadcrumb navigation tests
├── 05-progress-indicator.spec.ts    # Progress indicator tests
├── 06-export-to-word.spec.ts        # Export to Word tests
├── 10-dashboard.spec.ts             # Dashboard tests
├── 11-proposals-list.spec.ts        # Proposals list tests
├── 12-proposal-editor.spec.ts       # Proposal editor tests
├── 13-settings.spec.ts              # Settings page tests
├── 20-api-endpoints.spec.ts         # API endpoint tests
└── helpers/
    └── auth.ts                      # Authentication helpers
```

## Running Tests

### Prerequisites

1. Ensure the development server is running on port 3001:
   ```bash
   npm run dev -- -p 3001
   ```

2. Ensure you have test credentials set up in your Supabase instance:
   - Email: test@example.com
   - Password: testpassword123

### Run All Tests

```bash
npm test
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Specific Test File

```bash
npx playwright test tests/01-keyboard-shortcuts.spec.ts
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### View Test Report

```bash
npm run test:report
```

## Test Coverage

### New Features (v2.5.0)

1. **Keyboard Shortcuts Modal**
   - Modal opens with '?' key
   - Modal closes with 'Esc'
   - All shortcuts listed correctly
   - Doesn't trigger in input fields
   - Closes when clicking outside

2. **Loading Skeleton**
   - Displays on page load
   - Animates properly
   - Transitions to real content
   - Shows correct number of cards

3. **Proposal Count Badge**
   - Shows correct count
   - Only displays when count > 0
   - Updates when proposals added/deleted
   - Visible across all pages

4. **Breadcrumb Navigation**
   - Displays on all pages
   - Shows correct hierarchy
   - Clickable links work
   - Current page non-clickable

5. **Progress Indicator**
   - Shows 3 steps
   - Displays progress bar
   - Shows animations
   - Checkmarks on completed steps
   - Allows navigation between steps

6. **Export to Word**
   - Button displays on proposal detail
   - Triggers download correctly
   - Correct file name
   - Loading state during export
   - Exports complete content

### Existing Features (v2.4.x)

1. **Dashboard**
   - Loads successfully
   - Glassmorphism design
   - Recent proposals
   - Statistics/metrics
   - Quick actions
   - Responsive design

2. **Proposals List**
   - Loads proposals
   - Search functionality
   - Sort functionality
   - Favorites
   - Navigation to detail
   - Filter by status
   - Pagination
   - Empty state

3. **Proposal Editor**
   - Editor loads
   - Text editing
   - AI generation
   - Text selection and AI modification
   - Auto-save
   - PDF preview
   - Logo upload
   - Color customization
   - A4 proportions
   - Additional context field
   - Keyboard shortcuts

4. **Settings**
   - Page loads
   - Profile information
   - Profile updates
   - Company settings
   - Formatting preferences
   - Saved content library
   - Password change
   - Subscription information
   - Theme settings
   - Form validation

### API Endpoints

1. **Proposals API**
   - GET /api/proposals
   - POST /api/proposals
   - GET /api/proposals/[id]
   - PUT /api/proposals/[id]
   - DELETE /api/proposals/[id]

2. **AI API**
   - POST /api/ai/generate-content
   - POST /api/ai/modify-text
   - POST /api/ai/analyze-letterhead
   - POST /api/ai/scrape-website
   - POST /api/ai/search-content

3. **Saved Content API**
   - GET /api/saved-content
   - POST /api/saved-content
   - GET /api/saved-content/[id]
   - PUT /api/saved-content/[id]
   - DELETE /api/saved-content/[id]

4. **Formatting Preferences API**
   - GET /api/formatting-preferences
   - POST /api/formatting-preferences

## Environment Variables

Set these in `.env.local` for testing:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
```

## Test Strategies

- **Defensive Testing**: Tests check if elements exist before interacting
- **Graceful Degradation**: Tests pass even if features are not yet implemented
- **Real-World Scenarios**: Tests mimic actual user workflows
- **Cross-Browser**: Configured for Chromium (can add Firefox, WebKit)

## Debugging Tests

### Run with Debug Mode

```bash
npx playwright test --debug
```

### Generate Trace

```bash
npx playwright test --trace on
```

### View Traces

```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

Tests are configured to run in CI environments. The `playwright.config.ts` automatically:
- Uses 1 worker in CI
- Retries failed tests 2 times
- Generates HTML and JSON reports

## Performance Benchmarks

- API endpoints should respond within 5 seconds
- Page loads should complete within 10 seconds
- No test should take longer than 30 seconds

## Known Issues / Limitations

- Tests require a running Supabase instance
- Some tests may fail if test user doesn't have existing proposals
- Word export test requires browser download permissions
- AI features may timeout if API keys are not configured

## Contributing

When adding new tests:
1. Follow the existing naming convention
2. Use the auth helper for login
3. Add defensive checks (if element exists)
4. Document the feature being tested
5. Update this README
