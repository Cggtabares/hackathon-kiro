// src/presentation/api/generate-spec/route.ts — Next.js App Router POST handler
import { NextRequest, NextResponse } from "next/server";
import { GenerateArchitectureSpecUseCase } from "../../../application/generate-architecture-spec";
import { VercelAiLlmClient } from "../../../infrastructure/llm-client";
import { JsonMockLoader } from "../../../infrastructure/mock-loader";
import { KiroFileWriter } from "../../../infrastructure/kiro-file-writer";
import { SYSTEM_PROMPT } from "../../../config/system-prompt";
import { Agent2Error } from "../../../domain/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { agent1Output, preferredStack } = body as {
      agent1Output?: unknown;
      preferredStack?: string[];
    };

    const llm = new VercelAiLlmClient();
    const mockLoader = new JsonMockLoader();
    const fileWriter = new KiroFileWriter();

    const useCase = new GenerateArchitectureSpecUseCase(
      llm,
      mockLoader,
      fileWriter,
      SYSTEM_PROMPT,
    );

    const result = await useCase.execute({
      agent1Output: agent1Output as any,
      preferredStack,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Agent2Error) {
      switch (error.category) {
        case "VALIDATION":
          return NextResponse.json(
            {
              error: error.message,
              category: error.category,
              operation: error.operation,
              context: error.context,
            },
            { status: 400 },
          );
        case "LLM_TRANSIENT":
          return NextResponse.json(
            {
              error: error.message,
              category: error.category,
              operation: error.operation,
              context: error.context,
            },
            { status: 502 },
          );
        case "LLM_PERMANENT":
        case "FILESYSTEM":
          return NextResponse.json(
            {
              error: error.message,
              category: error.category,
              operation: error.operation,
              context: error.context,
            },
            { status: 500 },
          );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
