# KiroSpec Studio

> Herramienta de especificación de software e ingeniería en tiempo real basada en agentes de IA.

## 📋 Overview

Kiro Spec Studio es una herramienta de especificación de software e ingeniería en tiempo real basada en agentes de IA. A través de una experiencia conversacional guiada (Architect Wizard), el sistema toma una idea abstracta de software y la transforma automáticamente en un paquete técnico completo dentro de un entorno tipo IDE minimalista (Workbench). Genera especificaciones detalladas, diseño de arquitectura, matriz de cumplimiento y artefactos reales de DevSecOps con suites de pruebas verificadas.

### ¿Qué problema soluciona?

Elimina la enorme brecha y fricción existente entre la concepción de una idea de software y la creación de una arquitectura técnica segura, lista para producción. Tradicionalmente, redactar especificaciones, diagramar arquitecturas, verificar normativas de privacidad (GDPR/compliance) y configurar pipelines de CI/CD requiere semanas de trabajo senior. Kiro Spec Studio automatiza este proceso en minutos mediante un pipeline multagente coordinado que entrega artefactos funcionales y testeados.

### Este repositorio

Implementa **Agent 2** (Software Architect) y **Agent 4** (DevSecOps), y contiene las directrices/prompts para **Agent 1** (PM) y **Agent 3** (Legal).

## 📦 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 22, TypeScript 5.8 (strict) |
| Framework | Next.js 15 (App Router) |
| LLM | Vercel AI SDK (`generateObject` con schema enforcement) |
| Validación | Zod (tipos en compilación + validación runtime) |
| Testing | Vitest + fast-check (property-based) |
| Infra | Docker multi-stage, GitHub Actions CI/CD |
| Offline | MockLlmClient con respuestas pre-construidas |

## 🏗️ Pipeline Completo

```
Idea/Input → Agent 1 → Agent 2 → Agent 3 → Agent 4 → 🚀 Proyecto listo
```

| # | Agente | Responsabilidad | Output | Estado |
|---|--------|----------------|--------|--------|
| 1 | PM & Market Strategist | Validación de mercado, competencia, TAM/SAM/SOM | Reporte HTML + JSON + `product.md` | 📝 Directrices |
| 2 | Software Architect | Stack, Clean Architecture, EARS requirements, costos AWS | `tech.md`, `requirements.md`, `design.md`, `tasks.md` | ✅ Implementado |
| 3 | Legal & Compliance | Privacidad, licencias, GDPR/LFPDPPP, regulaciones | `compliance.md` con payload Agent 4 | 📝 Directrices |
| 4 | DevSecOps & Automation | Docker, CI/CD, hooks de seguridad | `Dockerfile`, `docker-compose.yml`, `ci.yml`, hooks | ✅ Implementado |

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Demo Agent 2 — genera specs de arquitectura (offline, sin API key)
npm run demo

# Demo Agent 4 — genera Dockerfile, CI/CD, hooks (offline, sin API key)
npm run demo-agent4

# Correr los 77 tests
npm test

# Servidor de desarrollo (Next.js)
npm run dev
```

## 🖥️ Frontend (UI Demo)

La interfaz visual del pipeline está en la rama [`feat/ui-demo`](https://github.com/elecodes/hackathon-kiro/tree/feat/ui-demo) del repo principal.

**Repo:** [github.com/elecodes/hackathon-kiro](https://github.com/elecodes/hackathon-kiro) — branch `feat/ui-demo`

Incluye:
- Interfaz tipo browser simulado con pestañas por agente (Mercado, Técnico, Costos, Compliance, Tareas)
- Input en dos modos: rápido (1-2 oraciones) y experto (brief completo)
- Visualización del pipeline de 4 agentes en tiempo real
- Next.js App Router con componentes React

El diseño completo está documentado en [`ui-design.md`](./ui-design.md).

## 📁 Estructura del Proyecto

```
hackathon-kiro/
├── src/
│   ├── domain/              ← Tipos puros, schemas Zod, errores tipados
│   ├── application/         ← Casos de uso + interfaces de puertos
│   ├── infrastructure/      ← Adaptadores (Vercel AI SDK, filesystem, mocks)
│   ├── presentation/        ← API REST (Next.js App Router)
│   ├── config/              ← System prompts para LLMs
│   ├── lib/prompts/         ← Prompt del agente de compliance
│   ├── __tests__/           ← Unit + property-based + integration tests
│   └── index.ts             ← Factories: createAgent2(), createAgent4()
├── agents/
│   └── pm-market-strategist/ ← Prompt, config, templates y ejemplos de Agent 1
├── scripts/
│   ├── demo.ts              ← Demo offline Agent 2
│   └── demo-agent4.ts       ← Demo offline Agent 4
├── shared/schemas/          ← Schemas compartidos (market report)
├── docs/                    ← Documentación para equipos
├── .kiro/
│   ├── mocks/               ← Respuestas mock para demos
│   ├── steering/            ← Archivos de steering generados
│   └── specs/               ← Specs generadas
├── .github/workflows/       ← CI/CD pipeline
├── Dockerfile               ← Build multi-stage (deps → build → runtime)
├── docker-compose.yml       ← App + PostgreSQL con redes aisladas
└── vitest.config.ts         ← Config de testing
```

## 🧩 Agent 1 — PM & Market Strategist (directrices)

**Ubicación:** `agents/pm-market-strategist/`

Contiene el prompt completo, configuración, templates HTML y ejemplos de input/output para el agente de análisis de mercado. No requiere implementación técnica — es una guía para un LLM externo que produce:

- Análisis de mercado con TAM/SAM/SOM
- Competitive landscape (mínimo 3 competidores)
- Feasibility scorecard (1-10)
- Monetization model canvas
- Failure mode analysis con kill criteria

## 🧩 Agent 2 — Software Architect (implementado)

**Input:** `Agent1Output` (projectName, productVision, targetAudience, mvpFeatures, expectedMetrics)

**Output:**
| Archivo | Contenido |
|---------|-----------|
| `.kiro/steering/tech.md` | Stack, Clean Architecture, SOLID, security policies |
| `.kiro/specs/requirements.md` | Requirements en sintaxis EARS (WHEN/SHALL) |
| `.kiro/specs/design.md` | Entidades DDD, diagrama Mermaid, IAM, costos AWS |
| `.kiro/specs/tasks.md` | Tareas secuenciales con dependencias |

**Modos de uso:**

```typescript
// Offline (mock)
const agent2 = createAgent2({ mockLlmResponse: mockData });
const result = await agent2.execute();

