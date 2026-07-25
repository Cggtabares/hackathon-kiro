# Implementation Plan: Agent 4 — DevSecOps, Quality & Automation Engineer

## Overview

Implement Agent 4 as the final pipeline stage in KiroSpec Studio. The agent consumes validated outputs from Agents 1, 2, and 3 and generates production-ready DevSecOps artifacts (Dockerfile, docker-compose.yml, CI/CD pipeline, hook scripts). Implementation follows Clean Architecture with Zod validation, reusing existing infrastructure (LlmPort, MockLlmClient, VercelAiLlmClient) and extending the domain layer with Agent4-specific schemas, types, and adapters.

## Tasks

- [x] 1. Define Agent 4 domain types and Zod schemas
  - [x] 1.1 Add Agent4 type interfaces to src/domain/types.ts
    - Add `Agent4SecurityPolicy`, `Agent4TaskItem`, `Agent4LicenseEntry`, `Agent4ComplianceReport`, `Agent4Input`, `Agent4Hooks`, and `Agent4Output` interfaces
    - Follow existing type conventions (pure interfaces, no runtime dependencies)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.2 Add Agent4 Zod schemas to src/domain/schemas.ts
    - Implement `Agent4SecurityPolicySchema`, `Agent4TaskItemSchema`, `Agent4LicenseEntrySchema`, `Agent4ComplianceReportSchema`, `Agent4InputSchema`
    - Implement `Agent4HooksSchema` with shebang refinement, `Agent4OutputSchema` with structural refinements (2+ FROM, "services", "jobs")
    - Add whitespace-only rejection via `.trim().min(1)` or `.refine()` on all string fields in input schema
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 1.3 Write property tests for Agent4 schemas
    - **Property 1: Valid Agent4Input round-trip through schema**
    - **Property 2: Valid Agent4Output round-trip through schema**
    - **Property 3: Whitespace-only strings are rejected**
    - Create `src/__tests__/domain/agent4-schemas.property.ts` using fast-check generators
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 2. Implement GenerateDevSecOpsSpec use case and port interfaces
  - [x] 2.1 Create src/application/generate-devsecops-spec.ts with port interfaces and use case class
    - Define `Agent4MockLoaderPort` and `Agent4FileWriterPort` interfaces
    - Implement `GenerateDevSecOpsSpecUseCase` with constructor accepting LlmPort, Agent4MockLoaderPort, Agent4FileWriterPort, and systemPrompt string
    - Implement `execute(input?: Agent4Input)` method: validate input → build user prompt → invoke LLM → validate output → write files → return output
    - Implement fallback to mock loader when input is not provided
    - Map Zod errors to `ValidationError` with field path, expected type, and received value
    - Classify LLM errors as transient/permanent based on message keywords ("timeout", "ECONNRESET", "503")
    - Wrap filesystem errors in `FilesystemError` with target path and cause
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 2.2 Write property tests for use case error handling
    - **Property 4: Schema validation failures produce correct ValidationError**
    - **Property 5: Input validation precedes LLM invocation**
    - **Property 6: LLM error classification by transient keywords**
    - Create `src/__tests__/application/generate-devsecops-spec.property.ts`
    - **Validates: Requirements 1.4, 2.6, 3.1, 3.3, 3.4, 12.1, 12.2, 12.3, 12.4**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Agent 4 infrastructure adapters
  - [x] 4.1 Create src/infrastructure/agent4-file-writer.ts
    - Implement `Agent4FileWriter` class fulfilling `Agent4FileWriterPort`
    - Map output fields to target paths: `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`, `.kiro/hooks/validate-specs.sh`, `.kiro/hooks/scan-secrets.sh`
    - Create directories recursively with `fs.mkdir({ recursive: true })`
    - Set hook scripts to permission mode 0o755
    - Overwrite existing files without prompting
    - Throw `FilesystemError` on write failures with target path and cause
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [x] 4.2 Write property tests for Agent4 file writer
    - **Property 7: File writer maps all output fields to correct paths**
    - **Property 8: Filesystem errors wrapped with path and cause**
    - Create `src/__tests__/infrastructure/agent4-file-writer.property.ts`
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.7, 12.5**

  - [x] 4.3 Create src/infrastructure/agent4-mock-loader.ts
    - Implement `Agent4JsonMockLoader` class fulfilling `Agent4MockLoaderPort`
    - Read from configurable path (default `.kiro/mocks/agent4.mock.json`)
    - Parse JSON and validate against `Agent4InputSchema`
    - Throw `FilesystemError` on read failure, `ValidationError` on parse/schema failure
    - _Requirements: 3.2, 11.2, 11.5_

