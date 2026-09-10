#!/usr/bin/env bash
# ==============================================================================
# E-Cell PocketBase Collection Creator for Ubuntu
# Creates the 'registrations' collection for Orientation Registration
# ==============================================================================

set -e

PB_URL="${PB_URL:-https://pocketbase.ecellsoa.in}"
COLLECTION_NAME="${COLLECTION_NAME:-registrations}"

echo "========================================================"
echo " PocketBase Setup: '${COLLECTION_NAME}' collection"
echo " Server: ${PB_URL}"
echo "========================================================"
echo ""

# Prompt for Admin / Superuser credentials if not set as env vars
if [ -z "$PB_ADMIN_EMAIL" ]; then
  read -p "Enter PocketBase Admin/Superuser Email: " PB_ADMIN_EMAIL
fi

if [ -z "$PB_ADMIN_PASSWORD" ]; then
  read -s -p "Enter PocketBase Admin/Superuser Password: " PB_ADMIN_PASSWORD
  echo ""
fi

if [ -z "$PB_ADMIN_EMAIL" ] || [ -z "$PB_ADMIN_PASSWORD" ]; then
  echo "Error: Email and password are required."
  exit 1
fi

echo ""
echo "Authenticating with PocketBase..."

# Try PocketBase v0.23+ superuser login first
AUTH_RESPONSE=$(curl -s -X POST "${PB_URL}/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"${PB_ADMIN_EMAIL}\",\"password\":\"${PB_ADMIN_PASSWORD}\"}")

TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || true)

# If v0.23+ superuser endpoint didn't return a token, try legacy v0.22 admins endpoint
if [ -z "$TOKEN" ]; then
  AUTH_RESPONSE=$(curl -s -X POST "${PB_URL}/api/admins/auth-with-password" \
    -H "Content-Type: application/json" \
    -d "{\"identity\":\"${PB_ADMIN_EMAIL}\",\"password\":\"${PB_ADMIN_PASSWORD}\"}")
  TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4 || true)
fi

if [ -z "$TOKEN" ]; then
  echo "Authentication failed! Server response:"
  echo "$AUTH_RESPONSE"
  exit 1
fi

echo "✓ Successfully authenticated!"

echo ""
echo "Creating collection '${COLLECTION_NAME}'..."

PAYLOAD=$(cat <<EOF
{
  "name": "${COLLECTION_NAME}",
  "type": "base",
  "createRule": "",
  "listRule": "@request.auth.id != ''",
  "viewRule": "@request.auth.id != ''",
  "updateRule": null,
  "deleteRule": null,
  "fields": [
    { "name": "name", "type": "text", "required": true },
    { "name": "registration_number", "type": "text", "required": true },
    { "name": "email", "type": "email", "required": true },
    { "name": "phone", "type": "text", "required": true },
    { "name": "branch", "type": "text", "required": true },
    { "name": "section", "type": "text", "required": true },
    { "name": "year", "type": "text", "required": true },
    { "name": "team", "type": "text", "required": true },
    {
      "name": "idProof",
      "type": "file",
      "required": false,
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]
    },
    { "name": "mailSent", "type": "bool", "required": false }
  ],
  "indexes": [
    "CREATE UNIQUE INDEX idx_${COLLECTION_NAME}_email ON ${COLLECTION_NAME} (email)",
    "CREATE UNIQUE INDEX idx_${COLLECTION_NAME}_reg ON ${COLLECTION_NAME} (registration_number)"
  ]
}
EOF
)

CREATE_RESPONSE=$(curl -s -X POST "${PB_URL}/api/collections" \
  -H "Content-Type: application/json" \
  -H "Authorization: ${TOKEN}" \
  -d "$PAYLOAD")

# Check if collection already exists or was created
if echo "$CREATE_RESPONSE" | grep -q '"name":"'"${COLLECTION_NAME}"'"'; then
  echo ""
  echo "🎉 Success! Collection '${COLLECTION_NAME}' has been created with Public Create access."
  echo "Students can now register from the frontend."
elif echo "$CREATE_RESPONSE" | grep -q "already exists" || echo "$CREATE_RESPONSE" | grep -q "validation_not_unique"; then
  echo ""
  echo "Notice: Collection '${COLLECTION_NAME}' already exists."
  echo "Ensuring Create Rule is set to Public..."
  
  # Fetch existing collection ID
  COLL_INFO=$(curl -s -X GET "${PB_URL}/api/collections/${COLLECTION_NAME}" \
    -H "Authorization: ${TOKEN}")
  COLL_ID=$(echo "$COLL_INFO" | grep -o '"id":"[^"]*' | cut -d'"' -f4 || true)

  if [ -n "$COLL_ID" ]; then
    curl -s -X PATCH "${PB_URL}/api/collections/${COLL_ID}" \
      -H "Content-Type: application/json" \
      -H "Authorization: ${TOKEN}" \
      -d '{"createRule":""}' > /dev/null
    echo "✓ Public create access confirmed for '${COLLECTION_NAME}'."
  fi
else
  echo ""
  echo "Server response:"
  echo "$CREATE_RESPONSE"
fi

echo ""
echo "========================================================"
echo " Done! Visit https://pocketbase.ecellsoa.in/_/ to verify"
echo "========================================================"
