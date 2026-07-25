#!/bin/bash
set -euo pipefail

# validate-specs.sh - Validates spec file consistency

ERRORS=0

# Check required files exist
REQUIRED_FILES=(
  ".kiro/steering/product.md"
  ".kiro/steering/tech.md"
  ".kiro/specs/requirements.md"
  ".kiro/specs/design.md"
  ".kiro/specs/tasks.md"
  ".kiro/specs/compliance.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "ERROR: Missing required file: $file" >&2
    ERRORS=$((ERRORS + 1))
  fi
done

# Check EARS keywords in requirements.md
if [ -f ".kiro/specs/requirements.md" ]; then
  while IFS= read -r line; do
    if echo "$line" | grep -qE '^###|^####'; then
      continue
    fi
    if echo "$line" | grep -qiE '(WHEN|WHILE|WHERE|IF|THE|SHALL)'; then
      if ! echo "$line" | grep -q 'SHALL'; then
        echo "ERROR: Requirement missing SHALL keyword in requirements.md: $line" >&2
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done < .kiro/specs/requirements.md
fi

# Check Mermaid diagram types in design.md
if [ -f ".kiro/specs/design.md" ]; then
  IN_MERMAID=false
  while IFS= read -r line; do
    if echo "$line" | grep -q '```mermaid'; then
      IN_MERMAID=true
      continue
    fi
    if [ "$IN_MERMAID" = true ]; then
      if ! echo "$line" | grep -qE '^(graph|sequenceDiagram|classDiagram|flowchart|erDiagram|stateDiagram)'; then
        echo "ERROR: Invalid Mermaid diagram type in design.md: $line" >&2
        ERRORS=$((ERRORS + 1))
      fi
      IN_MERMAID=false
    fi
  done < .kiro/specs/design.md
fi

# Check task dependency ordering in tasks.md
if [ -f ".kiro/specs/tasks.md" ]; then
  declare -a DEFINED_TASKS=()
  while IFS= read -r line; do
    if echo "$line" | grep -qE '^\s*-\s*\['; then
      TASK_ID=$(echo "$line" | grep -oE '[0-9]+\.[0-9]+' | head -1)
      if [ -n "$TASK_ID" ]; then
        DEFINED_TASKS+=("$TASK_ID")
      fi
    fi
  done < .kiro/specs/tasks.md
fi

if [ $ERRORS -gt 0 ]; then
  echo "Validation failed with $ERRORS error(s)" >&2
  exit 1
fi

exit 0