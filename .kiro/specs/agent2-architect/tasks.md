# Implementation Plan: Agent 2 — Architect Agent

## Overview

Implement Agent 2 (Architect Agent) as a Next.js App Router + TypeScript service following Clean Architecture. The build order follows dependency layers inward-out: Domain (pure types/schemas/errors) → Application (use case + ports) → Infrastructure (mock-loader, LLM client, file writer) → Presentation (API route). Property-based tests validate universal correctness properties; unit tests cover specific examples and edge cases.

## Tasks

- [ ] 1. Project scaffolding and configuration
  - [ ] 1.1 Initialize project with package.json, tsconfig, and dependencies
    - Create `package.json` with dependencies: `next`, `react`, `react-dom`, `zod`, `ai`, `@ai-sdk/openai`
    - Dev dependencies: `vitest`, `fast-check`, `typescript`, `@types/node`, `@types/react`
    - Create `tsconfig.json` with strict mode, path aliases (`@/` → `src/`)
    - _Requirements: N/A (scaffolding)_

  - [ ] 1.2 Configure Vitest with property test support
    - Create `vitest.config.ts` matching the design's test configuration
    - Include patterns: `src/**/*.test.ts`, `src/**/*.property.ts`
    - Configure v8 coverage for `src/domain/**`, `src/application/**`, `src/infrastructure/**`
    - _Requirements: N/A (scaffolding)_

- [ ] 2. Domain layer — types, schemas, and errors
  - [ ] 2.1 Create domain type definitions
    - Create `src/domain/types.ts` with all interfaces: `Agent1Output`, `ExpectedMetrics`, `TechSteering`, `SolidBoundary`, `SecurityGuard`, `DesignOutput`, `DomainEntity`, `EntityProperty`, `IamPolicy`, `CostProjection`, `ServiceCost`, `TaskItem`, `Agent2Output`, `GenerateSpecOptions`
    - Pure TypeScript — no runtime dependencies except Zod inferred types
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

  - [ ] 2.2 Create Zod schema definitions
    - Create `src/domain/schemas.ts` with all schemas: `ExpectedMetricsSchema`, `Agent1OutputSchema`, `TechSteeringSchema`, `RequirementsSchema`, `DesignSchema`, `TasksSchema`, `Agent2OutputSchema`
    - Each schema must enforce `.min(1)` on required strings, `.positive()` on metrics, `.min(1)` on arrays where at least one item is required
    - Export the unified `Agent2OutputSchema` combining all section schemas
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

  - [ ] 2.3 Create typed error hierarchy
    - Create `src/domain/errors.ts` with `Agent2Error` base class, `ValidationError`, `LlmError`, `FilesystemError`
    - `Agent2Error` carries `category`, `operation`, and `context` fields
    - `ValidationError` carries `fieldPath`, `expectedType`, `receivedValue`
    - `LlmError` carries `isTransient` boolean for retry classification
    - `FilesystemError` carries `targetPath` and wraps the underlying cause
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ]\* 2.4 Write property tests for schema validation (Properties 1, 2, 6)
    - **Property 1: Schema validation rejects invalid objects with correct error paths**
    - **Property 2: Valid Agent2Output round-trip through schema**
    - **Property 6: Task dependencies form a valid topological order**
    - Create `src/__tests__/domain/schemas.property.ts`
    - Use fast-check arbitraries to generate valid and invalid Agent2Output objects
    - Verify: invalid objects produce errors with correct field paths; valid objects round-trip unchanged; task dependency arrays only reference earlier IDs
    - **Validates: Requirements 1.4, 2.1, 2.3, 2.4, 2.5, 2.6, 6.5**

  - [ ]\* 2.5 Write unit tests for schemas and errors
    - Create `src/__tests__/domain/schemas.test.ts` with specific examples of valid/invalid objects
    - Create `src/__tests__/domain/errors.test.ts` verifying error construction and field values
    - Test edge cases: empty strings, zero metrics, missing nested fields
    - _Requirements: 2.5, 5.4_

