# Project Brief — Kiro Spec Studio Input

> Punto de entrada de la app. Existen dos modos según el tipo de usuario.
> El agente detecta automáticamente qué modo usar según la cantidad de info provista.

---

## MODO 1: Usuario Experto (switch activado en la UI)

> El usuario tiene claridad sobre su producto. Responde todas las secciones.
> El agente usa estas respuestas directamente sin hacer suposiciones.

### Idea del Proyecto

**Nombre tentativo:**

**Descripción en una oración:**
<!-- Qué hace la app y para quién -->

**Problema que resuelve:**
<!-- El dolor específico del usuario hoy -->

**Usuario objetivo:**
<!-- Quién la usa, edad, contexto, nivel técnico -->

---

### Stack Preferido

**Frontend:**
<!-- Ej: Next.js, React, Vue, sin preferencia -->

**Backend:**
<!-- Ej: Node.js, Python, sin preferencia -->

**Base de datos:**
<!-- Ej: PostgreSQL, DynamoDB, sin preferencia -->

**Servicios AWS que el equipo ya conoce:**
<!-- Lista libre -->

---

### Contexto del Proyecto

**Nicho / Industria:**
<!-- Ej: Gaming, FinTech, HealthTech, EdTech, Logística -->

**Países o regiones objetivo:**
<!-- Importante para compliance. Ej: México, LATAM, Europa -->

**¿Maneja datos sensibles?**
<!-- Ej: pagos, salud, menores de edad, ubicación, ninguno -->

**Escala esperada:**
- Usuarios en el lanzamiento:
- Usuarios en 12 meses:

---

### Restricciones

**Presupuesto mensual máximo en AWS:**
<!-- Ej: $50/mes MVP, $500/mes escala -->

**Tiempo de desarrollo estimado:**
<!-- Ej: 2 semanas para MVP -->

**Lo que definitivamente NO quieren:**
<!-- Ej: no quieren manejar servidores, no quieren SQL -->

---

---

## MODO 2: Usuario General (switch desactivado en la UI)

> El usuario solo tiene una idea. Puede agregar detalles opcionales.
> El agente infiere lo que falta, pero siempre lo hace explícito en el output
> para que el usuario pueda validar o corregir las suposiciones.

### Idea (requerido)

**Escribe tu idea en una o dos oraciones:**
<!-- Ej: "Una app para organizar torneos de videojuegos entre amigos" -->
<!-- Ej: "Quiero un marketplace para freelancers de diseño en LATAM" -->

---

### Detalles opcionales (llenar solo lo que sepas)

**¿Tienes preferencia de tecnología?**
<!-- Dejar vacío si no sabes -->

**¿En qué país o región operaría?**
<!-- Dejar vacío si no sabes -->

**¿Cuántos usuarios esperas al inicio?**
<!-- Dejar vacío si no sabes -->

**¿Hay algo que definitivamente no quieres?**
<!-- Ej: "no quiero pagar por servidores fijos", "no quiero manejar pagos" -->

---

### Instrucción para el agente en Modo 2

Cuando el usuario está en Modo 2, el agente debe:

1. **Inferir lo que falta** usando criterios razonables para el tipo de app descrita
2. **Documentar cada suposición** en una sección "Suposiciones del Agente" al inicio del output:
   ```
   ## Suposiciones del Agente
   > Basadas en tu descripción. Si alguna es incorrecta, corrígela antes de continuar.
   - Stack: Se asumió Next.js + Lambda porque es una app web sin requisitos de tiempo real
   - Región: Se asumió us-east-1 (más barata) por no especificar región objetivo
   - Escala: Se asumió MVP de 500 usuarios por ser un proyecto nuevo
   - Datos sensibles: Se asumió solo email y nombre, sin pagos ni salud
   ```
3. **Pedir confirmación** antes de generar los documentos finales:
   ```
   ¿Las suposiciones anteriores son correctas?
   - Si hay algo mal, corrígelo y continuamos
   - Si todo está bien, escribo los documentos completos
   ```
4. **Nunca asumir sin documentar** — toda suposición debe ser visible y editable

---

## Campos que SIEMPRE infiere el agente (ambos modos)

Estos campos los completa el agente siempre, independientemente del modo:
- Competidores directos e indirectos
- Estimación de TAM/SAM/SOM
- Riesgos del mercado
- Regulaciones de compliance aplicables
- Servicios AWS específicos con sus costos estimados
- Tareas de implementación ordenadas por dependencia
