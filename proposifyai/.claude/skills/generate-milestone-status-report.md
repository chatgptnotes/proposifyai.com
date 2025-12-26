# Generate Milestone Status Report

Generate professional milestone status reports for ongoing software development projects. These reports provide detailed progress updates aligned with Purchase Orders (POs), track deliverables, and maintain transparency with clients throughout project execution.

## Context & Purpose

**When to use:** Create comprehensive progress reports for active software projects, typically at milestone completion points or upon client request for status updates.

**Target clients:**
- Active clients with ongoing development projects
- Stakeholders requiring detailed progress visibility
- Project sponsors needing milestone completion verification
- Teams following agile or milestone-based delivery models

**Key use cases:**
- Milestone completion reports (M1, M2, M3, M4, etc.)
- Mid-project status updates
- UAT preparation documents
- PO alignment verification reports
- Change request impact assessments

## Report Context Analysis

Based on successful NeuroSense360 milestone reporting:

**Key Requirements:**
- Align strictly with PO language and deliverables
- Provide testing credentials for UAT verification
- Document gaps between planned vs. actual implementation
- Show clear completion percentages per milestone
- Identify critical blockers requiring client input
- Maintain professional, emoji-free formatting

**Critical Elements:**
- Production environment URLs and access credentials
- Milestone-by-milestone feature breakdown
- Technical architecture alignment with PO specs
- Outstanding items requiring client action
- Timeline risks and mitigation strategies

## Report Structure

### 1. Document Header
- Project name and logo
- Report title: "Milestone Status Report"
- Reference number format: `MSR-[ProjectCode]-[YYYYMMDD]`
- Date of issue
- Report version (if revised)
- Prepared by: Development team/company name
- Project PO reference number

### 2. Executive Summary
**Report Snapshot:**
- Overall project completion percentage
- Current milestone status (completed vs. in-progress)
- Key achievements since last report
- Critical blockers or risks
- Next milestone timeline

**Example:**
```
Project Status: 75% Complete (M1-M3 delivered, M4 in progress)
Current Phase: User Acceptance Testing & Payment Integration
Key Achievement: Patient Portal and AI Algorithm Integration completed ahead of schedule
Critical Blocker: Payment gateway confirmation pending (Stripe vs. Razorpay)
Next Milestone: M4 completion by January 15, 2026
```

### 3. Access Credentials & Testing Environment

**CRITICAL:** Always include this section at the top for client UAT verification.

```html
<div class="credentials-box">
    <h3>Production Environment</h3>
    <div class="credential-item">
        <span class="credential-label">Website URL:</span>
        <span class="credential-value">https://projectname.vercel.app</span>
    </div>
    <div class="credential-item">
        <span class="credential-label">Status:</span>
        <span class="credential-value">Live - Ready for UAT</span>
    </div>
</div>

<div class="credentials-box" style="background: #d1fae5; border-color: #10b981;">
    <h3>Super Admin / Primary User Credentials</h3>
    <div class="credential-item">
        <span class="credential-label">Email:</span>
        <span class="credential-value">admin@projectname.com</span>
    </div>
    <div class="credential-item">
        <span class="credential-label">Password:</span>
        <span class="credential-value">SecurePassword@2025</span>
    </div>
    <div class="credential-item">
        <span class="credential-label">Role:</span>
        <span class="credential-value">Super Administrator (Full Access)</span>
    </div>
</div>

<div class="credentials-box" style="background: #dbeafe; border-color: #3b82f6;">
    <h3>Test User Credentials</h3>
    <div class="credential-item">
        <span class="credential-label">Email:</span>
        <span class="credential-value">testuser@projectname.com</span>
    </div>
    <div class="credential-item">
        <span class="credential-label">Password:</span>
        <span class="credential-value">TestUser@2025</span>
    </div>
    <div class="credential-item">
        <span class="credential-label">Role:</span>
        <span class="credential-value">Standard User</span>
    </div>
</div>
```

### 4. Milestone Completion Overview Table

```html
<table>
    <thead>
        <tr>
            <th>Milestone</th>
            <th>Description (as per PO)</th>
            <th>Completion %</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>M1</strong></td>
            <td>Foundation (Week 1): Infra setup, baseline schema, auth, RBAC skeleton</td>
            <td>100%</td>
            <td><span class="status-complete">COMPLETE</span></td>
        </tr>
        <tr>
            <td><strong>M2</strong></td>
            <td>Core App (Weeks 2-6): Super Admin + Clinic features</td>
            <td>100%</td>
            <td><span class="status-complete">COMPLETE</span></td>
        </tr>
        <tr>
            <td><strong>M3</strong></td>
            <td>Patient portal + Algorithms & Reports (Weeks 7-10)</td>
            <td>100%</td>
            <td><span class="status-complete">COMPLETE</span></td>
        </tr>
        <tr>
            <td><strong>M4</strong></td>
            <td>Payments & Launch (Weeks 11-12): Gateway, UAT, go-live</td>
            <td>60%</td>
            <td><span class="status-progress">IN PROGRESS</span></td>
        </tr>
    </tbody>
</table>
```

