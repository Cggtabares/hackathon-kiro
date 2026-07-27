# Requirements Document

## Introduction

Agent 4 (DevSecOps, Quality & Automation Engineer) is the final stage of the KiroSpec Studio pipeline. It consumes validated outputs from Agent 1 (product vision), Agent 2 (architecture specs, tech steering, tasks), and Agent 3 (compliance requirements), and generates a production-ready development environment including Docker configurations, CI/CD pipelines, and security hooks. The system follows Clean Architecture principles with Zod schema validation on all boundaries, consistent with the established Agent 2 patterns.

## Glossary

- **Agent_4**: The DevSecOps automation agent that reads prior agent outputs and generates infrastructure, CI/CD, and security hook files
- **Agent4_Input**: A composite object aggregating validated outputs from Agent 1 (product steering), Agent 2 (tech steering, design, tasks), and Agent 3 (compliance report)
- **Agent4_Output**: The validated output object produced by Agent 4 containing Dockerfile, docker-compose.yml, CI pipeline, and hook scripts as string content
- **Dockerfile_Builder**: The component responsible for generating a multi-stage Docker build file adapted to the stack defined in the tech steering
- **Compose_Builder**: The component responsible for generating a docker-compose.yml with services, volumes, and networking for local development
- **CI_Pipeline_Builder**: The component responsible for generating a GitHub Actions CI/CD workflow with lint, test, security, license, build, and deploy stages
- **Hook_Script_Builder**: The component responsible for generating shell scripts for spec validation and secret scanning
- **LLM_Port**: The port interface for invoking the language model with a system prompt and user prompt
- **File_Writer_Port**: The port interface for persisting generated Agent 4 output files to disk
- **Mock_Loader_Port**: The port interface for loading fallback mock data representing aggregated Agent 1, 2, and 3 outputs
- **Zod_Validator**: The schema validation layer that enforces structural correctness on Agent 4 input and output
- **Tech_Steering**: The technology stack, architecture pattern, SOLID boundaries, and security policies defined by Agent 2
- **Compliance_Report**: The legal and compliance analysis output from Agent 3 including license audit results and regulatory requirements
- **Validate_Specs_Hook**: A shell script that validates spec file consistency, EARS syntax, Mermaid diagrams, and task dependency order
- **Scan_Secrets_Hook**: A shell script that scans staged files for accidentally committed API keys, tokens, and private keys

## Requirements

### Requirement 1: Agent 4 Input Schema and Validation

**User Story:** As a developer, I want strict Zod schemas for Agent 4 input that validates the combined outputs from Agents 1, 2, and 3, so that Agent 4 only processes structurally correct upstream data.

#### Acceptance Criteria

1. THE Zod_Validator SHALL validate an Agent4InputSchema requiring all of the following fields: a projectName string (1–128 characters), a stack array of strings (each 1–64 characters, minimum 1 entry, maximum 20 entries), an architecturePattern string constrained to allowed values, a securityPolicies array (minimum 1 entry) where each element contains a name string, a description string, and an enforcement string (each 1–256 characters), a taskList array of task objects (minimum 1 entry, maximum 200 entries), and a complianceReport object
2. THE Zod_Validator SHALL require each task object in the taskList array to contain an id string (1–64 characters), a title string (1–256 characters), a description string (1–1024 characters), and a dependencies array of strings (each 1–64 characters, maximum 50 entries)
3. THE Zod_Validator SHALL require the complianceReport object to contain a licenseSummary array (minimum 1 entry) where each element contains a package string and a license string, and a regulatoryFlags array where each element is a non-empty string
4. IF Agent4_Input validation fails, THEN THE Agent_4 SHALL throw a ValidationError containing the invalid field path, the expected type, and the received value
5. IF any string field in Agent4_Input contains only whitespace, THEN THE Zod_Validator SHALL reject the input with a validation failure identifying the affected field path

### Requirement 2: Agent 4 Output Schema and Validation

