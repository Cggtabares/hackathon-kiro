// src/domain/schemas.ts — Zod schema definitions for all domain types
import { z } from "zod";

export const ExpectedMetricsSchema = z.object({
  mvpMonthlyUsers: z.number().positive(),
  scaleMonthlyUsers: z.number().positive(),
  peakConcurrentConnections: z.number().positive(),
});

export const Agent1OutputSchema = z.object({
  projectName: z.string().min(1),
  productVision: z.string().min(1),
  targetAudience: z.string().min(1),
  valueProposition: z.string().min(1),
  mvpFeatures: z.array(z.string().min(1)).min(1),
  expectedMetrics: ExpectedMetricsSchema,
});

export const SolidBoundarySchema = z.object({
  principle: z.string().min(1),
  rule: z.string().min(1),
  layer: z.string().min(1),
});

export const SecurityGuardSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  enforcement: z.string().min(1),
});

export const TechSteeringSchema = z.object({
  stack: z.array(z.string().min(1)).min(1),
  architecturePattern: z.enum(["Clean", "Hexagonal"]),
  solidBoundaries: z.array(SolidBoundarySchema).min(1),
  securityGuards: z.array(SecurityGuardSchema).min(1),
});

export const EntityPropertySchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
});

export const DomainEntitySchema = z.object({
  name: z.string().min(1),
  properties: z.array(EntityPropertySchema).min(1),
  relationships: z.array(z.string()),
});

export const IamPolicySchema = z.object({
  service: z.string().min(1),
  actions: z.array(z.string().min(1)).min(1),
  resource: z.string().min(1),
  effect: z.enum(["Allow", "Deny"]),
});

export const ServiceCostSchema = z.object({
  service: z.string().min(1),
  monthlyCostUsd: z.number().nonnegative(),
});

export const CostProjectionSchema = z.object({
  mvpMonthlyCostUsd: z.array(ServiceCostSchema).min(1),
  scaleMonthlyCostUsd: z.array(ServiceCostSchema).min(1),
});

export const DesignSchema = z.object({
  domainEntities: z.array(DomainEntitySchema).min(1),
  mermaidDiagram: z.string().min(1),
  iamPolicySummary: z.array(IamPolicySchema).min(1),
  awsCostProjection: CostProjectionSchema,
});

export const TaskItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  dependencies: z.array(z.string()),
});

export const Agent2OutputSchema = z.object({
  techSteering: TechSteeringSchema,
  requirements: z.string().min(1),
  design: DesignSchema,
  tasks: z.array(TaskItemSchema).min(1),
});

// ─── Agent 4: DevSecOps, Quality & Automation Engineer ──────────────────────

export const Agent4SecurityPolicySchema = z.object({
  name: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(256),
  enforcement: z.string().trim().min(1).max(256),
});

export const Agent4TaskItemSchema = z.object({
  id: z.string().trim().min(1).max(64),
  title: z.string().trim().min(1).max(256),
  description: z.string().trim().min(1).max(1024),
  dependencies: z.array(z.string().trim().min(1).max(64)).max(50),
});

export const Agent4LicenseEntrySchema = z.object({
  package: z.string().trim().min(1),
  license: z.string().trim().min(1),
});

export const Agent4ComplianceReportSchema = z.object({
  licenseSummary: z.array(Agent4LicenseEntrySchema).min(1),
  regulatoryFlags: z.array(z.string().trim().min(1)),
});

export const Agent4InputSchema = z.object({
  projectName: z.string().trim().min(1).max(128),
  stack: z.array(z.string().trim().min(1).max(64)).min(1).max(20),
  architecturePattern: z.string().trim().min(1),
  securityPolicies: z.array(Agent4SecurityPolicySchema).min(1),
  taskList: z.array(Agent4TaskItemSchema).min(1).max(200),
  complianceReport: Agent4ComplianceReportSchema,
});

// Agent4 Output schemas with structural refinements

export const Agent4HooksSchema = z.object({
  validateSpecs: z.string().min(10).refine(s => s.startsWith("#!/"), {
    message: "Hook must start with shebang",
  }),
  scanSecrets: z.string().min(10).refine(s => s.startsWith("#!/"), {
    message: "Hook must start with shebang",
  }),
});

export const Agent4OutputSchema = z.object({
  dockerfile: z.string().min(20).refine(
    s => (s.match(/FROM/g) || []).length >= 2,
    { message: "Dockerfile must contain at least two FROM directives (multi-stage)" },
  ),
  dockerCompose: z.string().min(20).refine(
    s => s.includes("services"),
    { message: "docker-compose must contain 'services' key" },
  ),
  ciPipeline: z.string().min(20).refine(
    s => s.includes("jobs"),
    { message: "CI pipeline must contain 'jobs' key" },
  ),
  hooks: Agent4HooksSchema,
});
