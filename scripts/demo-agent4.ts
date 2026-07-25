#!/usr/bin/env npx tsx
// scripts/demo-agent4.ts — Run Agent 4 locally with mocked LLM (no API key needed)

import { readFile } from "node:fs/promises";
import { createAgent4 } from "../src/index";
import type { Agent4Input } from "../src/domain/types";

async function main() {
  console.log(
    "🔒 Agent 4 — DevSecOps, Quality & Automation Demo (offline mode)\n",
  );

  // Load the pre-built mock LLM response (Agent4Output)
  const mockResponse = JSON.parse(
    await readFile(".kiro/mocks/agent4.mock.json", "utf-8"),
  );

  // Create Agent 4 with mocked LLM — no API key required
  const agent4 = createAgent4({ mockLlmResponse: mockResponse });

  console.log("📥 Preparing demo input...");
  console.log("🤖 Generating DevSecOps artifacts (mocked LLM)...\n");

  // Provide a valid Agent4Input for demo purposes
  const demoInput: Agent4Input = {
    projectName: "KiroSpec Studio",
    stack: ["TypeScript", "Node.js", "Vitest", "PostgreSQL"],
    architecturePattern: "Clean",
    securityPolicies: [
      {
        name: "Zod Validation",
        description: "Input validation on all boundaries",
        enforcement: "Middleware",
      },
      {
        name: "JWT Auth",
        description: "Token-based authentication",
        enforcement: "Guard",
      },
    ],
    taskList: [
      {
        id: "task-1",
        title: "Setup project",
        description: "Initialize project structure",
        dependencies: [],
      },
      {
        id: "task-2",
        title: "Implement domain",
        description: "Create domain types and schemas",
        dependencies: ["task-1"],
      },
    ],
    complianceReport: {
      licenseSummary: [
        { package: "express", license: "MIT" },
        { package: "zod", license: "MIT" },
        { package: "vitest", license: "MIT" },
      ],
      regulatoryFlags: [],
    },
  };

  const result = await agent4.execute(demoInput);

  // List generated files relative to .kiro/
  const files = [
    "Dockerfile",
    "docker-compose.yml",
    ".github/workflows/ci.yml",
    ".kiro/hooks/validate-specs.sh",
    ".kiro/hooks/scan-secrets.sh",
  ];

  console.log(`✅ Agent 4 output generated successfully!\n`);
  console.log(`📦 Generated ${files.length} files:\n`);
  for (const file of files) {
    console.log(`   └── ${file}`);
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message || error);
  process.exit(1);
});
