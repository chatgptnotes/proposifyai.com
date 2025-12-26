# Generate Effort Estimate Proposal

Generate professional effort estimate proposals for software development projects, API integrations, and feature enhancements. These proposals help communicate technical scope, complexity, and resource requirements to clients and stakeholders.

## Context & Purpose

**When to use:** Create detailed effort estimates for new features, integrations, or enhancements when clients request scope expansion or new project components.

**Target clients:**
- Existing clients requesting change orders
- Prospects evaluating project feasibility
- Internal stakeholders for budget planning
- Project managers for resource allocation

**Key use cases:**
- API integrations (third-party systems)
- New feature additions to existing products
- Platform migrations or upgrades
- System architecture changes
- Change requests (CRs) during active projects

## Email Context Analysis

Based on the Bettroi team email thread, key points for effort estimates:

**BT's Requirements:**
- Focus on current scope, complete milestone before new features
- Major scope additions (DDO, Cognifit) require formal effort estimates
- Follow change request (CR) process:
  1. Customer makes CR
  2. BK team decides if major (requires change order)
  3. Haritha communicates with client for CR approval
  4. Execute only after approval

**Haritha's Concerns:**
- Avoid scope creep during active development
- Document changes clearly (screenshots, dates, versions, URLs)
- Differentiate agreed deliverables from CRs
- Manage client expectations effectively
- CRs contribute to revenue but impact delivery clarity

**BK's Requirements for Effort Assessment:**
1. Application structure (pages/screens needed)
2. Features to display
3. Database storage requirements
4. Cognitive application needs/functions required
5. Overall workflow

## Proposal Structure

### 1. Cover Page
- Client name and logo
- Project title: "Effort Estimate - [Feature Name]"
- Document type: "TECHNICAL EFFORT ESTIMATE"
- Reference number
- Date of issue
- Prepared by: Bettroi team member name
- Status: "For Client Approval"

### 2. Executive Summary
- Brief description of requested feature/integration
- High-level effort estimate (person-days or person-weeks)
- Estimated timeline
- Budget range
- Key assumptions and dependencies
- Recommendation (proceed/defer/alternative approach)

### 3. Current Situation & Context
- Reference to original project scope
- Current milestone status
- How this CR relates to existing deliverables
- Impact on current timeline if approved

### 4. Change Request Details

**What's Being Requested:**
- Feature/integration name
- Business justification
- Expected outcomes
- User stories or requirements

**Scope Analysis:**
- In scope for this CR
- Out of scope (future phases)
- Assumptions made
- Open questions requiring clarification

### 5. Technical Analysis

**Application Structure:**
- Number of screens/pages required
- User interfaces needed
- Admin interfaces needed
- API endpoints required
- Database tables/schema changes

**Architecture Impact:**
```
Current Architecture:
→ [Component A] → [Component B] → [Component C]

Proposed Architecture with Integration:
→ [Component A] → [NEW: Integration Layer] → [External API]
                ↓
           [Component B] → [Component C]
```

**Technology Stack:**
- Programming languages
- Frameworks and libraries
- Third-party APIs/SDKs
- Infrastructure requirements

**Integration Points:**
- Authentication/authorization
- Data synchronization
- Error handling
- Webhook/callback mechanisms

### 6. Detailed Breakdown

**Phase 1: Discovery & Planning (X days)**
- Requirements finalization
- API documentation review
- Authentication setup
- Data mapping design
- Wireframes/mockups

**Phase 2: Development (X days)**
- Backend API integration
- Frontend UI components
- Database schema updates
- Business logic implementation
- Error handling

**Phase 3: Testing & QA (X days)**
- Unit testing
- Integration testing
- End-to-end testing
- Performance testing
- Security testing

**Phase 4: Deployment & Documentation (X days)**
- Staging deployment
- Production deployment
- User documentation
- Technical documentation
- Knowledge transfer

### 7. Effort Estimate Table

| Task Category | Sub-Tasks | Estimated Hours | Assigned Role |
|--------------|-----------|----------------|---------------|
| **Requirements** | API research, data mapping | 8 hrs | Tech Lead |
| **Backend** | API integration, endpoints | 24 hrs | Backend Dev |
| **Frontend** | UI screens, data display | 16 hrs | Frontend Dev |
| **Database** | Schema updates, migrations | 8 hrs | Backend Dev |
| **Testing** | Unit, integration, E2E | 16 hrs | QA Engineer |
| **DevOps** | Deployment, monitoring | 8 hrs | DevOps |
| **Documentation** | User + technical docs | 8 hrs | Tech Writer |
| **PM/Coordination** | Meetings, reviews | 8 hrs | Project Manager |
| **TOTAL** | | **96 hrs** | (12 person-days) |

