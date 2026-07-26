# KiroSpec Builder

> AI-powered development agent system that converts informal product ideas into structured, validated Kiro Specifications ready for execution.

## What Is This?

KiroSpec Builder is a multi-agent system where each agent handles a different phase of the product development pipeline:

| Agent | Role | Output |
|-------|------|--------|
| **1. PM & Market Strategist** | Market validation, competitive analysis, feasibility scoring | HTML market report + JSON data |
| **2. TBD** | (Architecture / Technical Design) | — |
| **3. TBD** | (Implementation Planning) | — |

## Agent 1: PM & Market Strategist

Takes raw product ideas and produces comprehensive market strategy reports.

### Features

- **Idea Parsing** — Accepts any format: 1-liner, meeting notes, customer feedback
- **Market Validation** — TAM/SAM/SOM estimation, trend analysis, timing assessment
- **Competitive Analysis** — Maps competitors with strengths, weaknesses, pricing
- **Target Audience** — Builds personas with JTBD framework
- **Value Proposition Canvas** — Pains, gains, relievers, creators
- **Risk Assessment** — Market, technical, business risks with mitigations
- **Feasibility Scorecard** — Viability × Desirability × Feasibility (1-10 scale)
- **Go-to-Market Signals** — Positioning, pricing, distribution, traction strategies
- **Monetization Model Canvas** — Revenue models, unit economics (CAC/LTV/payback), willingness-to-pay
- **Market Timing Score** — Enabling technologies, demand signals (Google Trends, Reddit, HN), adoption cycle stage
- **Stakeholder Map / Adoption Friction Map** — B2B: buyer vs user vs blocker; B2C: acquisition/activation/retention friction
- **Failure Mode Analysis** — Dead competitor post-mortems, anti-patterns, kill criteria
- **Adjacent Opportunities** — 3-phase expansion path, land & expand, cross-sell/upsell potential
- **Handoff Notes** — Structured data for downstream agents

### Quick Start

```
Analyze this idea: "We should build a Slack bot that summarizes long threads 
using AI and posts a TL;DR at the top."
```

### Output

Generates a styled HTML report — see [`agents/pm-market-strategist/examples/example-output.html`](agents/pm-market-strategist/examples/example-output.html)

### Usage Example

#### Step 1: Provide the idea (any format works)

You can feed the agent with informal text — meeting notes, Slack messages, or a brief description:

```text
Analyze this idea: "We want to build a platform that connects LATAM freelancers 
with US/EU startups looking for affordable remote talent. Something like Toptal 
but more accessible and focused on junior-mid devs with intermediate English. 
Many startups can't pay $150/hr but can pay $40-60/hr."
```

Or more structured input with extra context:

```text
Product assessment:

Idea: AI-powered code review bot for GitHub that catches security vulnerabilities
before merge.

Context:
- Target: Engineering teams at Series A-C startups (20-200 devs)
- Competitors we know: Snyk, SonarQube, CodeQL
- Budget: Teams typically spend $20-50/dev/month on security tooling
- Pain: Current tools are noisy (too many false positives) and slow
- Source: Customer interviews (5 CTOs mentioned this in Q2)
```

#### Step 2: Agent generates the report

The agent produces:

1. **HTML Report** → `output/reports/{{slug}}-market-report-{{date}}.html`
2. **JSON Data** → `output/data/{{slug}}-market-data-{{date}}.json`

> These folders are gitignored. For reference, check the example outputs in `agents/pm-market-strategist/examples/`.

#### Step 3: Review the output

Open the HTML file in your browser. You'll see a styled report with 16 sections:

| # | Section | What it covers |
|---|---------|----------------|
| 1 | Executive Summary | 2-3 sentence overview |
| 2 | Problem Statement | Pain point and target user |
| 3 | Proposed Solution | High-level product description |
| 4 | Market Analysis | TAM/SAM/SOM, trends, why now |
| 5 | Competitive Landscape | Direct/indirect competitors table |
| 6 | Target Audience | Personas + JTBD |
| 7 | Value Proposition Canvas | Pains, gains, relievers, creators |
| 8 | Risk Assessment | Risks + mitigations + severity |
| 9 | Feasibility Scorecard | Viability × Desirability × Feasibility |
| 10 | Go-to-Market Signals | Positioning, pricing, channels |
| 11 | Monetization Model Canvas | Revenue models, unit economics, WTP |
| 12 | Market Timing Score | Demand signals, enabling tech, window |
| 13 | Stakeholder Map / Adoption Friction | B2B: buyer/user/blocker; B2C: friction map |
| 14 | Failure Mode Analysis | Dead competitors, anti-patterns, kill criteria |
| 15 | Adjacent Opportunities | 3-phase expansion, land & expand |
| 16 | Recommendations & Next Steps | GO/NO-GO/PIVOT + handoff notes |

