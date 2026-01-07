#!/bin/bash

# Define server endpoints
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <URL> <output-path>"
  exit 1
fi

URL="$1"
OUTPUT="$2"

# Example JSON payload

JSON='{
    "document_type": "invoice",
    "document_settings": {
        "page_size": "A4",
        "margin": { "top": 72, "bottom": 72, "left": 72, "right": 72 },
        "font_family": "Helvetica",
        "font_size": 12,
        "file_name": "acme_invoice.pdf"
    },
    "company": {
        "name": "Acme Corp"
    },
    "client": {
        "name": "Test Client"
    },
    "line_items": [
        {
            "name": "Widget",
            "description": "Does something really cool.",
            "quantity": 2,
            "price": 1,
            "total": 2
        }
    ],
    "total": {
        "subtotal": 2,
        "tax_rate": 0.1,
        "tax_amount": 0.2,
        "grand_total": 2.2
    }
}'

# Send POST Request and save PDF, capture status code

STATUS=(curl -s -o "$OUTPUT" -w "%{http_code}" \
    -X POST "$URL" \
    -H "Content-Type: application/json" \
    --data "$JSON")

echo "HTTP status: $STATUS"
if [ "$STATUS" -eq 200 ]; then
    echo "PDF saved to $OUTPUT"
else
    echo "Request failed, PDF not saved"
fi

