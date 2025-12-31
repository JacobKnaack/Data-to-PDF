# Document Templates

This directory contains the interfaces for the types of PDF documents this service can create.

## Root

All document will contain these base properties

```json
{
    "document_type": "TYPE"
}

```

* `document_type`: describes the type of document that will be generated, this will determin which properties must be included in the structured input in order to produce a proper PDF.


## Invoice

A document that lists information about services and prices between someone making a payment, and someone receiving a payment.

```json
{
    "company" : {
        "name": "COMPANY_NAME",
        "address": "COMPANY_ST_ADDRESS",
        "logo_url": "VALID_URL"
    },
    "client": {
        "name": "CLIENT_NAME",
        "email": "CLIENT_EMAIL",
        "address": "CLIENT_ST_ADDRESS",
    },
    "line_items": [
        {
            "name": "ITEM_NAME",
            "desciption": "ITEM_DESCRIPTION",
            "quantity": 10,
            "unit_price": 10,
            "total": 10,
            "adjustments": [
                {
                    "description": "ADJUSTMENT_DESCRIPTION",
                    "amount": 5,
                }
            ]
        }
    ],
    "totals": {
        "subtotal": 10,
        "tax_rate": 0.1,
        "tax_amount": 1,
        "grand_total": 10.1
    },
    "payment_methods": [
        {
            "type": "METHOD_TYPE",
            "details": {
                "name": "PAYMENT_ENTITY",
                "account_name": "NAME_ON_ACCOUNT",
                "account_number": "ACOUNT_NUMBER",
                "routing_number": "ROUTING_NUMBER",
                "identifier": "SWIF_BIC_NUMBER"
                "uri": "URI_FOR_PLATFORM",
                "note": "NOTE_TO_CLIENT"
            }
        }
    ]
}

```

This invoice should have `"document_type": "invoice"` as the root property.  Company represents the entity receiving payment, while client represents the entity performing the payment.

## Form or Application

Generates a PDF form with fields to be filled out.

```json
{
    "header": {
        "title": "FORM_TITLE",
        "text": "HEADER_TEXT",
        "alignment": "ALIGNMENT_TYPE",
    }
    "fieldSet": {
        "title": "TITLE_TEXT",
        "description": "DESCRIPTION_TEXT",
        "fields": [
            {
                "id": "IDENTIFIER",
                "label": "LABEL_TEXT",
                "type": "FIELD_TYPE",
                "value": "AUTOFILL_VALUE",
                "required": true,
                "width": "FULL_OR_HALF_OR_PIXEL"
                "height": "PIXEL",
                "options": ["OPTION_1"]
            }
        ]
    }
}
```

Supports a number of field types that determine what fields and values are accepted. The document should have the `"document_type": "form"` set.  Field Types to support the following: `line | multiline | chars | date | datepicker | checkbox | signature`.