**Contingency Buffer:** 20% (19.2 hrs) for unforeseen issues

**Grand Total:** 115.2 hrs ≈ **14.5 person-days**

### 8. Timeline Estimate

**Option A: Dedicated Team**
- Duration: 2-3 weeks
- Team: 1 Backend Dev, 1 Frontend Dev, 1 QA, 0.5 PM
- Parallel work streams
- Faster delivery

**Option B: Shared Resources**
- Duration: 4-5 weeks
- Team: Developers shared across projects
- Sequential work
- Lower cost, slower delivery

**Milestone Schedule:**
```
Week 1: Discovery & API setup
Week 2: Backend integration + Frontend UI (parallel)
Week 3: Testing & bug fixes
Week 4: Deployment & documentation
```

### 9. Dependencies & Risks

**External Dependencies:**
- Third-party API availability and documentation
- API access credentials and permissions
- Rate limits or usage costs
- Third-party system uptime/SLA

**Internal Dependencies:**
- Current project milestone completion
- Resource availability
- Environment access (staging, production)
- Client approval timeline

**Technical Risks:**
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| API documentation incomplete | Medium | High | Request sandbox access early |
| Authentication complexity | Low | Medium | Use OAuth 2.0 standard flow |
| Data format mismatches | Medium | Medium | Build robust mapping layer |
| Performance issues | Low | High | Load testing in staging |
| Third-party API changes | Low | High | Version pinning, monitoring |

### 10. Cost Estimate

**Development Costs:**
```
Total Effort: 115 hours
Blended Rate: $XX/hour
Development Cost: $XX,XXX

Breakdown:
- Backend Development: $X,XXX
- Frontend Development: $X,XXX
- QA & Testing: $X,XXX
- DevOps: $XXX
- Project Management: $XXX
```

**Third-Party Costs (if applicable):**
- API subscription: $XXX/month
- Additional infrastructure: $XXX/month
- Support/maintenance: $XXX/month

**Total Investment:** $XX,XXX (one-time) + $XXX/month (ongoing)

### 11. Assumptions

**Technical Assumptions:**
- Third-party API is RESTful with JSON responses
- API documentation is complete and accurate
- Authentication uses OAuth 2.0 or API keys
- Rate limits are sufficient for expected usage
- No major breaking changes during development

**Business Assumptions:**
- Requirements are stable (no scope changes)
- Client provides timely feedback/approvals
- Test credentials available within 2 days
- Staging environment mirrors production
- 2-week approval window for this estimate

**Resource Assumptions:**
- Team available as per timeline
- No major holidays during development
- Standard 8-hour workdays
- Access to necessary tools and environments

### 12. Exclusions (Out of Scope)

- Migration of historical data
- Custom reporting beyond standard dashboards
- Mobile app development
- White-label customization
- Training sessions (separate SOW)
- 24/7 support (covered under maintenance)
- Integration with additional systems

### 13. Success Criteria

**Functional:**
- API integration successfully connects and authenticates
- Data flows correctly between systems
- All user stories completed and tested
- Error handling covers edge cases
- Performance meets benchmarks (X requests/sec)

**Non-Functional:**
- Code coverage >80%
- API response time <2 seconds (P95)
- Zero security vulnerabilities (OWASP top 10)
- Documentation complete and reviewed
- Client acceptance sign-off obtained

### 14. Next Steps

**For Client:**
1. Review this estimate and provide feedback
2. Clarify any open questions (see Appendix)
3. Approve budget and timeline
4. Sign Change Request form
5. Provide API access credentials

**For Bettroi:**
1. Await client approval
2. Schedule resources upon approval
3. Kickoff meeting within 3 days of approval
4. Weekly progress updates
5. Demo at end of each phase

### 15. Approval & Sign-Off

**Validity:** This estimate is valid for 30 days from date of issue.

**Acceptance:**
```
Client Sign-Off:
Name: ___________________________
Title: ___________________________
Signature: ___________________________
Date: ___________________________

Bettroi Approval:
Name: ___________________________
Title: ___________________________
Signature: ___________________________
Date: ___________________________
```

### 16. Appendices

**Appendix A: Open Questions**
1. [Specific question about data mapping]
2. [Specific question about authentication]
3. [Specific question about error handling]
4. [etc.]

**Appendix B: API Documentation Review**
- Link to third-party API docs
- Key endpoints identified
- Authentication method confirmed
- Rate limits documented

**Appendix C: Wireframes/Mockups** (if applicable)
- Screen 1: [Description]
- Screen 2: [Description]