**User Story:** As a developer, I want strict Zod schemas for Agent 4 output, so that generated infrastructure files are structurally validated before being written to disk.

#### Acceptance Criteria

1. THE Zod_Validator SHALL validate an Agent4OutputSchema containing dockerfile (string), dockerCompose (string), ciPipeline (string), and hooks object with validateSpecs (string) and scanSecrets (string) fields
2. WHEN validating the dockerfile field, THE Zod_Validator SHALL require a non-empty string of at least 20 characters that contains at least two occurrences of the keyword "FROM" (indicating a multi-stage build)
3. WHEN validating the dockerCompose field, THE Zod_Validator SHALL require a non-empty string of at least 20 characters that contains the keyword "services" (indicating a YAML service definition block)
4. WHEN validating the ciPipeline field, THE Zod_Validator SHALL require a non-empty string of at least 20 characters that contains the keyword "jobs" (indicating a GitHub Actions workflow structure)
5. WHEN validating the hooks object, THE Zod_Validator SHALL require both validateSpecs and scanSecrets to be non-empty strings of at least 10 characters that each start with a shebang line ("#!/")
6. IF Agent4_Output validation fails, THEN THE Zod_Validator SHALL throw a ValidationError containing the fieldPath identifying the invalid field, the expectedType describing the violated constraint, and the receivedValue that failed validation

### Requirement 3: GenerateDevSecOpsSpec Use Case

**User Story:** As a developer, I want a use case class that orchestrates the Agent 4 pipeline (load input, invoke LLM, validate output, write files), so that all DevSecOps artifacts are generated in a single coordinated operation.

#### Acceptance Criteria

1. WHEN the GenerateDevSecOpsSpecUseCase execute method is called with Agent4_Input, THE Agent_4 SHALL validate the input against the Agent4InputSchema, invoke the LLM_Port with the system prompt and a user prompt derived from the validated input, validate the LLM response against the Agent4OutputSchema, write files via the File_Writer_Port, and return the validated Agent4Output
2. IF the GenerateDevSecOpsSpecUseCase execute method is called without Agent4_Input, THEN THE Agent_4 SHALL load fallback data from the Mock_Loader_Port, validate it against the Agent4InputSchema, and continue through the same LLM invocation, output validation, and file writing steps as criterion 1
3. IF the LLM_Port invocation returns output that fails Agent4OutputSchema validation, THEN THE Agent_4 SHALL throw a typed ValidationError containing the first failing field path and the expected constraint that was violated
4. IF the LLM_Port throws an error whose message contains "timeout", "ECONNRESET", or "503", THEN THE Agent_4 SHALL throw a typed LlmError with isTransient set to true; for all other LLM_Port errors THE Agent_4 SHALL throw a typed LlmError with isTransient set to false
5. THE GenerateDevSecOpsSpecUseCase SHALL accept LLM_Port, Mock_Loader_Port, File_Writer_Port, and a system prompt string as constructor dependencies
6. IF the File_Writer_Port throws an error during file writing, THEN THE Agent_4 SHALL throw a typed FilesystemError containing the target path and the underlying error cause

### Requirement 4: Dockerfile Generation

**User Story:** As a developer, I want Agent 4 to generate a multi-stage Dockerfile optimized for the selected stack, so that the project has a secure, minimal production container image.

#### Acceptance Criteria

1. WHEN the stack includes a Node.js framework, THE Dockerfile_Builder SHALL generate a multi-stage Dockerfile with separate dependency-install, build, and runtime stages, using an Alpine-based Node.js image as the base for each stage
2. WHEN generating the runtime stage, THE Dockerfile_Builder SHALL configure a non-root user with a numeric UID of 1001 or higher for running the application process
3. WHEN generating the Dockerfile, THE Dockerfile_Builder SHALL include a HEALTHCHECK instruction targeting the `/health` endpoint with an interval of 30 seconds, a timeout of 5 seconds, a start period of 10 seconds, and a maximum of 3 retries
4. WHEN generating the final runtime stage, THE Dockerfile_Builder SHALL copy only the compiled output directory and production node_modules, excluding devDependencies, source files, and test files
5. IF the stack does not include a Node.js framework, THEN THE Dockerfile_Builder SHALL generate a multi-stage Dockerfile using the appropriate language-specific slim or Alpine base image for the detected stack

