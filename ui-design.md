# UI Design — Kiro Spec Studio (v2)

> Documento actualizado con todas las modificaciones acordadas.

---

## Cambios respecto a v1

- "Región" → "¿Desde dónde se conectarán más tus usuarios?" (enfoque en audiencia, no infra)
- Output rediseñado como **browser layout** con pestañas por agente
- Cada pestaña tiene un **resumen visual** (gráficas, diagramas, checklist) no solo markdown
- **Mascota Kiro** animada que narra el proceso en tiempo real

---

## Estructura de Pantallas

```
Pantalla 1: Input
     │
     ▼ (solo Modo Rápido)
Pantalla 2: Confirmación de Suposiciones
     │
     ▼
Pantalla 3: Output — Browser Layout con pestañas
```

---

## Pantalla 1: Input

### Switch de Modo (sin cambios de v1)

```
💡 Modo Rápido  ●────────────  📋 Modo Experto
Solo escribe tu idea        Brief completo
```


### Modo Rápido

```
┌──────────────────────────────────────────────────────────┐
│  ¿Cuál es tu idea?                                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Escribe tu idea en una o dos oraciones...         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Detalles opcionales ▾                                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ¿Tecnología preferida?     [__________________]   │  │
│  │  ¿Desde dónde se conectarán │ México              │  │
│  │   más tus usuarios?         │ LATAM          ▾    │  │
│  │                             │ USA/Canadá          │  │
│  │                             │ Europa              │  │
│  │                             │ Global              │  │
│  │  ¿Algo que NO quieres?      [__________________]   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

> La región de usuarios sirve para dos cosas: compliance (GDPR si Europa) y
> selección de región AWS más cercana a la audiencia. El usuario no necesita
> saber eso — solo responde dónde están sus usuarios.

### Modo Experto

Mismo formulario de v1 con este cambio:
- Campo "Países o regiones objetivo" → **"¿Desde dónde se conectarán más tus usuarios?"**
- Se reemplaza por un selector múltiple: México / LATAM / USA / Europa / Asia / Global
- Debajo del selector: nota explicativa en gris claro:
  *"Esto determina la región AWS recomendada y las regulaciones de privacidad aplicables"*

---

## Pantalla 2: Confirmación de Suposiciones (sin cambios de v1)

Tabla de suposiciones con botón "Cambiar" por fila. Sin modificaciones.

---

## Pantalla 3: Output — Browser Layout

Esta es la pantalla más importante. Se muestra como un **navegador simulado**
para dar la sensación de que el output es un producto real, no solo texto.


### Layout del Browser

```
┌──────────────────────────────────────────────────────────────────┐
│  ← → ↺   kiro-spec-studio.app/results/tournamenthub      [↓ ZIP]│
├──────────────────────────────────────────────────────────────────┤
│  📊 Mercado  │  🏗 Técnico  │  💰 Costos  │  ⚖ Compliance  │  ✅ Tareas │
│  ──────────  │              │             │                │          │
│                                                                  │
│  [Contenido del tab activo — ver detalle por tab abajo]          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

- La barra superior simula un browser: tiene botones de navegación decorativos,
  una URL fake con el nombre del proyecto, y el botón de descarga ZIP alineado a la derecha
- Las pestañas tienen iconos + nombre del agente
- El tab activo tiene underline y color de acento
- Cambiar de pestaña es instantáneo (todo el contenido ya está generado)

---

### Tab 1: 📊 Mercado

Resumen visual del análisis de mercado. Mezcla de gráficas y texto.

