#!/usr/bin/env node

/**
 * Generate Pre-Configured URL for AI-Integrated Kitchen Management System Proposal
 * Based on SDLC Corp proposal document
 */

const baseUrl = "http://localhost:3000/proposals/new";

const proposalData = {
  template: "2", // Bettroi Integration Proposal
  title: "AI-Integrated Kitchen Management System",
  client: "Your Client Company Name", // User should update this
  email: "client@example.com", // User should update this
  website: "", // Optional - user can add
  value: "70000",
  context: `The client requires a comprehensive, modular AI-integrated kitchen management system to optimize restaurant and food service operations.

PROJECT OVERVIEW:
- Total Budget: $70,000 USD
- Duration: 6 months (12 two-week sprints across 3 phases)
- Team Size: 7 FTE (1 Project Manager, 1 UI/UX Designer, 3 Full Stack Developers, 1 DevOps Specialist, 1 QA Specialist)
- Methodology: Agile with continuous integration and deployment

CORE SYSTEM FEATURES (Phase 1 - Sprints 1-4):
✓ Client Order Management - Custom recipe creation, order processing, order history and reporting
✓ Inventory Management - AI-powered stock tracking with image recognition, automatic reordering, expiry tracking, real-time stock levels
✓ Recipe Costing & Batch Management - Real-time ingredient cost tracking, batch tracking, cost vs profit alerts
✓ Supplier Price Monitoring - Smart supplier selection, automatic purchase orders, supplier performance tracking
✓ Production Planning & Scheduling - Automated task assignment, production forecasting, resource allocation
✓ Profitability Analysis - Real-time cost monitoring, profitability dashboard, cost alerts

MODULE DEVELOPMENT (Phase 2 - Sprints 5-8):
✓ Recipe Optimization & Cost Efficiency - AI-powered recipe standardization, dynamic ingredient substitution, yield tracking, waste reduction
✓ Label Making & Nutritional Fact Generation - Integration with FatSecret API, auto-generated compliant food labels, nutritional facts calculation, barcode & QR code generation
✓ Smart Procurement & Supplier Cost Optimization - Live supplier price tracking, purchase order automation, cost-effective supplier recommendations

ADVANCED AI FEATURES (Phase 3 - Sprints 9-12):
✓ AI-Based Financial Optimization - Real-time profitability tracking, smart pricing adjustments, predictive financial forecasting
✓ Delivery & Logistics Optimization - Route optimization, fuel & transport cost tracking, packaging calculation
✓ Energy & Labor Cost Allocation - Energy usage tracking, labor cost optimization, cost-cutting strategies
✓ Waste Management & Expiry Tracking - Spoilage detection, waste reduction suggestions, expiry notifications

TECHNOLOGY STACK:
- Frontend: React, Angular, Vue.js, Bootstrap
- Backend: Node.js, Python, Express.js, Spring, Java
- Database: MySQL, Oracle, MongoDB
- Mobile: Swift, Ionic, Kotlin, Flutter, Xcode
- Cloud: AWS, Google Cloud, Azure
- Project Management: Jira, Confluence, Asana, Trello
- Big Data: Kafka, Amazon Kinesis, MongoDB, DynamoDB

KEY OBJECTIVES:
1. Enhance Inventory & Procurement Efficiency
2. Optimize Recipe Management & Cost Control
3. Streamline Order Processing & Production Planning
4. Maximize Financial Performance & Profitability
5. Improve Logistics, Energy & Waste Management
6. Ensure Compliance & Regulatory Adherence

PAYMENT TERMS:
Phase 1: Core System Development - $21,000
- Project Kickoff: $6,300
- Sprint 1-4 Completion: $3,675 each

Phase 2: Module Development - $20,000
- Phase 2 Kickoff: $6,000
- Sprint 5-8 Completion: $3,500 each

Phase 3: Advanced Features & Deployment - $14,000
- Phase 3 Kickoff: $4,200
- Sprint 9-12 Completion: $2,450 each

SUPPORT PLAN:
- Hyper-Care Support: 60 days with 24/7 availability
- SLA-Based Support: 120 days (Critical: 4h, Major: 12h, Minor: 48h)
- Post-6-Month Package: 500 hours at $25/hour

DELIVERABLES:
✓ Fully functional modular kitchen management system
✓ AI-powered inventory tracking and procurement automation
✓ Real-time cost monitoring and profitability analysis
✓ Smart supplier selection and price optimization
✓ Automated label generation with nutritional facts
✓ Logistics and delivery optimization
✓ Complete documentation and training materials
✓ 180 days of comprehensive support`,
  ai: "true"
};

// Function to encode URL parameters
function buildUrl(baseUrl, params) {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key]) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}

// Generate the full URL
const preConfiguredUrl = buildUrl(baseUrl, proposalData);

console.log("\n" + "=".repeat(80));
console.log("PRE-CONFIGURED URL FOR AI-INTEGRATED KITCHEN MANAGEMENT SYSTEM");
console.log("=".repeat(80) + "\n");

console.log("📋 Proposal Details:");
console.log("   • Template: Bettroi Integration Proposal");
console.log("   • Title:", proposalData.title);
console.log("   • Budget: $" + proposalData.value);
console.log("   • AI Generation: Enabled");
console.log("\n");

console.log("🔗 Full URL (copy and paste into browser):");
console.log("\n" + preConfiguredUrl + "\n");

console.log("=".repeat(80));
console.log("\n✨ INSTRUCTIONS:\n");
console.log("1. Copy the URL above");
console.log("2. Paste it into your browser");
console.log("3. Update the client name and email in Step 2");
console.log("4. Review the pre-filled details");
console.log("5. Click 'Generate with AI' in Step 3");
console.log("6. Wait 30-60 seconds for AI to generate the complete proposal");
console.log("\n" + "=".repeat(80) + "\n");

// Also save to a file for easy access
const fs = require('fs');
const outputFile = 'kitchen-management-proposal-url.txt';

const fileContent = `
AI-INTEGRATED KITCHEN MANAGEMENT SYSTEM
Pre-Configured Proposal URL
Generated: ${new Date().toLocaleString()}

====================================================================================================

PROPOSAL DETAILS:
- Template: Bettroi Integration Proposal
- Title: ${proposalData.title}
- Budget: $${proposalData.value}
- Duration: 6 months (12 sprints)
- Team: 7 FTE
- AI Generation: Enabled

====================================================================================================

COPY THIS URL:

${preConfiguredUrl}

====================================================================================================

INSTRUCTIONS:

1. Copy the URL above
2. Paste it into your browser (Chrome, Firefox, Safari, Edge)
3. The proposal form will be pre-filled with all project details
4. Update Step 2:
   - Replace "Your Client Company Name" with actual client name
   - Replace "client@example.com" with actual client email
   - Add client website URL if available (optional)
5. Review all pre-filled information in Steps 1-3
6. Click "Generate with AI (Bettroi Professional)" in Step 3
7. Wait 30-60 seconds while AI generates:
   ✓ Executive Summary
   ✓ Comprehensive Scope of Work
   ✓ Pricing Breakdown ($70,000)
   ✓ 6-Month Timeline
   ✓ Professional Terms & Conditions
8. Review and customize the generated content
9. Add your logo and customize branding
10. Share with client via unique link

====================================================================================================

NEED HELP?

If you encounter any issues:
- Make sure the development server is running (npm run dev)
- Check http://localhost:3000 is accessible
- Verify your OpenAI API key is configured in .env.local
- Check browser console for any errors

====================================================================================================
`;

fs.writeFileSync(outputFile, fileContent);
console.log(`✅ URL also saved to: ${outputFile}\n`);
