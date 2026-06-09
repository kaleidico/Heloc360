#!/usr/bin/env bash
# Imports the transformed NDJSON into the Sanity production dataset.
# Use --replace ONLY on first run; for re-runs, use --missing to avoid clobbering edits.
# Passes --token explicitly so import works regardless of `sanity login` CLI auth state.
set -euo pipefail

cd "$(dirname "$0")/../.."

# Load .env.local (same pattern as 01-export.mjs / 02-upload-assets.mjs) so this script
# is self-contained — no manual `source .env.local` before invoking.
if [[ -f .env.local ]]; then
  set -o allexport
  # shellcheck disable=SC1091
  source .env.local
  set +o allexport
fi

DATASET="${NEXT_PUBLIC_SANITY_DATASET:-production}"
NDJSON="scripts/migration/_archive/out.ndjson"

if [[ ! -f "$NDJSON" ]]; then
  echo "Missing $NDJSON. Run 03-transform.mjs first." >&2
  exit 1
fi

if [[ -z "${SANITY_API_WRITE_TOKEN:-}" ]]; then
  echo "Missing SANITY_API_WRITE_TOKEN in .env.local — required for import auth." >&2
  exit 1
fi

echo "Importing $NDJSON to dataset '$DATASET'..."
# Export SANITY_AUTH_TOKEN so the CLI's pre-import `datasets/read` precheck is authorized
# even when no `sanity login` has been run on this machine. (The CLI's --token flag alone
# is not respected for that precheck — see https://docs.sanity.io/help/cli-errors.)
SANITY_AUTH_TOKEN="$SANITY_API_WRITE_TOKEN" npx sanity dataset import "$NDJSON" "$DATASET" --replace --token "$SANITY_API_WRITE_TOKEN"
echo "Import complete."