- [ ] 3. Checkpoint — Domain layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Application layer — use case and port interfaces
  - [ ] 4.1 Create the GenerateArchitectureSpec use case
    - Create `src/application/generate-architecture-spec.ts`
    - Define port interfaces: `LlmPort`, `MockLoaderPort`, `FileWriterPort`
    - Implement the `GenerateArchitectureSpecUseCase` class with `execute(options)` method
    - Implement input validation → prompt building → LLM invocation → output validation → file write pipeline
    - Map Zod errors to `ValidationError` (first issue's path and message)
    - Classify LLM errors as transient (timeout, ECONNRESET, 503) or permanent
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.2, 5.3_

  - [ ] 4.2 Create the system prompt constant
    - Create `src/config/system-prompt.ts`
    - Include instructions for Clean Architecture, Zod validation, EARS syntax, AWS cost projections, and sequential task ordering
    - _Requirements: 3.1_

  - [ ]\* 4.3 Write property test for input validation precedence (Property 4)
    - **Property 4: Input validation precedes LLM invocation**
    - Create `src/__tests__/application/generate-architecture-spec.property.ts`
    - Use fast-check to generate arbitrary invalid Agent1Output objects
    - Mock LlmPort and verify it is NEVER called when input validation fails
    - **Validates: Requirements 5.1, 5.2**

  - [ ]\* 4.4 Write unit tests for the use case
    - Create `src/__tests__/application/generate-architecture-spec.test.ts`
    - Test happy path with mocked LLM returning valid output
    - Test mock fallback when no agent1Output is provided
    - Test preferredStack parameter inclusion in prompt
    - Test LLM error classification (transient vs permanent)
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ] 5. Checkpoint — Application layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Infrastructure layer — adapters
  - [ ] 6.1 Implement the mock loader
    - Create `src/infrastructure/mock-loader.ts` implementing `MockLoaderPort`
    - Read from `.kiro/mocks/agent1.mock.json` by default (configurable path)
    - Validate loaded JSON against `Agent1OutputSchema`
    - Throw `ValidationError` with field path if mock is malformed
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 6.2 Implement the LLM client adapter
    - Create `src/infrastructure/llm-client.ts` implementing `LlmPort`
    - Use Vercel AI SDK `generateObject` with `Agent2OutputSchema` for structured output
    - Configure model (default `gpt-4o`, configurable)
    - _Requirements: 3.2_

  - [ ] 6.3 Implement the Kiro file writer
    - Create `src/infrastructure/kiro-file-writer.ts` implementing `FileWriterPort`
    - Build file mappings: tech steering → `steering/tech.md`, requirements → `specs/requirements.md`, design → `specs/design.md`, tasks → `specs/tasks.md`
    - Create directories recursively before writing
    - Throw `FilesystemError` with target path on write failure
    - Implement markdown formatters for tech steering, design, and tasks
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]\* 6.4 Write property test for file writer content preservation (Property 3)
    - **Property 3: File writer preserves all output content**
    - Create `src/__tests__/infrastructure/kiro-file-writer.property.ts`
    - Use fast-check to generate valid Agent2Output objects
    - Write to a temp directory, read files back, verify content contains all original data
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [ ]\* 6.5 Write unit tests for infrastructure adapters
    - Create `src/__tests__/infrastructure/mock-loader.test.ts` — test valid load, missing file, malformed JSON
    - Create `src/__tests__/infrastructure/kiro-file-writer.test.ts` — test directory creation, write success, write failure
    - _Requirements: 1.1, 1.4, 4.5, 4.6_

- [ ] 7. Checkpoint — Infrastructure layer complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Presentation layer and mock data
  - [ ] 8.1 Create the mock data file
    - Create `.kiro/mocks/agent1.mock.json` with realistic sample data
    - Include all required fields: projectName, productVision, targetAudience, valueProposition, mvpFeatures, expectedMetrics (mvpMonthlyUsers, scaleMonthlyUsers, peakConcurrentConnections)
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ] 8.2 Implement the Next.js API route
    - Create `src/presentation/api/generate-spec/route.ts` (App Router route handler)
    - Accept POST with optional `agent1Output` and `preferredStack` in request body
    - Wire up use case with infrastructure adapters
    - Return JSON response with Agent2Output on success
    - Return structured error responses with appropriate HTTP status codes (400 for validation, 502 for LLM transient, 500 for permanent)
    - _Requirements: 3.2, 3.3, 3.4_

- [ ]\* 9. Write property test for error context propagation (Property 5)
  - **Property 5: All errors carry contextual information**
  - Create `src/__tests__/errors.property.ts`
  - Use fast-check to generate arbitrary error scenarios (validation, LLM, filesystem)
  - Verify every thrown error includes `operation` and `context` fields
  - **Validates: Requirements 5.4**

- [ ] 10. Integration wiring and end-to-end verification
  - [ ] 10.1 Wire all layers together and verify end-to-end flow
    - Create `src/index.ts` as programmatic entry point composing all layers
    - Verify the full pipeline: mock load → input validation → prompt build → (mocked) LLM → output validation → file write
    - _Requirements: 3.2, 3.3, 4.1, 4.2, 4.3, 4.4_

  - [ ]\* 10.2 Write integration tests
    - Create `src/__tests__/integration/pipeline.test.ts`
    - Test happy path with mocked LLM returning deterministic JSON
    - Test mock fallback path (no agent1Output provided)
    - Test validation failure path (invalid LLM response)
    - Verify files are written to expected paths with expected content
    - _Requirements: 1.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 4.4_

- [ ] 11. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1"],
      "description": "Project scaffolding and configuration"
    },
    {
      "wave": 2,
      "tasks": ["2"],
      "description": "Domain layer — types, schemas, errors"
    },
    { "wave": 3, "tasks": ["3"], "description": "Checkpoint — Domain layer" },
    {
      "wave": 4,
      "tasks": ["4"],
      "description": "Application layer — use case and ports"
    },
    {
      "wave": 5,
      "tasks": ["5"],
      "description": "Checkpoint — Application layer"
    },
    {
      "wave": 6,
      "tasks": ["6"],
      "description": "Infrastructure layer — adapters"
    },
    {
      "wave": 7,
      "tasks": ["7"],
      "description": "Checkpoint — Infrastructure layer"
    },
    {
      "wave": 8,
      "tasks": ["8", "9"],
      "description": "Presentation layer, mock data, and error property test"
    },
    {
      "wave": 9,
      "tasks": ["10"],
      "description": "Integration wiring and end-to-end verification"
    },
    { "wave": 10, "tasks": ["11"], "description": "Final checkpoint" }
  ]
}
```

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation between architectural layers
- Property tests validate universal correctness properties from the design document (Properties 1–6)
- Unit tests validate specific examples, edge cases, and error conditions
- The mock-first approach means Agent 2 is fully testable without Agent 1 or a real LLM running
- fast-check property tests run minimum 100 iterations each
