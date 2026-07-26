---
inclusion: always
---

# KiroSpec Builder

KiroSpec Builder is an AI-powered development agent system that acts as an automated Product Manager and Software Architect. It converts informal product ideas, customer requests, or meeting notes into structured, validated Kiro Specifications (.kiro/specs) ready to be executed by coding agents.

## Pipeline Overview

The system follows a sequential 4-agent pipeline:

```
Idea/Input → Agent 1 → Agent 2 → Agent 3 → Agent 4 → Ready to Code
```

## Project Structure

```
hackathon-kiro/
├── agents/
│   ├── pm-market-strategist/          # Agent 1: PM & Market Strategist
│   │   ├── prompt.md                  # Agent system prompt
│   │   ├── agent-config.json          # Configuration & triggers
│   │   ├── templates/                 # Output templates (HTML)
│   │   └── examples/                  # Example inputs/outputs
│   ├── software-architect/            # Agent 2: Software Architect & Financial Officer
│   │   └── ...                        # (Owned by teammate)
│   ├── legal-compliance/              # Agent 3: Legal, Compliance & Privacy Guard
│   │   └── ...                        # (Owned by teammate)
│   └── devsecops/                     # Agent 4: DevSecOps & Test Automation Engineer
│       └── ...                        # (Owned by teammate)
├── shared/
│   ├── schemas/                       # Shared validation schemas
│   └── utils/                         # Shared utilities
├── output/                            # Generated reports and specs (gitignored)
└── .kiro/
    ├── steering/                      # Steering files
    │   ├── product.md                 # ← Output from Agent 1
    │   └── tech.md                    # ← Output from Agent 2
    └── specs/                         # Generated Kiro specs
        └── requirements.md            # ← Output from Agent 2
        └── design.md                  # ← Output from Agent 2
        └── tasks.md                   # ← Output from Agent 2
        └── compliance.md              # ← Output from Agent 3
```

## Agents Overview

| # | Agent | Responsibility | Key Outputs |
|---|-------|---------------|-------------|
| 1 | **PM & Market Strategist** | Market validation, competitive analysis, feasibility scoring | HTML report + JSON data + `.kiro/steering/product.md` |
| 2 | **Software Architect & Financial Officer** | Stack selection, Clean Architecture, EARS requirements, AWS costs | `.kiro/steering/tech.md`, `.kiro/specs/requirements.md`, `.kiro/specs/design.md`, `.kiro/specs/tasks.md` |
| 3 | **Legal, Compliance & Privacy Guard** | Open Source licenses, GDPR, privacy risks | `.kiro/specs/compliance.md` |
| 4 | **DevSecOps & Test Automation Engineer** | Docker, CI/CD, test stubs, automation scripts | `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`, hooks |
