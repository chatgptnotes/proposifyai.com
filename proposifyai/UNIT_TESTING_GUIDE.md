# Unit Testing Guide - Proposify AI

## Overview

This guide provides comprehensive documentation for unit and integration testing in Proposify AI using Jest and React Testing Library.

## Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
__tests__/
├── components/          # Component tests
├── lib/                 # Utility tests
└── setup/              # Test configuration

test-utils/             # Shared test utilities
```

## Running Tests

```bash
# All tests
npm test

# Specific test
npm test SkipLinks

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

## Writing Component Tests

### Example: Button Component

```tsx
import { render, screen } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import Button from '@/components/Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Test Utilities

### Mock Data Generators

```tsx
import {
  createMockUser,
  createMockProposal,
  createMockSavedContent,
} from '@/test-utils'

const user = createMockUser({ email: 'test@example.com' })
const proposal = createMockProposal({ title: 'Test Proposal' })
```

### Fetch Mocking

```tsx
import { mockFetch } from '@/test-utils'

mockFetch({ data: [] }, true)  // Success
mockFetch({ error: 'Failed' }, false)  // Error
```

## Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Keep tests independent**
4. **Use descriptive test names**
5. **Handle async operations properly**

## Coverage

Target: 50%+ coverage for all files

```bash
npm run test:coverage
```

View report:
```bash
open coverage/lcov-report/index.html
```

## Current Test Suite

### Component Tests (2 suites, 16 tests)
- ✅ SkipLinks: 5 tests
- ✅ VisuallyHidden: 8 tests

### Utility Tests (1 suite, 22 tests)
- ✅ Accessibility helpers: 22 tests

**Total:** 3 test suites, 38 tests passing

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Version History

- **v1.0.0** (2025-10-26): Initial testing setup
  - Jest and React Testing Library configured
  - Test utilities created
  - Component and utility tests implemented
  - Coverage reporting enabled