### Requirement 5: Docker Compose Generation

**User Story:** As a developer, I want Agent 4 to generate a docker-compose.yml for local development, so that the full service stack can be started with a single command.

#### Acceptance Criteria

1. WHEN the stack includes a database technology (PostgreSQL or MongoDB), THE Compose_Builder SHALL generate a docker-compose.yml containing an application service and a database service using the official Docker image for the selected database technology
2. IF the stack does not include any database technology, THEN THE Compose_Builder SHALL generate a docker-compose.yml containing only the application service without a database service
3. WHEN generating the application service, THE Compose_Builder SHALL configure a bind-mount volume mapping the project source directory into the container working directory and expose at least one host port mapped to the application's listening port
4. WHEN generating service definitions that include a database, THE Compose_Builder SHALL configure a named volume attached to the database service's data directory so that stored data persists across container stop and restart cycles
5. WHEN generating the compose file with both application and database services, THE Compose_Builder SHALL define at least two Docker networks and attach the application service to both networks while attaching the database service only to the backend network, so that the application can reach the database but the database is not exposed on the frontend network

### Requirement 6: CI/CD Pipeline Generation

**User Story:** As a developer, I want Agent 4 to generate a GitHub Actions CI/CD workflow that includes linting, testing, security scanning, license checks, building, and deployment stages, so that code quality is enforced on every push.

#### Acceptance Criteria

1. WHEN generating the CI pipeline, THE CI_Pipeline_Builder SHALL produce a GitHub Actions workflow YAML with distinct lint, typecheck, test, security, license-check, build, and deploy job stages triggered on push and pull_request events to the main branch
2. WHEN the compliance report includes license audit results, THE CI_Pipeline_Builder SHALL include a license-check job that validates dependency licenses against the allowed list extracted from the complianceReport licenseSummary
3. WHEN generating the security job, THE CI_Pipeline_Builder SHALL include steps for static analysis security testing and secret detection, and the job SHALL fail if any critical or high severity finding is reported
4. WHEN generating the test job, THE CI_Pipeline_Builder SHALL configure the job to run the project test suite using the test runner specified in the tech steering stack (e.g., vitest for Node.js/TypeScript projects)
5. WHEN generating the deploy job, THE CI_Pipeline_Builder SHALL configure deployment to trigger only on pushes to the main branch by using a conditional expression (if: github.ref == 'refs/heads/main' && github.event_name == 'push')
6. THE CI_Pipeline_Builder SHALL define job dependency ordering such that build depends on lint, typecheck, and test passing; and deploy depends on build and security passing

### Requirement 7: Spec Validation Hook Script

**User Story:** As a developer, I want Agent 4 to generate a validate-specs.sh hook script, so that spec file consistency is checked automatically before commits.

#### Acceptance Criteria

1. WHEN generating the validate-specs hook, THE Hook_Script_Builder SHALL produce a shell script that verifies the following files exist: `.kiro/steering/product.md`, `.kiro/steering/tech.md`, `.kiro/specs/requirements.md`, `.kiro/specs/design.md`, `.kiro/specs/tasks.md`, and `.kiro/specs/compliance.md`
2. WHEN generating the validate-specs hook, THE Hook_Script_Builder SHALL include a check that validates each requirement section in requirements.md contains at least one EARS keyword (WHEN, WHILE, WHERE, IF, THE, SHALL) and that every requirement contains the keyword SHALL
3. WHEN generating the validate-specs hook, THE Hook_Script_Builder SHALL include a check that validates each Mermaid code block in design.md begins with a recognized diagram type keyword (graph, sequenceDiagram, classDiagram, flowchart, erDiagram, stateDiagram)
4. WHEN generating the validate-specs hook, THE Hook_Script_Builder SHALL include a check that validates every task dependency ID in tasks.md references a task ID that is defined earlier in document order within the same file
5. IF all validation checks pass, THEN THE Validate_Specs_Hook SHALL exit with status code 0 and print no error output
6. IF any validation check fails, THEN THE Validate_Specs_Hook SHALL exit with a non-zero status code and print an error message that includes the name of the failing check and the file path that caused the failure

