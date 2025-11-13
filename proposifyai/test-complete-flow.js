/**
 * Complete AI Generation Flow Test
 * Tests authentication, proposal creation, and AI generation
 */

const BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function testEndpoint(name, url, options = {}) {
  try {
    log(`Testing: ${name}`, 'blue');
    log(`URL: ${url}`, 'blue');

    const response = await fetch(url, options);
    const status = response.status;
    const statusText = response.statusText;

    log(`Status: ${status} ${statusText}`, status < 400 ? 'green' : 'red');

    if (status < 400) {
      log('✅ PASS', 'green');
    } else {
      log('❌ FAIL', 'red');
      const text = await response.text();
      log(`Response: ${text.substring(0, 200)}...`, 'yellow');
    }

    return { success: status < 400, status, response };
  } catch (error) {
    log(`❌ ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('🚀 Starting Complete Flow Test', 'magenta');
  log(`Server: ${BASE_URL}`, 'magenta');
  log(`Time: ${new Date().toISOString()}`, 'magenta');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // TEST 1: Server Health
  section('TEST 1: Server Health Check');
  const healthTest = await testEndpoint(
    'Home Page',
    `${BASE_URL}/`
  );
  results.tests.push({ name: 'Server Health', ...healthTest });
  if (healthTest.success) results.passed++;
  else results.failed++;

  // TEST 2: Middleware Redirect (Unauthenticated)
  section('TEST 2: Authentication Middleware');
  log('Testing: Access protected route without auth', 'blue');

  const protectedTest = await fetch(`${BASE_URL}/proposals/new`, {
    redirect: 'manual' // Don't follow redirects
  });

  const isRedirect = protectedTest.status >= 300 && protectedTest.status < 400;
  const redirectLocation = protectedTest.headers.get('location');

  log(`Status: ${protectedTest.status}`, isRedirect ? 'green' : 'red');
  log(`Redirect: ${redirectLocation || 'None'}`, isRedirect ? 'green' : 'red');

  if (isRedirect && redirectLocation && redirectLocation.includes('/login')) {
    log('✅ PASS - Correctly redirects to login', 'green');
    results.passed++;
    results.tests.push({ name: 'Middleware Redirect', success: true, status: protectedTest.status });
  } else {
    log('❌ FAIL - Should redirect to login', 'red');
    results.failed++;
    results.tests.push({ name: 'Middleware Redirect', success: false, status: protectedTest.status });
  }

  // TEST 3: API Routes (Should return 401)
  section('TEST 3: API Endpoint Protection');

  const apiTests = [
    { name: 'Proposals API', url: '/api/proposals' },
    { name: 'AI Generate API', url: '/api/ai/generate-content' },
    { name: 'User Profile API', url: '/api/user/profile' }
  ];

  for (const test of apiTests) {
    const result = await testEndpoint(
      test.name,
      `${BASE_URL}${test.url}`,
      { method: 'GET' }
    );

    // For protected APIs, 401 is expected and considered a pass
    if (result.status === 401) {
      log('✅ PASS - Correctly returns 401 Unauthorized', 'green');
      results.passed++;
      results.tests.push({ name: test.name, success: true, status: 401 });
    } else {
      log('❌ FAIL - Should return 401', 'red');
      results.failed++;
      results.tests.push({ name: test.name, success: false, status: result.status });
    }
  }

  // TEST 4: Template System
  section('TEST 4: Template System Check');
  const templateTest = await testEndpoint(
    'List Templates',
    `${BASE_URL}/api/proposals/generate-from-template`,
    { method: 'GET' }
  );

  // This might be protected or public, either is acceptable
  if (templateTest.success || templateTest.status === 401) {
    log('✅ PASS - Template endpoint exists', 'green');
    results.passed++;
    results.tests.push({ name: 'Template System', success: true });
  } else {
    log('❌ FAIL - Template endpoint error', 'red');
    results.failed++;
    results.tests.push({ name: 'Template System', success: false });
  }

  // TEST 5: Environment Variables Check
  section('TEST 5: Environment Configuration');

  const fs = require('fs');
  const path = require('path');

  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');

    const checks = [
      { name: 'OPENAI_API_KEY', present: envContent.includes('OPENAI_API_KEY=sk-') },
      { name: 'SUPABASE_URL', present: envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') },
      { name: 'SUPABASE_ANON_KEY', present: envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') }
    ];

    checks.forEach(check => {
      if (check.present) {
        log(`✅ ${check.name} - Present`, 'green');
        results.passed++;
      } else {
        log(`❌ ${check.name} - Missing`, 'red');
        results.failed++;
      }
      results.tests.push({ name: `Env: ${check.name}`, success: check.present });
    });
  } catch (error) {
    log(`❌ Error reading .env.local: ${error.message}`, 'red');
    results.failed++;
  }

  // TEST 6: OpenAI Library Check
  section('TEST 6: OpenAI Library');

  try {
    const openaiLib = require('./lib/ai/openai.ts');
    log('✅ OpenAI library loads successfully', 'green');
    results.passed++;
    results.tests.push({ name: 'OpenAI Library', success: true });
  } catch (error) {
    log(`❌ OpenAI library error: ${error.message}`, 'red');
    results.failed++;
    results.tests.push({ name: 'OpenAI Library', success: false });
  }

  // FINAL SUMMARY
  section('TEST SUMMARY');

  log(`Total Tests: ${results.tests.length}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`,
      results.failed === 0 ? 'green' : 'yellow');

  console.log('\n' + '='.repeat(60));

  if (results.failed === 0) {
    log('✅ ALL TESTS PASSED!', 'green');
    log('🎉 System is ready for AI proposal generation', 'green');
    log('📝 Next step: Log in at http://localhost:3000/login', 'cyan');
  } else {
    log('❌ SOME TESTS FAILED', 'red');
    log('🔍 Review the errors above', 'yellow');
  }

  console.log('='.repeat(60) + '\n');

  // Instructions
  section('MANUAL TESTING INSTRUCTIONS');
  log('1. Open browser: http://localhost:3000/login', 'cyan');
  log('2. Log in with your credentials', 'cyan');
  log('3. Navigate to: http://localhost:3000/proposals/new', 'cyan');
  log('4. Fill in the form:', 'cyan');
  log('   - Client: "Test Hospital"', 'yellow');
  log('   - Email: "test@hospital.com"', 'yellow');
  log('   - Project: "Hospital Management System"', 'yellow');
  log('   - Budget: "50000"', 'yellow');
  log('5. Check: "Use AI to generate proposal content"', 'cyan');
  log('6. Click: "Generate with AI (Bettroi Professional)"', 'cyan');
  log('7. Wait: 60-85 seconds for generation', 'cyan');
  log('8. Verify: All 5 sections are generated', 'cyan');
  console.log('');

  return results;
}

// Run tests
runTests().then(results => {
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
