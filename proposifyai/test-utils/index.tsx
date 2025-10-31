import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render function that wraps components with necessary providers
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add any providers here (like theme, state management, etc.)
  const Wrapper = ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Create mock user for testing
 */
export function createMockUser(overrides = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
    },
    ...overrides,
  }
}

/**
 * Create mock proposal for testing
 */
export function createMockProposal(overrides = {}) {
  return {
    id: 'test-proposal-id',
    user_id: 'test-user-id',
    title: 'Test Proposal',
    content: '<p>Test content</p>',
    client_name: 'Test Client',
    client_email: 'client@example.com',
    status: 'draft',
    is_public: false,
    share_id: 'test-share-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create mock saved content for testing
 */
export function createMockSavedContent(overrides = {}) {
  return {
    id: 'test-content-id',
    user_id: 'test-user-id',
    title: 'Test Content',
    content: 'Test content text',
    category: 'company_info',
    tags: ['test'],
    is_favorite: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create mock formatting preferences for testing
 */
export function createMockFormattingPreferences(overrides = {}) {
  return {
    id: 'test-prefs-id',
    user_id: 'test-user-id',
    proposal_id: null,
    font_family: 'Arial',
    font_size: 12,
    line_spacing: 1.5,
    paragraph_spacing: 10,
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      text: '#1f2937',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Wait for async operations to complete
 */
export async function waitForLoadingToFinish() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * Mock fetch responses
 */
export function mockFetch(data: any, ok = true) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      status: ok ? 200 : 400,
      statusText: ok ? 'OK' : 'Bad Request',
    } as Response)
  )
}

/**
 * Mock Supabase query response
 */
export function mockSupabaseQuery(data: any, error: any = null) {
  return {
    data,
    error,
    count: data?.length || 0,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK',
  }
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override the default render with our custom render
export { customRender as render }
