# Legal & Compliance Handoff Requirements

> Share this document with the owners of Agent 1 and Agent 2.
> It defines the minimum information Agent 3 needs to produce a defensible compliance report.

## Scope Boundary

Agent 3 owns privacy, applicable-regulation analysis, open-source license review,
and compliance recommendations. AWS and AI controls are reviewed only when they
are relevant to legal, privacy, contractual, or data-protection obligations.

Agent 3 does not own code-quality checks, automated spec validation, testing,
type checking, CI/CD, deployment verification, or Kiro quality hooks. A separate
DevOps & Testing agent will implement and verify those controls. Agent 3 must not
mark an operational control as implemented without evidence from that owner.

## General Handoff Rules

Every field must be labeled as:
- `confirmed`: explicitly provided by the user or verified with evidence
- `assumed`: inferred and awaiting confirmation
- `unknown`: insufficient information; do not invent a value

For external findings, include:
- Source URL
- Retrieval date
- Applicable jurisdiction or version
- Confidence: `verified` or `unverified`

Agent 1 and Agent 2 provide facts and evidence. Agent 3 determines potential
compliance implications and routes uncertain conclusions to qualified counsel.

---

## Agent 1 — PM & Market Strategist

### 1. Product Scope

- Project name and one-sentence description
- Core problem and target outcome
- Industry/niche
- Product category: SaaS, marketplace, community, transactional, or content
- B2C, B2B, or both
- Business/operator jurisdiction, if known
- Countries/states where the product will launch

### 2. User Personas

For every user type provide:
- Persona role and relationship to the product
- Age range
- Country/state
- Technical level and accessibility needs
- Whether the user may be under 13, 16, or 18
- Whether the product is directed to children
- Whether the persona belongs to a regulated sector
- Privacy sensitivity
- Whether the persona manages another person's data
### 3. Features and Business Rules

For each feature provide:
- Feature name and business purpose
- User roles that can use it
- Data required and whether each field is mandatory or optional
- User-generated content, messaging, uploads, moderation, and reporting behavior
- Registration, account recovery, account deletion, and data export behavior
- Marketing communications and notification preferences
- Payments, subscriptions, trials, cancellation, and refund rules
- AI-generated content, profiling, recommendations, or automated decisions

### 4. Intended Data Lifecycle

- Data collected during registration
- Data collected during normal use
- Data considered strictly necessary
- Optional data and consent choices
- Intended recipients and third-party sharing
- Intended retention after inactivity or account deletion
- User rights and self-service controls planned by the product

### 5. Commercial Model

- Free, paid, subscription, marketplace fee, advertising, or data monetization
- Whether personal data is sold
- Whether personal data is shared for targeted/cross-context advertising
- Estimated annual revenue, if known
- Expected users by jurisdiction at MVP and growth stages

### 6. Competitor Evidence

For each principal competitor provide:

| Competitor | Finding | Source URL | Retrieved | Jurisdiction | Confidence |
|------------|---------|------------|-----------|--------------|------------|
| [name] | [policy, certification, or regulatory action] | [URL] | [date] | [region] | Verified/Unverified |

Competitor practices are benchmarks only. They are not legal authority or proof
that a practice is lawful, mandatory, or sufficient.

---

## Agent 2 — Software Architect & Financial

### 1. Architecture and Geography

- Frontend, backend, databases, storage, queues, analytics, and AI services
- Development, staging, and production environments
- AWS deployment region(s)
- Primary data storage region(s)
- Backup/disaster-recovery region(s)
- User jurisdictions, kept separate from AWS regions
- Cross-border data transfers
- Architecture and data-flow diagrams
### 2. Data Processing Map

Provide one row per data category:

| Data | Subject/Source | Collection | Purpose | Storage + Region | Access | Processor | Retention | Deletion |
|------|----------------|------------|---------|------------------|--------|-----------|-----------|----------|
| [email] | [persona] | [form/API] | [auth] | [Cognito/region] | [roles] | [AWS] | [period] | [mechanism] |