### 5. Detailed Milestone Breakdown

**For Each Milestone:**

#### Section Template:
```markdown
## X.0 Milestone [N] - [Name from PO] ([Timeline])

### Status: [Percentage]% [COMPLETE/IN PROGRESS]

**Acceptance Criteria (as per PO):** [Copy exact criteria from PO]

### [Feature Category A]
**Delivered Features:**
- Feature 1 description (aligned with PO language)
- Feature 2 description
- Feature 3 description
- [etc.]

### [Feature Category B]
**Delivered Features:**
- Feature 1
- Feature 2
```

**Important:**
- Use exact PO language for milestone descriptions
- Group features by logical categories (e.g., "Super Admin Dashboard", "Patient Portal", "Algorithm Integration")
- Mark completed milestones as "100% Complete ✓"
- Mark in-progress milestones with actual percentage (e.g., "60% IN PROGRESS")
- Only show "Delivered Features" for completed milestones
- For incomplete milestones, use "Planned Features" or "Pending Features"

### 6. Technical Architecture Status

**Compare PO specifications with actual implementation:**

```html
<table>
    <thead>
        <tr>
            <th>Layer</th>
            <th>Technology (PO Spec)</th>
            <th>Implementation Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Frontend</strong></td>
            <td>React / Next.js</td>
            <td><span class="status-complete">Implemented</span> (React 18.2)</td>
        </tr>
        <tr>
            <td><strong>Backend</strong></td>
            <td>Node.js / Express</td>
            <td><span class="status-complete">Implemented</span></td>
        </tr>
        <tr>
            <td><strong>Database</strong></td>
            <td>PostgreSQL (Supabase)</td>
            <td><span class="status-complete">Implemented</span></td>
        </tr>
        <tr>
            <td><strong>Payments</strong></td>
            <td>Stripe API - Client provided</td>
            <td><span class="status-pending">PENDING</span> (Clarification required)</td>
        </tr>
    </tbody>
</table>
```

**Document any discrepancies:**
- If PO specifies Stripe but Razorpay implemented → Flag as critical clarification
- If tech stack differs from PO → Document with justification
- If external dependencies missing → Flag as blocker

### 7. Outstanding Items & Client Actions Required

**Critical for project continuation:**

```html
<div class="gap-highlight">
    <h3>Critical Path Items Requiring Client Input:</h3>
    <ol>
        <li><strong>[Item 1 Name] (URGENT):</strong>
            <ul>
                <li>Specific requirement 1</li>
                <li>Specific requirement 2</li>
                <li>Timeline: Required by <strong>[Date]</strong></li>
            </ul>
        </li>
        <li><strong>[Item 2 Name]:</strong>
            <ul>
                <li>Details...</li>
                <li>Timeline: Required by <strong>[Date]</strong></li>
            </ul>
        </li>
    </ol>
</div>
```

**Common Categories:**
- Payment gateway/API credentials
- Third-party integration specs
- Design assets (logos, templates, branding)
- Algorithm specifications
- Content (legal text, educational materials)
- Domain names and SSL certificates

### 8. Recommendations & Next Steps

```html
<div class="info-box">
    <strong>Immediate Actions (This Week):</strong>
    <ol>
        <li><strong>Client UAT Testing:</strong> Use provided credentials to test completed features</li>
        <li><strong>Provide Pending Inputs:</strong> Submit [specific items] by [date]</li>
        <li><strong>Approve Design Assets:</strong> Finalize templates and branding</li>
    </ol>
</div>

<div class="info-box">
    <strong>Development Team Actions (Next 2 Weeks):</strong>
    <ol>
        <li>Complete remaining M[N] features</li>
        <li>Conduct internal QA testing</li>
        <li>Prepare for production deployment</li>
    </ol>
</div>

<div class="warning-box">
    <strong>Timeline Risk:</strong>
    <p>Original PO timeline: <strong>[X] weeks</strong> (completion by [date])</p>
    <p>Current status: Week [Y] of development</p>
    <p><strong>Risk Factor:</strong> [Description of delays/blockers]</p>
    <p><strong>Mitigation:</strong> [Action plan to stay on track]</p>
</div>
```

### 9. Appendix - Testing Instructions

**Provide step-by-step UAT flows:**

```markdown
### Super Admin Testing Flow:
1. Access `https://projectname.vercel.app`
2. Click "Admin Login" → Enter Super Admin credentials
3. Navigate to dashboard sections:
   - User Management → Create test accounts
   - Settings → Configure templates
   - Analytics → View usage dashboards

