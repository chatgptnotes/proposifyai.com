#!/usr/bin/env node

/**
 * Resend DNS Configuration Checker
 * Checks if DNS records for Resend email service are properly configured
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const DOMAIN = 'proposifyai.com';
const CHECKS = [
  {
    name: 'DKIM Record',
    record: `resend._domainkey.${DOMAIN}`,
    type: 'TXT',
    expected: 'v=DKIM1',
    description: 'Domain Keys for email authentication',
  },
  {
    name: 'DMARC Record',
    record: `_dmarc.${DOMAIN}`,
    type: 'TXT',
    expected: 'v=DMARC1',
    description: 'Email authentication, reporting, and conformance',
  },
  {
    name: 'SPF Record',
    record: DOMAIN,
    type: 'TXT',
    expected: 'v=spf1',
    description: 'Sender Policy Framework (optional but recommended)',
  },
];

async function checkDNS(record, type) {
  try {
    const { stdout, stderr } = await execPromise(`dig ${type} ${record} +short`);
    if (stderr) {
      return { error: stderr };
    }
    return { result: stdout.trim() };
  } catch (error) {
    return { error: error.message };
  }
}

function printHeader() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║       Resend DNS Configuration Checker for Proposify AI       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log(`Domain: ${DOMAIN}`);
  console.log(`Date: ${new Date().toLocaleString()}\n`);
  console.log('─'.repeat(70) + '\n');
}

function printResult(check, result) {
  const icon = result.configured ? '✅' : '❌';
  const status = result.configured ? 'CONFIGURED' : 'NOT CONFIGURED';
  const statusColor = result.configured ? '\x1b[32m' : '\x1b[31m';
  const resetColor = '\x1b[0m';

  console.log(`${icon} ${check.name}`);
  console.log(`   Record: ${check.record}`);
  console.log(`   Status: ${statusColor}${status}${resetColor}`);
  console.log(`   Description: ${check.description}`);

  if (result.configured) {
    console.log(`   Value: ${result.value}`);
  } else {
    console.log(`   Issue: ${result.message}`);
  }

  console.log();
}

function printSummary(results) {
  console.log('─'.repeat(70));
  console.log('\n📊 SUMMARY\n');

  const configured = results.filter((r) => r.configured).length;
  const total = results.length;
  const percentage = Math.round((configured / total) * 100);

  console.log(`Configured: ${configured}/${total} (${percentage}%)\n`);

  if (configured === total) {
    console.log('🎉 SUCCESS! All DNS records are properly configured!');
    console.log('\nNext steps:');
    console.log('1. Verify domain in Resend dashboard (https://resend.com/domains)');
    console.log('2. Send a test email');
    console.log('3. Check that email arrives in inbox (not spam)');
  } else if (configured === 0) {
    console.log('⚠️  WARNING! No DNS records found.');
    console.log('\nNext steps:');
    console.log('1. Read RESEND_DNS_SETUP.md for detailed instructions');
    console.log('2. Log into Resend dashboard (https://resend.com/domains)');
    console.log('3. Copy the exact DNS record values');
    console.log('4. Add them to your domain registrar');
    console.log('5. Wait 15-30 minutes for DNS propagation');
    console.log('6. Run this script again');
  } else {
    console.log('⚠️  PARTIAL! Some records configured, some missing.');
    console.log('\nNext steps:');
    console.log('1. Add the missing DNS records');
    console.log('2. Wait 15-30 minutes for DNS propagation');
    console.log('3. Run this script again');
  }

  console.log('\n📚 For detailed setup instructions, see: RESEND_DNS_SETUP.md');
  console.log('🔍 Online DNS checker: https://dnschecker.org');
  console.log('📧 Resend dashboard: https://resend.com/domains\n');
}

function printHelp() {
  console.log('\n📚 HELP & RESOURCES\n');
  console.log('If DNS records are not showing up:');
  console.log('');
  console.log('1. Check DNS propagation status:');
  console.log('   https://dnschecker.org');
  console.log('   Enter: resend._domainkey.proposifyai.com');
  console.log('');
  console.log('2. Verify you added records correctly:');
  console.log('   - Record names must be exact (resend._domainkey, _dmarc)');
  console.log('   - Values must be copied exactly from Resend dashboard');
  console.log('   - No extra spaces or line breaks');
  console.log('');
  console.log('3. Common DNS propagation times:');
  console.log('   - Vercel DNS: 5-15 minutes');
  console.log('   - Cloudflare: 5-10 minutes');
  console.log('   - GoDaddy: 1-24 hours');
  console.log('   - Namecheap: 30 minutes - 48 hours');
  console.log('');
  console.log('4. Get exact record values:');
  console.log('   Log into https://resend.com/domains');
  console.log('   Click on proposifyai.com');
  console.log('   Copy the exact TXT record values shown');
  console.log('');
  console.log('5. Test individual records:');
  console.log('   dig TXT resend._domainkey.proposifyai.com +short');
  console.log('   dig TXT _dmarc.proposifyai.com +short');
  console.log('   dig TXT proposifyai.com +short | grep spf');
  console.log('');
}

async function main() {
  printHeader();

  console.log('🔍 Checking DNS records...\n');

  const results = [];

  for (const check of CHECKS) {
    const dnsResult = await checkDNS(check.record, check.type);

    let result = {
      check: check.name,
      configured: false,
      value: null,
      message: null,
    };

    if (dnsResult.error) {
      result.message = `DNS query error: ${dnsResult.error}`;
    } else if (!dnsResult.result || dnsResult.result.length === 0) {
      result.message = 'No DNS record found';
    } else {
      const value = dnsResult.result;
      if (value.includes(check.expected)) {
        result.configured = true;
        result.value = value.substring(0, 80) + (value.length > 80 ? '...' : '');
      } else if (check.name === 'SPF Record') {
        // SPF might exist but not include Resend
        result.message = 'SPF record exists but does not include Resend (_spf.resend.com)';
      } else {
        result.message = `Record exists but doesn't match expected format (${check.expected})`;
      }
    }

    results.push(result);
    printResult(check, result);
  }

  printSummary(results);
  printHelp();

  console.log('─'.repeat(70) + '\n');

  // Exit code based on results
  const allConfigured = results.every((r) => r.configured);
  process.exit(allConfigured ? 0 : 1);
}

// Run the checker
main().catch((error) => {
  console.error('\n❌ Error running DNS checker:', error.message);
  console.log('\nPlease ensure you have internet connection and dig command available.');
  console.log('On macOS, dig should be pre-installed.');
  console.log('On Linux, install dnsutils: sudo apt-get install dnsutils');
  process.exit(1);
});
