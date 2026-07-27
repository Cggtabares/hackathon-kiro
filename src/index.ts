// src/index.ts — Programmatic entry point composing all layers

export {
  GenerateArchitectureSpecUseCase,
  type LlmPort,
  type MockLoaderPort,
  type FileWriterPort,
} from "./application/generate-architecture-spec";
export {
  GenerateDevSecOpsSpecUseCase,
  type Agent4MockLoaderPort,
  type Agent4FileWriterPort,
} from "./application/generate-devsecops-spec";
export { VercelAiLlmClient } from "./infrastructure/llm-client";
export { MockLlmClient } from "./infrastructure/mock-llm-client";
export { JsonMockLoader } from "./infrastructure/mock-loader";
export { KiroFileWriter } from "./infrastructure/kiro-file-writer";
export { Agent4JsonMockLoader } from "./infrastructure/agent4-mock-loader";
export { Agent4FileWriter } from "./infrastructure/agent4-file-writer";
export { SYSTEM_PROMPT } from "./config/system-prompt";
export { AGENT4_SYSTEM_PROMPT } from "./config/agent4-system-prompt";
export * from "./domain/types";
export * from "./domain/schemas";
export * from "./domain/errors";

import { GenerateArchitectureSpecUseCase } from "./application/generate-architecture-spec";
import { VercelAiLlmClient } from "./infrastructure/llm-client";
import { MockLlmClient } from "./infrastructure/mock-llm-client";
import { JsonMockLoader } from "./infrastructure/mock-loader";
import { KiroFileWriter } from "./infrastructure/kiro-file-writer";
import { SYSTEM_PROMPT } from "./config/system-prompt";
import { GenerateDevSecOpsSpecUseCase } from "./application/generate-devsecops-spec";
import { Agent4JsonMockLoader } from "./infrastructure/agent4-mock-loader";
import { Agent4FileWriter } from "./infrastructure/agent4-file-writer";
import { AGENT4_SYSTEM_PROMPT } from "./config/agent4-system-prompt";

export interface CreateAgent2Options {
  /** OpenAI model name (default: "gpt-4o"). Ignored when mockLlmResponse is set. */
  model?: string;
  /** Path to agent1 mock file (default: ".kiro/mocks/agent1.mock.json") */
  mockPath?: string;
  /** When provided, skips real LLM calls and returns this response. No API key needed. */
  mockLlmResponse?: unknown;
}

export function createAgent2(options?: CreateAgent2Options) {
  const llm = options?.mockLlmResponse
    ? new MockLlmClient(options.mockLlmResponse)
    : new VercelAiLlmClient(options?.model);
  const mockLoader = new JsonMockLoader(options?.mockPath);
  const fileWriter = new KiroFileWriter();

  return new GenerateArchitectureSpecUseCase(
    llm,
    mockLoader,
    fileWriter,
    SYSTEM_PROMPT,
  );
}

export interface CreateAgent4Options {
  /** OpenAI model name (default: "gpt-4o"). Ignored when mockLlmResponse is set. */
  model?: string;
  /** Path to agent4 mock input file (default: ".kiro/mocks/agent4.mock.json") */
  mockPath?: string;
  /** When provided, skips real LLM calls and returns this response. No API key needed. */
  mockLlmResponse?: unknown;
}

export function createAgent4(options?: CreateAgent4Options) {
  const llm = options?.mockLlmResponse
    ? new MockLlmClient(options.mockLlmResponse)
    : new VercelAiLlmClient(options?.model);
  const mockLoader = new Agent4JsonMockLoader(options?.mockPath);
  const fileWriter = new Agent4FileWriter();

  return new GenerateDevSecOpsSpecUseCase(
    llm,
    mockLoader,
    fileWriter,
    AGENT4_SYSTEM_PROMPT,
  );
}
