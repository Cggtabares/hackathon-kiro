---
inclusion: always
---

# KiroSpec Builder

KiroSpec Builder is an AI-powered development agent system that acts as an automated Product Manager and Software Architect. It converts informal product ideas, customer requests, or meeting notes into structured, validated Kiro Specifications (.kiro/specs) ready to be executed by coding agents.

## Project Structure

```
hackathon-kiro/
├── agents/
│   ├── pm-market-strategist/    # Agent 1: PM & Market Strategist
│   │   ├── prompt.md            # Agent system prompt
│   │   ├── templates/           # Output templates (HTML, etc.)
│   │   └── examples/            # Example inputs/outputs
│   ├── agent-2/                 # (Future) Agent 2
│   └── agent-3/                 # (Future) Agent 3
├── shared/
│   ├── schemas/                 # Shared validation schemas
│   └── utils/                   # Shared utilities
├── output/                      # Generated reports and specs
└── .kiro/
    ├── steering/                # Steering files
    └── specs/                   # Generated Kiro specs
```

## Agents Overview

1. **PM & Market Strategist** - Analyzes ideas, validates market fit, competitive landscape, generates HTML summary reports
2. (TBD by teammates)
3. (TBD by teammates)
