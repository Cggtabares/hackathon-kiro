#!/bin/bash
set -euo pipefail

# scan-secrets.sh - Scans staged files for accidentally committed secrets

ALLOWLIST_FILE="${SCAN_SECRETS_ALLOWLIST:-.kiro/hooks/scan-secrets-allowlist.txt}"
FOUND_SECRETS=0

# Load allowlist patterns if file exists
ALLOWLIST_PATTERNS=()
if [ -f "$ALLOWLIST_FILE" ]; then
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    ALLOWLIST_PATTERNS+=("$line")
  done < "$ALLOWLIST_FILE"
fi

is_allowlisted() {
  local file="$1"
  local match="$2"
  for pattern in "${ALLOWLIST_PATTERNS[@]:-}"; do
    if echo "$file" | grep -q "$pattern" || echo "$match" | grep -q "$pattern"; then
      return 0
    fi
  done
  return 1
}

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# Secret patterns to detect
declare -a PATTERNS=(
  'AKIA[0-9A-Z]{16}:AWS Access Key'
  'sk_live_[a-zA-Z0-9]+:Stripe Secret Key'
  'ghp_[a-zA-Z0-9]+:GitHub Personal Access Token'
  '(bearer|access_token)\s*[:=]\s*["'\'''][^"'\''"]+["'\''']:Bearer/Access Token'
  '(password|secret|api_key)\s*[:=]\s*["'\'''][^"'\''"]+["'\''']:Secret Assignment'
  '-----BEGIN (RSA|SSH|PGP) PRIVATE KEY-----:Private Key'
)

for file in $STAGED_FILES; do
  [ -f "$file" ] || continue

  # Check for .env files with real values
  if echo "$file" | grep -qE '\.env$|\.env\.'; then
    while IFS= read -r line; do
      [[ -z "$line" || "$line" == \#* ]] && continue
      if echo "$line" | grep -qE '^[A-Z_]+=.+' && \
         ! echo "$line" | grep -qiE '(CHANGE_ME|TODO|your-.*-here|=""|='\'''\'\''$)'; then
        if ! is_allowlisted "$file" "$line"; then
          echo "$file: .env secret assignment detected" >&2
          FOUND_SECRETS=$((FOUND_SECRETS + 1))
        fi
      fi
    done < "$file"
  fi

  # Check for secret patterns
  for pattern_entry in "${PATTERNS[@]}"; do
    PATTERN="${pattern_entry%%:*}"
    PATTERN_NAME="${pattern_entry##*:}"
    if grep -qE "$PATTERN" "$file" 2>/dev/null; then
      if ! is_allowlisted "$file" "$PATTERN"; then
        echo "$file: $PATTERN_NAME" >&2
        FOUND_SECRETS=$((FOUND_SECRETS + 1))
      fi
    fi
  done
done

if [ $FOUND_SECRETS -gt 0 ]; then
  echo "Blocked: $FOUND_SECRETS potential secret(s) found in staged files" >&2
  exit 1
fi

exit 0