```
┌─────────────────────────────────────────────────────────────┐
│  TournamentHub — Análisis de Mercado                        │
│  Nicho: Gaming / Torneos Web       Audiencia: México + LATAM│
├───────────────────────────┬─────────────────────────────────┤
│  PROBLEMA                 │  PROPUESTA DE VALOR             │
│  ┌─────────────────────┐  │  "La única plataforma que       │
│  │ Organizadores gastan│  │   permite organizar torneos     │
│  │ 3-5h por torneo en  │  │   en <10 minutos sin saber      │
│  │ hojas de cálculo    │  │   de bracket systems"           │
│  └─────────────────────┘  │                                 │
├───────────────────────────┴─────────────────────────────────┤
│  TAMAÑO DE MERCADO                                          │
│                                                             │
│   TAM ████████████████████████████  $2.1B  (Global gaming) │
│   SAM ████████████░░░░░░░░░░░░░░░░  $180M  (LATAM digital) │
│   SOM ██░░░░░░░░░░░░░░░░░░░░░░░░░░  $1.2M  (Año 1 realista)│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  COMPETENCIA                                                │
│  ┌──────────────┬──────────────┬───────────────────────┐   │
│  │ Challonge    │ ✅ Conocido  │ ❌ Sin español, UX old │   │
│  │ Battlefy     │ ✅ Pro tools │ ❌ Solo esports grandes│   │
│  │ Spreadsheets │ ✅ Gratis    │ ❌ Manual, sin escala  │   │
│  └──────────────┴──────────────┴───────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  FEATURES MVP        RIESGOS TOP 3                          │
│  1. Crear torneo     🔴 Adopción inicial lenta              │
│  2. Bracket auto     🟡 Competidor mejora UX                │
│  3. Resultados live  🟢 Costo de adquisición alto           │
│  4. Perfil jugador                                          │
│  5. Compartir link                                          │
└─────────────────────────────────────────────────────────────┘
```


### Tab 2: 🏗 Técnico

Resumen de infraestructura con diagrama visual de servicios AWS.

```
┌─────────────────────────────────────────────────────────────┐
│  TournamentHub — Arquitectura AWS                           │
│  Stack: Next.js · Lambda · DynamoDB · Cognito               │
├─────────────────────────────────────────────────────────────┤
│  DIAGRAMA DE INFRAESTRUCTURA                                │
│                                                             │
│   [Usuario] ──► [CloudFront] ──► [S3 Frontend]             │
│                      │                                      │
│                      ▼                                      │
│               [API Gateway]                                 │
│                      │                                      │
│         ┌────────────┼────────────┐                         │
│         ▼            ▼            ▼                         │
│    [λ Auth]    [λ Torneos]  [λ Resultados]                  │
│         │            │            │                         │
│         ▼            ▼            ▼                         │
│    [Cognito]   [DynamoDB]   [DynamoDB]                      │
│                                                             │
│  (diagrama renderizado con Mermaid o React Flow)            │
├─────────────────────────────────────────────────────────────┤
│  SERVICIOS UTILIZADOS                                       │
│  ┌─────────────────┬────────────────────────────────────┐  │
│  │ 🟠 Lambda       │ Lógica de negocio serverless        │  │
│  │ 🟠 API Gateway  │ Endpoints REST públicos             │  │
│  │ 🟠 DynamoDB     │ Base de datos NoSQL escalable       │  │
│  │ 🟠 Cognito      │ Autenticación y sesiones            │  │
│  │ 🟠 S3           │ Frontend estático y assets         │  │
│  │ 🟠 CloudFront   │ CDN global, HTTPS automático        │  │
│  └─────────────────┴────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  DECISIONES CLAVE                                           │
│  • Serverless: tráfico variable de torneos, sin costos fijos│
│  • DynamoDB: datos de bracket son documentos, no relacional │
│  • Cognito: auth gestionado, sin implementar JWT propio     │
└─────────────────────────────────────────────────────────────┘
```

---

### Tab 3: 💰 Costos

Comparación visual MVP vs Escala con barras y totales claros.

```
┌─────────────────────────────────────────────────────────────┐
│  TournamentHub — Estimación de Costos AWS                   │
├────────────────────────┬────────────────────────────────────┤
│  MVP                   │  ESCALA                            │
│  500 usuarios/mes      │  10,000 usuarios/mes               │
│                        │                                    │
│  $3 – $8 / mes         │  $35 – $65 / mes                   │
│  ████░░░░░░░░░░░░░░    │  ████████████████░░░░░░            │
├────────────────────────┴────────────────────────────────────┤
│  DESGLOSE POR SERVICIO                                      │
│                                                             │
│  Servicio      MVP/mes    Escala/mes   Diferencia           │
│  ─────────────────────────────────────────────────         │
│  Lambda        $0 (free)  $1.20        +$1.20              │
│  API Gateway   $0.15      $6.00        +$5.85              │
│  DynamoDB      $1.00      $15.00       +$14.00             │
│  S3            $0.12      $1.15        +$1.03              │
│  CloudFront    $0.85      $8.50        +$7.65              │
│  Cognito       $0 (free)  $0 (free)    —                   │
│  ─────────────────────────────────────────────────         │
│  TOTAL         ~$2-5      ~$32-52                           │
│                                                             │
│  ⚠️ Estimados de referencia. Calcular exacto en:            │
│     calculator.aws →                                        │
└─────────────────────────────────────────────────────────────┘
```