### [User Role 2] Testing Flow:
1. Login with [Role] credentials
2. Test features:
   - Feature 1 testing steps
   - Feature 2 testing steps

### Feedback Submission:
**Email:** support@company.com
**Subject:** [ProjectName] UAT Feedback - [Date]
```

## Design Specifications

### Professional Layout
- Clean, technical appearance without emojis
- Status badges: COMPLETE (green), IN PROGRESS (blue), PENDING (orange), BLOCKED (red)
- Tables for milestone tracking
- Color-coded credential boxes for easy identification
- Warning boxes for critical issues

### Color Scheme (Bettroi/Raftaar Branding)
- Primary: #003DA5 (professional blue)
- Success/Complete: #10b981 (green)
- Progress/Info: #3b82f6 (blue)
- Warning/Pending: #f59e0b (orange)
- Danger/Blocked: #ef4444 (red)
- Neutral backgrounds: #f7fafc, #e5e7eb

### Typography
- Headers: Bold, 18-24px
- Section titles: Bold, 16-18px
- Body: 14px, line-height 1.6
- Tables: 13px for data cells
- Code/URLs: Monospace, 12-13px

### Status Badges CSS
```css
.status-complete {
    background: #d1fae5;
    color: #065f46;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 12px;
}

.status-progress {
    background: #dbeafe;
    color: #1e40af;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 12px;
}

.status-pending {
    background: #fef3c7;
    color: #92400e;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 12px;
}
```

## File Naming Convention

Format: `[ProjectName]_Milestone_Status_Report_[YYYYMMDD].html`

If revised: `[ProjectName]_Milestone_Status_Report_REVISED.html`

Examples:
- `NeuroSense360_Milestone_Status_Report_20251227.html`
- `NeuroSense360_Milestone_Status_Report_REVISED.html`
- `DDO_Platform_Milestone_Status_Report_20260103.html`

## Key Principles for Accurate Reporting

### Do:
- **Align with PO verbatim** - Use exact milestone names and acceptance criteria from PO
- **Provide testing credentials** - Always include access details at the top
- **Show actual progress** - Don't inflate completion percentages
- **Flag discrepancies clearly** - Highlight PO vs. implementation gaps
- **Document blockers** - Identify client actions required with deadlines
- **Use professional language** - No emojis, clean technical writing
- **Version control** - Mark reports as REVISED if updated after client feedback

### Don't:
- **Hide gaps** - Transparency builds trust
- **Skip credentials** - Client needs to verify deliverables
- **Mismatch PO language** - Causes confusion and scope disputes
- **Use vague percentages** - Be specific (75% not "mostly done")
- **Ignore timeline risks** - Flag delays proactively
- **Include financials** - Keep payment details in separate invoice/contract docs
- **Use emojis** - Maintain professional business document standards

## PO Alignment Checklist

Before finalizing the report, verify:

- [ ] Milestone names match PO exactly
- [ ] Acceptance criteria quoted verbatim from PO
- [ ] Technology stack matches PO specifications
- [ ] All PO deliverables accounted for
- [ ] Discrepancies flagged with clear explanations
- [ ] Testing credentials provided and verified
- [ ] Client action items documented with deadlines
- [ ] Timeline aligned with PO or risks explained
- [ ] No financials included (separate document)
- [ ] Professional formatting without emojis

## Quality Assurance Notes

**For each milestone marked "COMPLETE":**
- All acceptance criteria from PO must be met
- Features must be deployed and accessible
- Testing credentials must work
- No critical bugs blocking functionality
- Client can verify via UAT testing

**For "IN PROGRESS" milestones:**
- Provide realistic completion percentage
- Document what's done vs. pending
- Identify blockers preventing 100% completion
- Estimate completion timeline

## Related Skills
- `generate-effort-estimate-proposal.md` - For change requests and scope additions
- `generate-business-proposal.md` - For initial project proposals
- `generate-advance-invoice.md` - For milestone payment invoicing

## Version History
- v1.0.0 (2025-12-27): Initial skill creation based on NeuroSense360 milestone reporting experience

## Example Use Cases

### Case 1: Mid-Project Status Update
**Scenario:** Client requests status after M2 completion
**Action:** Generate report showing M1-M2 complete (100%), M3-M4 pending with timeline

### Case 2: PO Alignment Revision
**Scenario:** Client flags gaps between PO and initial report
**Action:** Generate REVISED report with exact PO language alignment and gap analysis

### Case 3: UAT Preparation
**Scenario:** Client ready to begin User Acceptance Testing
**Action:** Generate report with all credentials, testing instructions, and verification checklists

### Case 4: Timeline Risk Communication
**Scenario:** Client delays on providing inputs causing schedule risk
**Action:** Generate report highlighting outstanding client actions with risk impact analysis