**Appendix D: Technical Specifications** (if detailed)
- Database schema changes
- API endpoint specifications
- Data flow diagrams

## BK's Assessment Questions Template

When creating estimates, always address these 5 key questions:

### 1. Application Structure
**What type of application do we need to make?**
- Number of pages/screens needed
- User roles and access levels
- Navigation flow
- Responsive design requirements

**Example Answer:**
```
Web Application: 5 screens
1. Integration Configuration Page (Admin only)
2. Data Sync Dashboard (Doctor view)
3. Patient Results Display (Patient view)
4. Settings & Permissions
5. Audit Log & History

Plus 8 API endpoints for backend integration.
```

### 2. Features to Display
**What are the key features that we need to show?**
- User-facing features
- Admin/configuration features
- Reporting/analytics features
- Real-time vs batch updates

**Example Answer:**
```
Key Features:
- Live sync status indicator
- Last sync timestamp
- Error notifications with retry option
- Data preview before sync
- Manual sync trigger button
- Sync history log (last 30 days)
- Export sync reports to CSV
```

### 3. Database Storage
**What information do we need to store?**
- New tables required
- Updates to existing tables
- Data retention policies
- Relationships and foreign keys

**Example Answer:**
```
New Tables:
- integration_configs (API keys, endpoints, settings)
- sync_logs (timestamp, status, records processed, errors)
- external_data_cache (temporary storage for synced data)

Modified Tables:
- patients: add external_system_id column
- appointments: add sync_status column

Estimated Storage: ~500MB for 10,000 records
```

### 4. Cognitive Application Needs
**What functions/features do we need from the external application?**
- Specific API endpoints required
- Data we need to fetch
- Data we need to push
- Webhook requirements

**Example Answer:**
```
Required from Cognifit API:
1. GET /assessments - List available cognitive tests
2. POST /sessions - Create new assessment session
3. GET /sessions/{id}/results - Fetch test results
4. GET /users/{id}/history - Get patient assessment history
5. Webhook: POST to our endpoint when assessment completes

Data Format: JSON over HTTPS
Authentication: OAuth 2.0 or API Key
Rate Limit: 100 requests/minute
```

### 5. Workflow
**What will the overall workflow be?**
- Step-by-step user journey
- System interactions
- Decision points
- Error handling paths

**Example Answer:**
```
Workflow:
1. Doctor enables integration in settings (one-time setup)
2. During patient consultation, doctor assigns cognitive test
3. System creates session in Cognifit via API
4. Patient receives link to complete assessment
5. Upon completion, Cognifit webhook notifies our system
6. System fetches results via API
7. Results displayed in doctor dashboard
8. Results attached to patient record
9. Doctor reviews and adds clinical notes
10. Summary included in consultation report

Error Handling:
- API timeout: Retry with exponential backoff (3 attempts)
- Authentication failure: Alert admin, pause sync
- Data validation error: Log and notify, allow manual review
```

## Design Specifications

### Professional Layout
- Clean, technical appearance
- Tables for effort breakdown
- Diagrams for workflows
- Color-coding for risk levels
- Icons for task categories

### Color Scheme (Bettroi Branding)
- Primary: #003DA5 (professional blue)
- Secondary: #0051D5 (lighter blue)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Danger: #ef4444 (red)
- Neutral: #f7fafc, #4a5568

### Typography
- Headers: Bold, 18-22px
- Body: 14px, line-height 1.6
- Tables: 13px for data cells
- Code blocks: Monospace, 12px

## File Naming Convention

Format: `Effort_Estimate_[ProjectName]_[FeatureName]_[Date].html`

Examples:
- `Effort_Estimate_NeuroSense_DDO_Integration_20251227.html`
- `Effort_Estimate_NeuroSense_Cognifit_API_20251227.html`

## Tips for Accurate Estimates

### Do:
- Break down into smallest measurable tasks
- Include buffer for unknowns (15-25%)
- Account for code review, testing, documentation
- Consider team learning curve for new tech
- Include client feedback/approval cycles
- Be realistic about resource availability
- Document all assumptions clearly

### Don't:
- Underestimate integration complexity
- Forget about error handling and edge cases
- Ignore third-party API limitations
- Overlook deployment and rollback planning
- Skip security review time
- Assume perfect documentation from third parties
- Promise fixed price without contingency

## Related Skills
- `generate-business-proposal.md` - Full project proposals
- `generate-aml-compliance-proposal.md` - Regulated industry proposals
- `generate-advance-invoice.md` - Invoicing after approval

## Version History
- v1.0.0 (2025-12-27): Initial skill creation based on Bettroi team email thread and BK's assessment requirements