### Tab 4: ⚖ Compliance

Resumen de riesgos legales con checklist visual de semáforo.

```
┌─────────────────────────────────────────────────────────────┐
│  TournamentHub — Compliance & Legal                         │
│  Audiencia: México + LATAM     Riesgo general: 🟢 Bajo      │
├─────────────────────────────────────────────────────────────┤
│  DATOS QUE MANEJA LA APP                                    │
│  ✅ Email    ✅ Nombre    ⬜ Pagos    ⬜ Ubicación           │
│  ⬜ Salud    ⬜ Menores   ⬜ Bancarios                       │
├─────────────────────────────────────────────────────────────┤
│  REGULACIONES APLICABLES                                    │
│  🔴 Obligatorio    🟡 Recomendado    ⬜ No aplica           │
│                                                             │
│  🔴  LFPDPPP (México) — Maneja emails de usuarios MX        │
│  🔴  Aviso de Privacidad — Requerido antes de lanzar        │
│  🟡  GDPR — Si eventualmente expanden a Europa              │
│  ⬜  HIPAA — No aplica, sin datos de salud                  │
│  ⬜  PCI-DSS — No aplica, sin pagos directos                │
├─────────────────────────────────────────────────────────────┤
│  CHECKLIST ANTES DE LANZAR                                  │
│                                                             │
│  Documentos Legales                                         │
│  ☐  Política de Privacidad (español)                        │
│  ☐  Términos y Condiciones                                  │
│  ☐  Aviso de Privacidad LFPDPPP                             │
│                                                             │
│  Seguridad AWS                                              │
│  ☐  IAM sin permisos *:*                                    │
│  ☐  S3 buckets privados                                     │
│  ☐  Secrets en Secrets Manager                              │
│  ☐  MFA en cuenta root                                      │
│  ☐  Encriptación en reposo en DynamoDB                      │
│                                                             │
│  Licencias Open Source                                      │
│  ☐  Next.js — MIT ✅                                        │
│  ☐  React — MIT ✅                                          │
│  ☐  AWS SDK — Apache 2.0 ✅                                 │
└─────────────────────────────────────────────────────────────┘
```

---

### Tab 5: ✅ Tareas

Lista de tareas ordenadas por fase, con estado y dependencias visibles.

```
┌─────────────────────────────────────────────────────────────┐
│  TournamentHub — Plan de Implementación                     │
│  18 tareas · Est. 2 semanas · Próxima: TASK-001             │
├─────────────────────────────────────────────────────────────┤
│  Fase 1: Setup           ████████░░  3/4 tareas             │
│  Fase 2: Auth            ░░░░░░░░░░  0/3 tareas             │
│  Fase 3: Features        ░░░░░░░░░░  0/5 tareas             │
│  Fase 4: Frontend        ░░░░░░░░░░  0/4 tareas             │
│  Fase 5: Deploy          ░░░░░░░░░░  0/2 tareas             │
├─────────────────────────────────────────────────────────────┤
│  ✅ TASK-001  Inicializar proyecto Next.js                  │
│  ✅ TASK-002  Configurar AWS CDK                            │
│  ✅ TASK-003  Configurar Cognito User Pool                  │
│  ⬜ TASK-004  Configurar DynamoDB y tablas    ← siguiente   │
│  ⬜ TASK-005  Variables de entorno                          │
│  ─────────────────────────────────────────────────         │
│  ⬜ TASK-006  Lambda: POST /auth/register                   │
│  ⬜ TASK-007  Lambda: POST /auth/login                      │
│     ...                                                     │
└─────────────────────────────────────────────────────────────┘
```


