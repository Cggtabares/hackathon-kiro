// src/domain/types.ts — Pure TypeScript interfaces (no runtime dependencies except Zod inferred types)

export interface ExpectedMetrics {
  mvpMonthlyUsers: number;
  scaleMonthlyUsers: number;
  peakConcurrentConnections: number;
}

export interface Agent1Output {
  projectName: string;
  productVision: string;
  targetAudience: string;
  valueProposition: string;
  mvpFeatures: string[];
  expectedMetrics: ExpectedMetrics;
}

export interface SolidBoundary {
  principle: string;
  rule: string;
  layer: string;
}

export interface SecurityGuard {
  name: string;
  description: string;
  enforcement: string;
}

export interface TechSteering {
  stack: string[];
  architecturePattern: "Clean" | "Hexagonal";
  solidBoundaries: SolidBoundary[];
  securityGuards: SecurityGuard[];
}

export interface EntityProperty {
  name: string;
  type: string;
  required: boolean;
}

export interface DomainEntity {
  name: string;
  properties: EntityProperty[];
  relationships: string[];
}

export interface IamPolicy {
  service: string;
  actions: string[];
  resource: string;
  effect: "Allow" | "Deny";
}

export interface ServiceCost {
  service: string;
  monthlyCostUsd: number;
}

export interface CostProjection {
  mvpMonthlyCostUsd: ServiceCost[];
  scaleMonthlyCostUsd: ServiceCost[];
}

export interface DesignOutput {
  domainEntities: DomainEntity[];
  mermaidDiagram: string;
  iamPolicySummary: IamPolicy[];
  awsCostProjection: CostProjection;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
}

export interface Agent2Output {
  techSteering: TechSteering;
  requirements: string;
  design: DesignOutput;
  tasks: TaskItem[];
}

export interface GenerateSpecOptions {
  agent1Output?: Agent1Output;
  preferredStack?: string[];
}