// Con LLM real (requiere OPENAI_API_KEY)
const agent2 = createAgent2({ model: "gpt-4o" });
const result = await agent2.execute({ agent1Output, preferredStack });
```

**API:** `POST /api/generate-spec` → 200 (ok) / 400 (validación) / 502 (LLM transient) / 500 (permanente)

## 🧩 Agent 3 — Legal & Compliance (directrices)

**Ubicación:** `src/lib/prompts/compliance-agent.ts`

System prompt para que un agente externo realice auditoría legal basándose en los outputs de Agent 1 y Agent 2. Cubre:

- Privacy y data-protection assessment
- Open-source license audit (con clasificación de riesgo)
- Regulatory flags para Agent 4
- Payload JSON machine-readable (`json:agent4-payload`)

Documentación completa del handoff en `docs/legal-compliance-handoff.md`.

## 🧩 Agent 4 — DevSecOps & Automation (implementado)

**Input:** projectName, stack, architecturePattern, securityPolicies, taskList, complianceReport

**Output:**
| Archivo | Contenido |
|---------|-----------|
| `Dockerfile` | Multi-stage build (deps → build → runtime), non-root user, healthcheck |
| `docker-compose.yml` | App + DB con redes aisladas y volúmenes persistentes |
| `.github/workflows/ci.yml` | Pipeline: lint, typecheck, test, security, license-check, build, deploy |
| `.kiro/hooks/validate-specs.sh` | Valida existencia y formato de specs |
| `.kiro/hooks/scan-secrets.sh` | Escanea secrets en archivos staged |

```typescript
const agent4 = createAgent4({ mockLlmResponse: mockData });
const result = await agent4.execute(input);
```

## 🏛️ Cómo fluye la data

```
Input (idea) → Validación Zod → LLM (GPT-4o) → Validación Zod → Archivos .kiro/
```

El código usa **Clean Architecture**: los tipos y reglas viven en `domain/`, la lógica de negocio en `application/`, y los adaptadores (LLM, filesystem) en `infrastructure/`. Esto permite cambiar de proveedor LLM sin tocar la lógica — solo implementas la interfaz `LlmPort`.

## ✅ Testing (77 tests)

```bash
npm test              # Todos los tests
npm run test:coverage # Con reporte de cobertura
```

| Categoría | Tests | Qué cubre |
|-----------|-------|-----------|
| Schema unit | 27 | Objetos válidos/inválidos, edge cases |
| Error unit | 11 | Construcción de errores, propagación de campos |
| Use case unit | 16 | Happy path, fallback, clasificación de errores |
| Infrastructure | 8 | Mock loader, file writer |
| Integration | 3 | Pipeline completo end-to-end |
| Property-based (PBT) | 12 | 100 iteraciones cada uno, correctness universal |
| **Total** | **77** | **All passing** |

**Propiedades de correctness verificadas:**
1. Schemas rechazan objetos inválidos con paths de error correctos
2. Objetos válidos hacen round-trip sin pérdida de datos
3. File writer preserva todo el contenido
4. Validación de input siempre precede a invocación del LLM
5. Todos los errores llevan nombre de operación + contexto
6. Dependencias de tareas forman un orden topológico válido

## 🤝 Integration Guide

**Agent 1 → Agent 2:** Tu output debe cumplir `Agent1OutputSchema`. Escríbelo a `.kiro/steering/product.md` como JSON o pásalo a la API.

**Agent 2 → Agent 3:** Consume `.kiro/specs/design.md` (IAM policies, entidades con PII) y `.kiro/steering/tech.md` (stack para license audit).

**Agent 3 → Agent 4:** El bloque `json:agent4-payload` al final de `compliance.md` es el contrato. Agent 4 lo parsea con regex.

**Agent 4 → Desarrollo:** Después de Agent 4, `docker compose up` da un environment funcional sin configuración manual.

## 👥 Team

- **Elena Menéndez** ([@elecodes](https://github.com/elecodes)) — Agent 2, UI Demo

- **Jonathan Brasales** ([@JonnyBP](https://github.com/JonnyBP)) — Agent 4, documentación.

- **xxx** ([@xxx](https://github.com/xxx)) — Agent 1.

- **xxx** ([@xxx](https://github.com/xxx)) — Agent 3.


- **Equipo** — [hackathon-kiro](https://github.com/JonnyBP/hackathon-kiro)
