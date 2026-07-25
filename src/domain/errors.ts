// src/domain/errors.ts — Typed error hierarchy for Agent 2

export type ErrorCategory =
  | "VALIDATION"
  | "LLM_TRANSIENT"
  | "LLM_PERMANENT"
  | "FILESYSTEM";

export class Agent2Error extends Error {
  constructor(
    message: string,
    public readonly category: ErrorCategory,
    public readonly operation: string,
    public readonly context: Record<string, unknown>,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = "Agent2Error";
  }
}

export class ValidationError extends Agent2Error {
  constructor(
    public readonly fieldPath: string,
    public readonly expectedType: string,
    public readonly receivedValue: unknown,
    operation: string,
  ) {
    super(
      `Validation failed at "${fieldPath}": expected ${expectedType}`,
      "VALIDATION",
      operation,
      { fieldPath, expectedType, receivedValue },
    );
    this.name = "ValidationError";
  }
}

export class LlmError extends Agent2Error {
  constructor(
    message: string,
    public readonly isTransient: boolean,
    operation: string,
    context: Record<string, unknown>,
    cause?: Error,
  ) {
    super(
      message,
      isTransient ? "LLM_TRANSIENT" : "LLM_PERMANENT",
      operation,
      context,
      cause,
    );
    this.name = "LlmError";
  }
}

export class FilesystemError extends Agent2Error {
  constructor(
    public readonly targetPath: string,
    operation: string,
    cause: Error,
  ) {
    super(
      `Filesystem error at "${targetPath}": ${cause.message}`,
      "FILESYSTEM",
      operation,
      { targetPath },
      cause,
    );
    this.name = "FilesystemError";
  }
}