- [x] 5. Create Agent 4 system prompt and mock data
  - [x] 5.1 Create src/config/agent4-system-prompt.ts
    - Define `AGENT4_SYSTEM_PROMPT` constant with multi-section LLM instructions
    - Include sections for Dockerfile Builder (multi-stage, Alpine, non-root, healthcheck), Compose Builder (services, networks, volumes), CI Pipeline Builder (lint, typecheck, test, security, license-check, build, deploy), and Hook Script Builder (validate-specs, scan-secrets)
    - Instruct LLM to output JSON matching `Agent4OutputSchema`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 5.2 Create .kiro/mocks/agent4.mock.json
    - Provide a valid Agent4Output mock that passes schema validation
    - Include a multi-stage Dockerfile with Alpine base, non-root user, healthcheck
    - Include a docker-compose.yml with app + db services, named volumes, dual networks
    - Include a GitHub Actions workflow with all required job stages
    - Include validate-specs.sh and scan-secrets.sh hooks with shebangs
    - _Requirements: 11.2, 11.4_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Wire factory function and public API
  - [x] 7.1 Add createAgent4 factory and exports to src/index.ts
    - Export `CreateAgent4Options` interface with `model?`, `mockPath?`, `mockLlmResponse?` fields
    - Export `createAgent4()` factory function returning a configured `GenerateDevSecOpsSpecUseCase`
    - Use `MockLlmClient` when `mockLlmResponse` is provided, otherwise `VercelAiLlmClient` with configurable model (default "gpt-4o")
    - Configure `Agent4JsonMockLoader` with `mockPath` option (default `.kiro/mocks/agent4.mock.json`)
    - Export Agent4 types, schemas, use case, and port interfaces
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [x] 7.2 Create scripts/demo-agent4.ts
    - Load mock LLM response from `.kiro/mocks/agent4.mock.json`
    - Execute `GenerateDevSecOpsSpecUseCase` in mock mode without API key
    - Print count of generated files and each file's target path relative to `.kiro/`
    - Exit with code 0 on success
    - Print error to stderr and exit with non-zero code on failure (missing mock, parse error, schema failure)
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

- [x] 8. Integration tests
  - [x] 8.1 Write integration tests for the Agent 4 pipeline
    - Create `src/__tests__/integration/agent4-pipeline.test.ts`
    - Test full pipeline with mocked LLM returning known-good output
    - Verify Dockerfile contains multi-stage build, non-root user, healthcheck
    - Verify docker-compose contains services, networks, volumes
    - Verify CI pipeline contains all required job stages with correct dependencies
    - Verify hook scripts start with shebang and contain expected validation patterns
    - Test mock loader fallback path
    - Test error scenarios (invalid input, LLM failure, filesystem error)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 4.1, 4.2, 4.3, 5.1, 5.3, 5.5, 6.1, 6.6, 7.1, 7.5, 7.6, 8.1, 8.4, 8.5_

  - [x] 8.2 Write unit tests for createAgent4 factory and demo script
    - Create `src/__tests__/application/generate-devsecops-spec.test.ts`
    - Test factory with various option combinations (mock mode, real mode, custom path)
    - Test that default model is "gpt-4o"
    - Test that default mock path is `.kiro/mocks/agent4.mock.json`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit and integration tests validate specific examples, edge cases, and LLM output quality
- Existing infrastructure (`VercelAiLlmClient`, `MockLlmClient`, error hierarchy) is reused — no duplication
- The Agent4 system prompt encapsulates all content-generation logic for Dockerfile, Compose, CI, and hook scripts; individual "builders" are prompt sections, not separate code modules

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "2.1"] },
    { "id": 3, "tasks": ["2.2", "4.1", "4.3", "5.1", "5.2"] },
    { "id": 4, "tasks": ["4.2", "7.1"] },
    { "id": 5, "tasks": ["7.2", "8.1", "8.2"] }
  ]
}
```
