#!/usr/bin/env npx tsx
// scripts/demo.ts — Run Agent 2 locally with mocked LLM (no API key needed)

import { readFile } from "node:fs/promises";
import { createAgent2 } from "../src/index";

async function main() {
  console.log("🏗️  Agent 2 — Software Architect Demo (offline mode)\n");

  // Load the pre-built mock LLM response
  const mockResponse = JSON.parse(
    await readFile(".kiro/mocks/agent2.mock-response.json", "utf-8"),
  );

  // Create Agent 2 with mocked LLM — no API key required
  const agent2 = createAgent2({ mockLlmResponse: mockResponse });

  console.log("📥 Loading Agent 1 mock input...");
  console.log("🤖 Generating architecture specification (mocked LLM)...");

  const result = await agent2.execute();

  console.log("\n✅ Agent 2 output generated successfully!\n");
  console.log(`📋 Stack: ${result.techSteering.stack.join(", ")}`);
  console.log(`🏛️  Architecture: ${result.techSteering.architecturePattern}`);
  console.log(
    `📝 Requirements: ${result.requirements.split("\n").length} lines`,
  );
  console.log(`🗂️  Domain entities: ${result.design.domainEntities.length}`);
  console.log(
    `💰 MVP cost: $${result.design.awsCostProjection.mvpMonthlyCostUsd.reduce((s, c) => s + c.monthlyCostUsd, 0).toFixed(2)}/mo`,
  );
  console.log(
    `💰 Scale cost: $${result.design.awsCostProjection.scaleMonthlyCostUsd.reduce((s, c) => s + c.monthlyCostUsd, 0).toFixed(2)}/mo`,
  );
  console.log(`📦 Tasks: ${result.tasks.length}`);
  console.log("\n📁 Files written to .kiro/:");
  console.log("   └── steering/tech.md");
  console.log("   └── specs/requirements.md");
  console.log("   └── specs/design.md");
  console.log("   └── specs/tasks.md");
}

main().catch(console.error);