### Requirement 8: Secret Scanner Hook Script

**User Story:** As a developer, I want Agent 4 to generate a scan-secrets.sh hook script, so that accidentally committed API keys, tokens, and private keys are detected before they reach the repository.

#### Acceptance Criteria

1. WHEN generating the scan-secrets hook, THE Hook_Script_Builder SHALL produce a shell script that scans staged files for secret patterns including: strings prefixed with known API key identifiers (e.g., AKIA, sk_live_, ghp_), bearer/access token assignments, and variables named password, secret, or api_key assigned to literal string values
2. WHEN generating the scan-secrets hook, THE Hook_Script_Builder SHALL include detection patterns for private key headers (RSA, SSH, PGP) identified by their BEGIN marker lines (e.g., "-----BEGIN RSA PRIVATE KEY-----") in staged content
3. WHEN generating the scan-secrets hook, THE Hook_Script_Builder SHALL include detection of .env files being staged where any line contains a key=value assignment in which the value is non-empty and does not match common placeholder patterns such as "CHANGE_ME", "TODO", "your-*-here", or empty quotes
4. IF the scanner detects a potential secret in staged files, THEN THE Scan_Secrets_Hook SHALL block the commit by exiting with a non-zero status code and printing each finding on a separate line containing the file path and the matched pattern name
5. IF the scanner completes scanning all staged files and detects no secrets, THEN THE Scan_Secrets_Hook SHALL exit with status code 0 and print no error output
6. WHEN generating the scan-secrets hook, THE Hook_Script_Builder SHALL support an allowlist file at a path configurable via an environment variable (defaulting to .kiro/hooks/scan-secrets-allowlist.txt), where each non-empty non-comment line specifies a file path or grep-compatible pattern to suppress from detection
7. IF the configured allowlist file does not exist, THEN THE Scan_Secrets_Hook SHALL proceed with scanning without suppressing any matches and without producing an error

### Requirement 9: File Writer for Agent 4 Output

**User Story:** As a developer, I want a file writer that persists all Agent 4 generated files to the correct project locations, so that infrastructure and hook files are placed where tools expect them.

#### Acceptance Criteria

1. WHEN the File_Writer_Port receives an Agent4_Output where all content fields (dockerfile, dockerCompose, ciPipeline, validateSpecs, scanSecrets) are non-empty strings, THE File_Writer_Port SHALL write the dockerfile content to `Dockerfile` in the project root encoded as UTF-8
2. WHEN the File_Writer_Port receives a valid Agent4_Output, THE File_Writer_Port SHALL write the dockerCompose content to `docker-compose.yml` in the project root encoded as UTF-8
3. WHEN the File_Writer_Port receives a valid Agent4_Output, THE File_Writer_Port SHALL write the ciPipeline content to `.github/workflows/ci.yml` encoded as UTF-8
4. WHEN the File_Writer_Port receives a valid Agent4_Output, THE File_Writer_Port SHALL write the validateSpecs hook content to `.kiro/hooks/validate-specs.sh` with POSIX permission mode 0o755 and encoded as UTF-8
5. WHEN the File_Writer_Port receives a valid Agent4_Output, THE File_Writer_Port SHALL write the scanSecrets hook content to `.kiro/hooks/scan-secrets.sh` with POSIX permission mode 0o755 and encoded as UTF-8
6. IF a target directory does not exist at write time, THEN THE File_Writer_Port SHALL create the full directory structure recursively before writing the file
7. IF the File_Writer_Port encounters a filesystem write error (permission denied, disk full, or I/O failure), THEN THE File_Writer_Port SHALL throw a FilesystemError identifying the target path and underlying cause
8. WHEN a target file already exists at the destination path, THE File_Writer_Port SHALL overwrite the existing file content without prompting