---

## Mascota Kiro

La mascota es un elemento animado que aparece en la esquina inferior derecha
durante todo el flujo de generación. Es el narrador del proceso.

### Diseño visual

```
                    ┌─────────────────────────────────┐
                    │  Analizando competidores en el  │
                    │  mercado de gaming LATAM...     │
                    │                          💬     │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │                             │
                    │     🤖  [Kiro mascot]        │
                    │    (animated SVG/Lottie)    │
                    │                             │
                    └─────────────────────────────┘
```

- Posición: fija en la esquina inferior derecha
- Tamaño: ~80px de alto, no intrusivo
- La mascota tiene un **speech bubble** arriba que muestra el mensaje actual
- El speech bubble aparece/desaparece con animación suave (fade + slide)

### Estados de la mascota

| Estado | Animación | Mensaje de ejemplo |
|--------|-----------|-------------------|
| Esperando input | idle, parpadeo suave | "Escribe tu idea y yo me encargo del resto" |
| Procesando | movimiento activo, "pensando" | "Analizando el mercado de gaming..." |
| Agente PM | color/pose distinta | "Identificando a tus competidores..." |
| Agente Técnico | | "Diseñando tu arquitectura en AWS..." |
| Agente Financial | | "Calculando costos para 500 y 10,000 usuarios..." |
| Agente Legal | | "Revisando regulaciones para México..." |
| Completado | celebración (jump/spin) | "¡Listo! Tu plan está completo 🎉" |
| Error | pose triste | "Algo salió mal, intentemos de nuevo" |

### Mensajes durante la generación (se van reemplazando en secuencia)

```
"Entendí tu idea. Voy a trabajar en 4 análisis paralelos..."
    ↓ (2s)
"Buscando el tamaño del mercado de [nicho]..."
    ↓
"Identificando competidores directos e indirectos..."
    ↓
"Diseñando la arquitectura más simple posible en AWS..."
    ↓
"Calculando cuánto costaría con 500 y con 10,000 usuarios..."
    ↓
"Revisando qué regulaciones aplican para [región]..."
    ↓
"Generando tu lista de tareas ordenadas por dependencia..."
    ↓
"¡Todo listo! Puedes navegar los resultados con las pestañas."
```

### Comportamiento en el output

Una vez generado el output, la mascota no desaparece — se queda en idle
y cambia su mensaje según el tab activo:

| Tab activo | Mensaje de la mascota |
|------------|-----------------------|
| Mercado | "Este análisis es tu mapa del territorio" |
| Técnico | "Elegí serverless para que no pagues cuando no hay usuarios" |
| Costos | "A escala, el mayor costo es DynamoDB — monitoréalo" |
| Compliance | "En México, el Aviso de Privacidad es obligatorio antes de lanzar" |
| Tareas | "Empieza por la Fase 1 — cada tarea desbloquea las siguientes" |

### Implementación sugerida

- SVG animado con CSS animations (opción ligera) o Lottie JSON (opción rica)
- El diseño de la mascota puede ser el robot/alien de Kiro o uno custom del equipo
- Si no hay tiempo para animaciones, una imagen estática con el speech bubble
  animado en CSS es suficiente para el demo

---

## Resumen de cambios v1 → v2

| Elemento | v1 | v2 |
|----------|----|----|
| Campo de región | "Países objetivo" (texto libre) | "¿Desde dónde se conectarán tus usuarios?" (selector múltiple) |
| Output | Tabs con markdown | Browser layout con resúmenes visuales por agente |
| Tab Mercado | Solo texto | Barras TAM/SAM/SOM + tabla competencia + features |
| Tab Técnico | Solo diagrama | Diagrama + tabla de servicios + decisiones clave |
| Tab Costos | Tabla plana | Comparación visual MVP vs Escala con barras |
| Tab Compliance | Solo texto | Semáforo de regulaciones + checklist visual |
| Tab Tareas | Lista flat | Fases con progreso + próxima tarea destacada |
| Feedback proceso | Ninguno | Mascota animada con mensajes contextuales por agente |
