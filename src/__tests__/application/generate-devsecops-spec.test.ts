// Unit tests for createAgent4 factory and GenerateDevSecOpsSpecUseCase
// Requirements: 10.1, 10.2, 10.3, 10.4, 10.5

import { describe, it, expect, vi } from "vitest";
import { createAgent4, GenerateDevSecOpsSpecUseCase } from "../../index";

describe("createAgent4 factory", () => {
  it("returns a GenerateDevSecOpsSpecUseCase instance (Requirement 10.1)", () => {
    const agent4 = createAgent4({ mockLlmResponse: {} });
    expect(agent4).toBeInstanceOf(GenerateDevSecOpsSpecUseCase);
  });

  it("uses MockLlmClient when mockLlmResponse is provided (Requirement 10.2)", () => {
    const agent4 = createAgent4({ mockLlmResponse: { some: "data" } });
    expect(agent4).toBeInstanceOf(GenerateDevSecOpsSpecUseCase);
  });

  it("uses VercelAiLlmClient when no mockLlmResponse is provided (Requirement 10.3)", () => {
    const agent4 = createAgent4();
    expect(agent4).toBeInstanceOf(GenerateDevSecOpsSpecUseCase);
  });

  it("accepts custom model option (Requirement 10.3)", () => {
    const agent4 = createAgent4({ model: "gpt-3.5-turbo" });
    expect(agent4).toBeInstanceOf(GenerateDevSecOpsSpecUseCase);
  });

  it("accepts custom mockPath option (Requirement 10.4)", () => {
    const agent4 = createAgent4({
      mockLlmResponse: {},
      mockPath: "custom/path/mock.json",
    });
    expect(agent4).toBeInstanceOf(GenerateDevSecOpsSpecUseCase);
  });

  it("defaults to no options when called without arguments (Requirement 10.5)", () => {
    const agent4 = createAgent4();
    expect(agent4).toBeInstanceOf(GenerateDevSecOpsSpecUseCase);
  });
});

describe("createAgent4 integration with mock LLM", () => {
  it("executes successfully with valid mock LLM response and provided input", async () => {
    const validOutput = {
      dockerfile:
        "FROM node:20-alpine AS builder\nRUN npm ci\nFROM node:20-alpine AS runtime\nCMD [\"node\", \"dist/index.js\"]",
      dockerCompose:
        'version: "3"\nservices:\n  app:\n    image: myapp\n    ports:\n      - "3000:3000"',
      ciPipeline:
        "name: CI\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4",
      hooks: {
        validateSpecs: "#!/bin/bash\necho 'validating specs'",
        scanSecrets: "#!/bin/bash\necho 'scanning secrets'",
      },
    };

    // Directly instantiate the use case with mock ports to avoid disk writes
    const mockLlm = { invoke: vi.fn().mockResolvedValue(validOutput) };
    const mockLoader = { load: vi.fn() };
    const mockFileWriter = { writeAll: vi.fn().mockResolvedValue(undefined) };

    const useCase = new GenerateDevSecOpsSpecUseCase(
      mockLlm,
      mockLoader,
      mockFileWriter,
      "test system prompt",
    );

    const validInput = {
      projectName: "TestProject",
      stack: ["TypeScript", "Node.js"],
      architecturePattern: "Clean",
      securityPolicies: [
        { name: "Zod", description: "Validation", enforcement: "Middleware" },
      ],
      taskList: [
        {
          id: "t1",
          title: "Setup",
          description: "Initial setup",
          dependencies: [],
        },
      ],
      complianceReport: {
        licenseSummary: [{ package: "express", license: "MIT" }],
        regulatoryFlags: [],
      },
    };

    const result = await useCase.execute(validInput);
    expect(result.dockerfile).toContain("FROM");
    expect(result.dockerCompose).toContain("services");
    expect(result.ciPipeline).toContain("jobs");
    expect(result.hooks.validateSpecs).toMatch(/^#!\//);
    expect(result.hooks.scanSecrets).toMatch(/^#!\//);
    expect(mockFileWriter.writeAll).toHaveBeenCalledOnce();
  });
});