Include personal data, sensitive data, AI prompts/outputs, logs, analytics,
backups, support records, exported data, and user-generated content.

### 3. Identity, Authentication, and Authorization

- Identity provider and login methods
- Identity attributes stored
- MFA and account recovery
- Session/token lifetime, refresh, revocation, and logout
- Authorization model: RBAC, ABAC, or other
- Admin and privileged roles
- Service-to-service identities

### 4. Third-Party Processors

| Provider | Service | Data Received | Purpose | Processing Region | Agreement/Control | Provider Use/Training |
|----------|---------|---------------|---------|-------------------|-------------------|-----------------------|
| [AWS] | [Bedrock/Cognito/etc.] | [data] | [purpose] | [region] | [DPA/BAA/SCC/etc.] | [setting or unknown] |

Include analytics, email, payments, monitoring, CDN, support, AI, and hosting providers.

### 5. AI and Amazon Bedrock

- Model/provider and Bedrock region
- Data included in prompts and outputs
- Whether personal, sensitive, confidential, or user-generated data is sent
- Prompt/output logging and retention
- Provider training/use settings and subprocessors
- Guardrails, moderation, prompt-injection, and output-validation controls
- Human review and appeal for consequential decisions
- User-facing AI disclosures
### 6. Security and Operations

- IAM roles, trust boundaries, and least-privilege approach
- Public endpoints, CORS, rate limits, WAF, and abuse controls
- Encryption in transit and at rest
- KMS/key ownership and rotation approach
- Secrets management
- Audit and application logging
- Log and backup retention
- Monitoring and alerting
- Incident response and breach-assessment process
- Backup restoration, disaster recovery, and data deletion

### 7. Scale and Commercial Threshold Inputs

- MVP and growth users by jurisdiction
- Estimated annual revenue, if available
- Whether personal data is sold or shared for advertising
- Percentage of revenue derived from selling/sharing data, if any
- Payment or transaction volume

Agent 2 must not declare a privacy law applicable from user count alone.
Missing threshold facts must be marked `unknown`.

### 8. Software Supply Chain

- Direct and transitive dependencies
- Exact versions, not open ranges
- Production or development scope
- Declared SPDX license
- Package registry/repository evidence URL
- Container images, operating systems, runtimes, and managed components

---

## Minimum Blocking Questions

Agent 3 must pause or mark its conclusion as incomplete when these are unknown:

1. Where are users located?
2. Where is the operating company established?
3. Are children or teenagers expected to use the product?
4. What personal or sensitive data is processed?
5. Is data sold or shared for targeted advertising?
6. Where is data stored and processed?
7. Which third parties receive the data?
8. How long are active data, logs, and backups retained?
9. How are accounts and data deleted?
10. Does personal data enter an AI model?
---

## Compact Handoff Template

```json
{
  "product": {
    "scope": {},
    "personas": [],
    "features": [],
    "businessRules": [],
    "commercialModel": {},
    "competitorEvidence": []
  },
  "technical": {
    "architecture": {},
    "regions": {},
    "dataProcessing": [],
    "identityAndAccess": {},
    "processors": [],
    "aiProcessing": {},
    "securityAndOperations": {},
    "dependencies": []
  },
  "scale": {
    "usersByJurisdiction": {},
    "annualRevenue": null,
    "sellsPersonalData": null,
    "sharesForAdvertising": null
  },
  "confirmedFacts": [],
  "assumptions": [],
  "unknowns": [],
  "sources": []
}
```

## Acceptance Criteria

The handoff is ready for Agent 3 when:
- Required fields are present or explicitly marked `unknown`
- User and infrastructure regions are not mixed
- Data flow includes collection, storage, sharing, retention, and deletion
- AI processing is documented separately
- Dependencies have exact versions and evidence
- Assumptions are visible and awaiting confirmation
- External findings have sources and retrieval dates
