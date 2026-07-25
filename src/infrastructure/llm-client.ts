// src/infrastructure/llm-client.ts — Vercel AI SDK LLM adapter implementing LlmPort
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { Agent2OutputSchema } from "../domain/schemas";
import { LlmPort } from "../application/generate-architecture-spec";

export class VercelAiLlmClient implements LlmPort {
  constructor(private readonly model: string = "gpt-4o") {}

  async invoke(systemPrompt: string, userPrompt: string): Promise<unknown> {
    const { object } = await generateObject({
      model: openai(this.model),
      schema: Agent2OutputSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });
    return object;
  }
}