#### Step 4: Pass to downstream agents

The report's **Handoff Notes** section contains structured inputs for:

```
→ For Architecture Agent (Agent 2):
  - Core components needed
  - Key technical decisions to make
  - Non-functional requirements
  - Architecture constraints

→ For Implementation Agent (Agent 3):
  - MVP scope definition
  - Suggested tech stack
  - Timeline estimate
  - What's explicitly out of scope
```

The JSON output can also be consumed programmatically by other agents.

---

### Trigger Phrases

| Trigger | Use Case |
|---------|----------|
| `Analyze this idea: <text>` | General idea evaluation |
| `Market analysis for: <text>` | Focus on market/competition |
| `Validate this concept: <text>` | Quick feasibility check |
| `Product assessment: <text>` | Full structured analysis |

---

### Example Ideas & Output

The agent has been tested with multiple idea types. Full example outputs are in `agents/pm-market-strategist/examples/`:

| Example | Type | Input | Output | Verdict | Score |
|---------|------|-------|--------|---------|-------|
| [Slack Thread Summarizer](agents/pm-market-strategist/examples/example-output.html) | B2B SaaS | "Slack bot that summarizes threads with AI" | ✅ HTML | ✅ GO | 7.7/10 |
| [SaveQuest](agents/pm-market-strategist/examples/example-output-fintech.html) | B2C Consumer | "Gamified savings app for Gen Z in LATAM" | ✅ HTML | ⚠️ GO with caution | 7.0/10 |
| [Restaurant Reservations](agents/pm-market-strategist/examples/example-output-reservas.html) | B2C Platform | "Restaurant reservation app for LATAM" | ✅ HTML | ✅ GO | 7.3/10 |

#### More example ideas in the prompt (with expected output summaries):

- **AI Code Review Bot** (B2B Developer Tool) — Security vulnerability scanner for GitHub PRs → GO, 8.2/10
- **Small-City Contractor Marketplace** (Platform) — Thumbtack for towns of 50K-200K → PIVOT to lead-gen first, 6.3/10
- **Investor Update Generator** (Internal Tool) — Auto-generate weekly updates from Notion+Linear+Stripe → GO, 8.5/10

See [`agents/pm-market-strategist/prompt.md`](agents/pm-market-strategist/prompt.md) for full details on expected output per example.

## Project Structure

```
hackathon-kiro/
├── agents/
│   └── pm-market-strategist/
│       ├── prompt.md              # Agent system prompt & instructions (16 sections)
│       ├── agent-config.json      # Configuration, triggers, validation rules
│       ├── run.md                 # Usage guide
│       ├── templates/
│       │   └── report.html        # HTML report template with placeholders
│       └── examples/
│           ├── example-input.md              # Sample input (Slack summarizer)
│           ├── example-input-fintech.md      # Sample input (Gen Z savings app)
│           ├── example-input-reservas.md     # Sample input (Restaurant reservations LATAM)
│           ├── example-output.html           # Full report: Slack summarizer
│           ├── example-output-fintech.html   # Full report: SaveQuest (16 sections)
│           └── example-output-reservas.html  # Full report: Restaurant reservations
├── shared/
│   └── schemas/
│       └── market-report-schema.json  # JSON schema for report validation
├── output/                        # Generated reports (gitignored, created at runtime)
│   ├── reports/                   # HTML reports: <slug>-market-report-<date>.html
│   └── data/                      # JSON data: <slug>-market-data-<date>.json
└── .kiro/
    └── steering/
        └── project-overview.md    # Project steering file
```

> **Note:** The `output/` folder is gitignored and gets created when you run the agent. Example outputs live in `agents/pm-market-strategist/examples/` for reference.

## For Teammates

Your agent should:
1. Accept structured output from Agent 1 (the JSON data or handoff notes from the HTML report)
2. Follow the collaboration protocol defined in `agents/pm-market-strategist/agent-config.json`
3. Place your agent in `agents/<your-agent-name>/` following the same structure

## License

Hackathon project — internal use.
