# How to Use the PM & Market Strategist Agent

## Quick Start

Provide the agent with a product idea in any format:

```
Analyze this idea: "We should build a Slack bot that summarizes long threads 
using AI and posts a TL;DR at the top. Lots of teams complain about losing 
context in busy channels."
```

## Trigger Phrases

- `Analyze this idea: <description>`
- `Market analysis for: <description>`
- `Validate this concept: <description>`
- `Product assessment: <description>`

## What You Get

The agent generates:

1. **HTML Report** — A comprehensive, shareable market strategy document (see `examples/example-output.html`)
2. **Structured Data** — Machine-readable JSON for downstream agents to consume

## Input Tips

The more context you provide, the better the output:

- **Basic:** "Build a Slack bot for thread summaries" → Works, but analysis will be more speculative
- **Better:** "We should build a Slack bot that summarizes long threads using AI. Lots of teams complain about losing context." → Identifies the pain point
- **Best:** Include target audience, constraints, competitors you know about, and any validation data you have

## Output Location

Reports are saved to:
```
output/reports/<slug>-market-report-<date>.html
output/data/<slug>-market-data-<date>.json
```

## Integration with Other Agents

The report includes **Handoff Notes** sections specifically designed for:
- **Agent 2 (Architecture)** — Technical constraints, NFRs, key decisions needed
- **Agent 3 (Implementation)** — MVP scope, tech stack, timeline, out-of-scope items

## Validation

The agent validates its own output against these rules:
- All 11 sections must be present
- Competitor table has ≥3 entries
- All scores include justification
- Every risk has a mitigation strategy
- Market claims are labeled as "estimated" or "sourced"