### Requirement 10: Factory Function and Public API

**User Story:** As a developer, I want a createAgent4() factory function exported from src/index.ts, so that Agent 4 can be instantiated with sensible defaults or custom configuration in a single call.

#### Acceptance Criteria

1. THE Agent_4 SHALL export a createAgent4 factory function from src/index.ts that accepts an optional CreateAgent4Options object and returns a configured GenerateDevSecOpsSpecUseCase instance wired with an LlmPort, MockLoaderPort, FileWriterPort, and system prompt
2. WHEN createAgent4 is called with a mockLlmResponse option, THE Agent_4 SHALL use a MockLlmClient returning the provided response instead of invoking a real LLM
3. WHEN createAgent4 is called without a mockLlmResponse option, THE Agent_4 SHALL use the VercelAiLlmClient configured with the model option value if provided, or "gpt-4o" as the default model
4. WHEN createAgent4 is called with a mockPath option, THE Agent_4 SHALL configure the MockLoaderPort implementation to load from the specified file path
5. WHEN createAgent4 is called without a mockPath option, THE Agent_4 SHALL default to loading mocks from `.kiro/mocks/agent4.mock.json`
6. THE Agent_4 SHALL export the CreateAgent4Options interface from src/index.ts so that consumers can reference the options type directly

### Requirement 11: Demo Script with Mocked Pipeline

**User Story:** As a developer, I want a demo script and corresponding mock data file, so that Agent 4 can be demonstrated offline without an LLM API key.

#### Acceptance Criteria

1. THE Agent_4 SHALL provide a scripts/demo-agent4.ts script that executes the GenerateDevSecOpsSpecUseCase in mock mode without requiring an API key
2. WHEN the demo script executes, THE Agent_4 SHALL load a pre-built mock LLM response from `.kiro/mocks/agent4.mock.json` and pass it to the use case via the mock LLM client, bypassing any real LLM invocation
3. WHEN the demo script completes successfully, THE Agent_4 SHALL print to the console the count of generated files and each file's target path relative to the `.kiro/` directory, then exit with code 0
4. THE Agent_4 SHALL provide a `.kiro/mocks/agent4.mock.json` file containing a structure that passes Agent4_Output Zod schema validation without modification
5. IF the mock file at `.kiro/mocks/agent4.mock.json` is missing or fails JSON parsing or Zod schema validation, THEN THE Agent_4 demo script SHALL print an error message indicating the failure reason to stderr and exit with a non-zero exit code

### Requirement 12: Error Hierarchy for Agent 4

**User Story:** As a developer, I want Agent 4 to use the existing typed error hierarchy (ValidationError, LlmError, FilesystemError), so that error handling is consistent across all agents in the pipeline.

#### Acceptance Criteria

1. WHEN Zod schema parsing fails for either the incoming Agent4Input or the LLM-produced Agent4Output, THE Agent_4 SHALL throw a ValidationError with the failing field path, the expected constraint description, the received value, and an operation string identifying the validation stage ("input-validation" or "output-validation")
2. WHEN the LLM invocation fails due to a transient error (timeout, connection reset, or HTTP 503), THE Agent_4 SHALL throw an LlmError with isTransient set to true, the operation context, and the original error preserved as cause
3. WHEN the LLM invocation fails due to a permanent error (invalid API key, HTTP 401, or HTTP 403), THE Agent_4 SHALL throw an LlmError with isTransient set to false, the operation context, and the original error preserved as cause
4. IF the LLM invocation fails with an error that does not match any listed transient pattern, THEN THE Agent_4 SHALL throw an LlmError with isTransient set to false
5. WHEN a filesystem operation fails during file writing, THE Agent_4 SHALL throw a FilesystemError with the absolute target path of the failed file and the underlying OS error preserved as the cause property
