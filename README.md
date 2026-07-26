# KiroSpec Builder

> AI-powered development agent system that converts informal product ideas into structured, validated Kiro Specifications ready for execution.

## Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent 1: PM & Market Strategist                                             │
│ • Market validation, competitive analysis, feasibility scoring              │
│ Output: HTML report + JSON data + .kiro/steering/product.md                 │
└─────────────────────────────────────────┬───────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent 2: Software Architect & Financial Officer                             │
│ • Stack selection, Clean Architecture, EARS requirements, AWS costs         │
│ Outputs: .kiro/steering/tech.md, .kiro/specs/requirements.md,              │
│          .kiro/specs/design.md, .kiro/specs/tasks.md                        │
└─────────────────────────────────────────┬───────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent 3: Legal, Compliance & Privacy Guard                                  │
│ • Open Source license validation, GDPR, privacy risk assessment             │
│ Output: .kiro/specs/compliance.md                                           │
└─────────────────────────────────────────┬───────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Agent 4: DevSecOps & Test Automation Engineer                               │
│ • Docker, CI/CD, test stubs, automation scripts                             │
│ Outputs: Dockerfile, docker-compose.yml, .github/workflows/ci.yml, hooks   │
└─────────────────────────────────────────────────────────────────────────────┘
```

| # | Agent | Role | Key Outputs |
|---|-------|------|-------------|
| 1 | **PM & Market Strategist** | Market validation, competitive analysis, feasibility scoring | HTML report + JSON + `.kiro/steering/product.md` |
| 2 | **Software Architect & Financial Officer** | Stack, Clean Architecture, EARS requirements, AWS costs | `tech.md`, `requirements.md`, `design.md`, `tasks.md` |
| 3 | **Legal, Compliance & Privacy Guard** | OSS licenses, GDPR, privacy risks | `compliance.md` |
| 4 | **DevSecOps & Test Automation Engineer** | Docker, CI/CD, test stubs, scripts | `Dockerfile`, `ci.yml`, hooks |

---

## Agent 1: PM & Market Strategist

Takes raw product ideas (1-liner, meeting notes, customer feedback) and produces a comprehensive 16-section market strategy report.

### Quick Start

```
Analyze this idea: "We should build a Slack bot that summarizes long threads 
using AI and posts a TL;DR at the top."
```

### Outputs

| Output | Location |
|--------|----------|
| HTML Report | `output/reports/{{slug}}-market-report-{{date}}.html` |
| JSON Data | `output/data/{{slug}}-market-data-{{date}}.json` |
| Product Steering | `.kiro/steering/product.md` |

### Examples

| Example | Verdict | Score |
|---------|---------|-------|
| [Slack Thread Summarizer](agents/pm-market-strategist/examples/example-output.html) | ✅ GO | 7.7/10 |
| [SaveQuest (Fintech)](agents/pm-market-strategist/examples/example-output-fintech.html) | ⚠️ GO with caution | 7.0/10 |
| [Restaurant Reservations](agents/pm-market-strategist/examples/example-output-reservas.html) | ✅ GO | 7.3/10 |

See [`agents/pm-market-strategist/prompt.md`](agents/pm-market-strategist/prompt.md) for full prompt, validation rules, and more examples.

---

## Project Structure

```
hackathon-kiro/
├── agents/
│   ├── pm-market-strategist/              # Agent 1
│   │   ├── prompt.md                      # System prompt (16 sections)
│   │   ├── agent-config.json              # Configuration & triggers
│   │   ├── run.md                         # Usage guide
│   │   ├── templates/report.html          # HTML template
│   │   └── examples/                      # Input/output examples
│   ├── software-architect/                # Agent 2 (teammate)
│   ├── legal-compliance/                  # Agent 3 (teammate)
│   └── devsecops/                         # Agent 4 (teammate)
├── shared/schemas/
│   └── market-report-schema.json          # JSON validation schema
├── output/                                # Generated reports (gitignored)
└── .kiro/
    ├── steering/
    │   ├── project-overview.md            # Project context
    │   ├── product.md                     # ← Agent 1 output
    │   └── tech.md                        # ← Agent 2 output
    └── specs/
        ├── requirements.md                # ← Agent 2 output
        ├── design.md                      # ← Agent 2 output
        ├── tasks.md                       # ← Agent 2 output
        └── compliance.md                  # ← Agent 3 output
```

---

## For Teammates

| Your Agent | Receives from | Your outputs |
|------------|---------------|--------------|
| **Agent 2** | Agent 1's report + `product.md` | `tech.md`, `requirements.md`, `design.md`, `tasks.md` |
| **Agent 3** | Agent 1 + Agent 2 outputs | `compliance.md` |
| **Agent 4** | All previous outputs | `Dockerfile`, `docker-compose.yml`, `ci.yml`, hooks |

Place your agent in `agents/<your-agent-name>/` with:

```
agents/<your-agent-name>/
├── prompt.md            # System prompt
├── agent-config.json    # Configuration & triggers
├── run.md               # Usage guide
├── templates/           # Output templates (if applicable)
└── examples/            # Input/output examples
```

---

## License

Hackathon project — internal use.
