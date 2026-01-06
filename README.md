# Data To PDF

A lightweight Node.js microservice built with Express and pdf-lib.  Converts JSON payload into PDF documents.  Built with Typescript, and ESM first architecture.

## Features

* **Fast Development**: Powered by `tsx` for extensionless TypeScript support.
* **Optimized Production**: Bundled with `esbuild` for a single-file deployment.
* **Standards**: Generates PDFs using standard page sizes (A4, Letter, etv).

## Installation

1. Clone Repository
2. Install with npm: `npm install`
3. Set environment: `PORT=1234`

## Usage

Run development server: `npm run dev`

Create a build: `npm run build`

Start production server: `npm start`

Run Tests: `npm test`

## API Reference

**Create a PDF**

Converts JSON object into a downloadable PDF file.

**URL**: `/pdf`

**Method**: `POST`

**Headers**: `Content-Type: application/json`

**Request Body** :

```json
{
    "document_type": "text",
    "document_settings": {
        "page_size": "A4",
        "margin": {
            "top": 50,
            "bottom": 50,
            "left": 50,
            "right": 50
        },
        "font_family": "Helvetica",
        "font_size": 12,
        "file_name": "My_Document"
    }, 
    "text": "Text you would like in your document."
}
``` 

**Success Response**

```
200 OK
Content-Type: application/pdf
Body: Binary PDF Stream
```

