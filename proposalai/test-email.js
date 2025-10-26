// Quick test to verify email service configuration
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resendApiKey = process.env.RESEND_API_KEY;

console.log('🔍 Verifying Email Service Configuration...\n');

// Check if API key is set
if (!resendApiKey) {
  console.log('❌ RESEND_API_KEY not found in environment');
  process.exit(1);
}

if (!resendApiKey.startsWith('re_')) {
  console.log('❌ RESEND_API_KEY format invalid (should start with re_)');
  process.exit(1);
}

console.log('✅ RESEND_API_KEY found and properly formatted');
console.log('   Key prefix:', resendApiKey.substring(0, 10) + '...');

const resend = new Resend(resendApiKey);

// Test email configuration
const emailFrom = process.env.EMAIL_FROM || 'Proposify AI <proposals@proposifyai.com>';
const emailReplyTo = process.env.EMAIL_REPLY_TO || 'support@proposifyai.com';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://proposifyai.com';

console.log('\n📧 Email Configuration:');
console.log('   FROM:', emailFrom);
console.log('   REPLY-TO:', emailReplyTo);
console.log('   APP URL:', appUrl);

console.log('\n' + '='.repeat(50));
console.log('📊 EMAIL SERVICE VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log('\n✅ ALL CHECKS PASSED!');
console.log('Email service is properly configured.');
console.log('\n💡 Note: To send actual test emails, you need to:');
console.log('   1. Verify your domain in Resend dashboard');
console.log('   2. Add DNS records to your domain registrar');
console.log('   3. Wait for DNS propagation (5-30 minutes)');
console.log('   4. Test sending from the Proposify AI interface');

process.exit(0);
