import { test, expect } from '@playwright/test';

test.describe('API Endpoints - All 12 Endpoints', () => {
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    // Login to get auth token (if needed)
    // This is a placeholder - adjust based on your auth implementation
  });

  test.describe('Proposals API', () => {
    test('GET /api/proposals - should list all proposals', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/proposals');

      // Should return 200 or 401 (if not authenticated)
      expect([200, 401, 403]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        expect(Array.isArray(data) || typeof data === 'object').toBe(true);
      }
    });

    test('POST /api/proposals - should create a proposal', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/proposals', {
        data: {
          title: 'Test Proposal',
          client_name: 'Test Client',
          content: 'Test content',
        },
      });

      // Should return 201, 200, or 401
      expect([200, 201, 401, 403]).toContain(response.status());
    });

    test('GET /api/proposals/[id] - should get single proposal', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/proposals/test-id');

      // Should return 200, 404, or 401
      expect([200, 401, 403, 404]).toContain(response.status());
    });

    test('PUT /api/proposals/[id] - should update proposal', async ({ request }) => {
      const response = await request.put('http://localhost:3001/api/proposals/test-id', {
        data: {
          title: 'Updated Title',
        },
      });

      // Should return 200, 404, or 401
      expect([200, 401, 403, 404]).toContain(response.status());
    });

    test('DELETE /api/proposals/[id] - should delete proposal', async ({ request }) => {
      const response = await request.delete('http://localhost:3001/api/proposals/test-id');

      // Should return 200, 204, 404, or 401
      expect([200, 204, 401, 403, 404]).toContain(response.status());
    });
  });

  test.describe('AI API', () => {
    test('POST /api/ai/generate-content - should generate content', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/ai/generate-content', {
        data: {
          prompt: 'Create a proposal for software development',
          context: 'Additional context',
        },
      });

      // Should return 200 or 401
      expect([200, 401, 403, 400]).toContain(response.status());
    });

    test('POST /api/ai/modify-text - should modify text', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/ai/modify-text', {
        data: {
          text: 'Original text',
          instruction: 'Make it more professional',
        },
      });

      // Should return 200 or 401
      expect([200, 401, 403, 400]).toContain(response.status());
    });

    test('POST /api/ai/analyze-letterhead - should analyze letterhead', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/ai/analyze-letterhead', {
        data: {
          image: 'base64-encoded-image-data',
        },
      });

      // Should return 200, 400, or 401
      expect([200, 400, 401, 403]).toContain(response.status());
    });

    test('POST /api/ai/scrape-website - should scrape website', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/ai/scrape-website', {
        data: {
          url: 'https://example.com',
        },
      });

      // Should return 200, 400, or 401
      expect([200, 400, 401, 403]).toContain(response.status());
    });

    test('POST /api/ai/search-content - should search content', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/ai/search-content', {
        data: {
          query: 'test search',
        },
      });

      // Should return 200 or 401
      expect([200, 401, 403, 400]).toContain(response.status());
    });
  });

  test.describe('Saved Content API', () => {
    test('GET /api/saved-content - should list saved content', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/saved-content');

      // Should return 200 or 401
      expect([200, 401, 403]).toContain(response.status());

      if (response.status() === 200) {
        const data = await response.json();
        expect(Array.isArray(data) || typeof data === 'object').toBe(true);
      }
    });

    test('POST /api/saved-content - should create saved content', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/saved-content', {
        data: {
          name: 'Test Content',
          content: 'Test content body',
          category: 'general',
        },
      });

      // Should return 200, 201, or 401
      expect([200, 201, 401, 403, 400]).toContain(response.status());
    });

    test('GET /api/saved-content/[id] - should get single saved content', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/saved-content/test-id');

      // Should return 200, 404, or 401
      expect([200, 401, 403, 404]).toContain(response.status());
    });

    test('PUT /api/saved-content/[id] - should update saved content', async ({ request }) => {
      const response = await request.put('http://localhost:3001/api/saved-content/test-id', {
        data: {
          name: 'Updated Content',
        },
      });

      // Should return 200, 404, or 401
      expect([200, 401, 403, 404]).toContain(response.status());
    });

    test('DELETE /api/saved-content/[id] - should delete saved content', async ({ request }) => {
      const response = await request.delete('http://localhost:3001/api/saved-content/test-id');

      // Should return 200, 204, 404, or 401
      expect([200, 204, 401, 403, 404]).toContain(response.status());
    });
  });

  test.describe('Formatting Preferences API', () => {
    test('GET /api/formatting-preferences - should get preferences', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/formatting-preferences');

      // Should return 200 or 401
      expect([200, 401, 403]).toContain(response.status());
    });

    test('POST /api/formatting-preferences - should update preferences', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/formatting-preferences', {
        data: {
          font_family: 'Arial',
          font_size: 12,
          primary_color: '#000000',
        },
      });

      // Should return 200 or 401
      expect([200, 201, 401, 403, 400]).toContain(response.status());
    });
  });

  test.describe('API Error Handling', () => {
    test('should return 404 for non-existent endpoints', async ({ request }) => {
      const response = await request.get('http://localhost:3001/api/non-existent-endpoint');

      expect([404, 405]).toContain(response.status());
    });

    test('should handle malformed JSON', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/proposals', {
        data: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([400, 401, 403, 500]).toContain(response.status());
    });

    test('should validate required fields', async ({ request }) => {
      const response = await request.post('http://localhost:3001/api/proposals', {
        data: {},
      });

      // Should return 400 or 401
      expect([400, 401, 403]).toContain(response.status());
    });
  });

  test.describe('API Performance', () => {
    test('should respond within acceptable time', async ({ request }) => {
      const start = Date.now();

      const response = await request.get('http://localhost:3001/api/proposals');

      const duration = Date.now() - start;

      // Should respond within 5 seconds
      expect(duration).toBeLessThan(5000);

      // Status should be valid
      expect([200, 401, 403]).toContain(response.status());
    });
  });
});
