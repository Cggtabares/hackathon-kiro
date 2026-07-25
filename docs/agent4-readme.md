# Agent 4 — DevSecOps, Quality & Automation Engineer

## Overview

Agent 4 is the final stage of the KiroSpec Studio pipeline. It consumes the outputs from Agents 1–3 (product vision, architecture specs, compliance requirements) and generates a production-ready development environment: Docker configurations, CI/CD pipelines, security scripts, and spec validation hooks.

## What It Produces

| Output                          | Purpose                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `Dockerfile`                    | Multi-stage build optimized for the selected stack      |
| `docker-compose.yml`            | Local dev environment with all services (app, DB, etc.) |
| `.github/workflows/ci.yml`      | CI/CD pipeline with SAST, linting, tests, and deploy    |
| `.kiro/hooks/validate-specs.sh` | Pre-commit hook that audits spec consistency            |
| `.kiro/hooks/scan-secrets.sh`   | Pre-commit scanner for leaked credentials               |

## Input Contract

Agent 4 reads from the `.kiro/` workspace produced by the previous agents:

```
.kiro/
├── steering/
│   ├── product.md          ← Agent 1 (project name, features)
│   └── tech.md             ← Agent 2 (stack, architecture, security policies)
├── specs/
│   ├── requirements.md     ← Agent 2 (EARS requirements)
│   ├── design.md           ← Agent 2 (entities, diagrams, AWS costs)
│   ├── tasks.md            ← Agent 2 (implementation plan)
│   └── compliance.md       ← Agent 3 (licenses, GDPR, privacy)
└── mocks/
    └── agent1.mock.json    ← Fallback mock for development
```

### Key Fields Consumed

From `tech.md`:

- **Stack list** → determines Docker base image, linter selection, test runner
- **Security policies** → configures SAST tools and secret scanning rules

From `tasks.md`:

- **Task list** → generates CI job stages matching the implementation plan

From `compliance.md`:

- **License audit results** → adds license-check step to CI
- **GDPR requirements** → adds data handling validation steps

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Agent 4 Service                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐    ┌───────────────────────────┐  │
│  │ Spec Reader  │───▶│ DevSecOps Generator       │  │
│  │ (parses .kiro│    │                           │  │
│  │  workspace)  │    │ • DockerfileBuilder       │  │
│  └──────────────┘    │ • ComposeBuilder          │  │
│                      │ • CiPipelineBuilder       │  │
│                      │ • HookScriptBuilder       │  │
│                      │ • SecretScannerBuilder    │  │
│                      └───────────────────────────┘  │
│                                │                     │
│                                ▼                     │
│                      ┌───────────────────────────┐  │
│                      │ File Writer               │  │
│                      │ (writes to project root)  │  │
│                      └───────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Output Specifications

### Dockerfile

- Multi-stage build (deps → build → runtime)
- Base image selected from `tech.md` stack (e.g., `node:22-alpine` for Node.js)
- Non-root user for security
- Health check endpoint
- Minimal final image (only production deps)

### docker-compose.yml

- App service with hot-reload volume mounts
- Database service matching stack (PostgreSQL, MongoDB, etc.)
- Environment variables from `.env.example`
- Named volumes for data persistence
- Network isolation between services

### CI/CD Pipeline (`.github/workflows/ci.yml`)

```yaml
jobs:
  lint: # ESLint + Prettier check
  typecheck: # tsc --noEmit
  test: # vitest run
  security: # SAST scan + secret detection
  license: # License compliance check (from Agent 3)
  build: # Docker image build
  deploy: # Deploy to staging/production (if main branch)
```

### Spec Validation Hook (`.kiro/hooks/validate-specs.sh`)

- Verifies all required spec files exist
- Checks EARS syntax patterns in requirements.md
- Validates Mermaid diagram syntax in design.md
- Ensures task dependencies form valid topological order
- Runs on pre-commit or manually

### Secret Scanner (`.kiro/hooks/scan-secrets.sh`)

- Scans staged files for common secret patterns:
  - API keys, tokens, passwords in source code
  - `.env` files with actual values
  - Private keys (RSA, SSH, etc.)
- Blocks commit if secrets detected
- Configurable allowlist for false positives

## Usage

### Programmatic

```typescript
import { createAgent4 } from "./src/index";

const agent4 = createAgent4({
  workspacePath: ".kiro",
  projectRoot: ".",
});

await agent4.execute();
// → Writes Dockerfile, docker-compose.yml, CI pipeline, hooks
```

### CLI

```bash
npm run generate:devops
```

### Mock Mode (No LLM)

```bash
npm run demo:agent4
```

Uses pre-built templates informed by the `.kiro/` specs — no API key required.

## Integration in the Pipeline

```
Agent 1 (PM)
    │ writes .kiro/steering/product.md
    ▼
Agent 2 (Architect)
    │ writes .kiro/steering/tech.md + .kiro/specs/*
    ▼
Agent 3 (Legal)
    │ writes .kiro/specs/compliance.md
    ▼
Agent 4 (DevSecOps) ← YOU ARE HERE
    │ reads ALL of the above
    │ writes Dockerfile, docker-compose, CI, hooks
    ▼
🚀 Project ready to develop
```

## Design Principles

- **Shift-Left Security**: Security tools run locally (hooks) AND in CI — catch issues at dev time, not production.
- **Stack-Aware Generation**: Docker and CI configs adapt to the stack chosen by Agent 2. Node.js project? Get `node:alpine` + `vitest`. Python? Get `python:slim` + `pytest`.
- **Spec-Driven CI**: The CI pipeline stages mirror the task list from `tasks.md`, so CI validates what was planned.
- **Zero Manual Config**: After Agent 4 runs, `docker compose up` should give you a working dev environment with no extra setup.

## Zod Schemas (Expected)

```typescript
interface Agent4Output {
  dockerfile: string;
  dockerCompose: string;
  ciPipeline: string;
  hooks: {
    validateSpecs: string;
    scanSecrets: string;
  };
}
```

## Testing Strategy

- Unit tests for each builder (DockerfileBuilder, ComposeBuilder, etc.)
- Integration test: feed realistic `.kiro/` workspace → verify all files are generated correctly
- Property test: for any valid stack configuration, the generated Dockerfile must be syntactically valid
