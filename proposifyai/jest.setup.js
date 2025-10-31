// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
            data: [],
            error: null,
          })),
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
    })),
  }),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.OPENAI_API_KEY = 'test-openai-key'

// Global test utilities
global.console = {
  ...console,
  // Suppress console errors in tests unless explicitly needed
  error: jest.fn(),
  warn: jest.fn(),
}
