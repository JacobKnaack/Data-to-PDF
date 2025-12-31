import { describe, it, expect } from 'vitest';
import { fromBuffer } from '../test/utility/readPdf';

import request from 'supertest';
import server from './server';

describe('PDF Generation Service', () => {
  it('Should return a 200 with a PDF buffer', async () => {
    const rootTemplate = {
      document_type: 'text',
      text: 'Here is some test text',
    };

    const response = await request(server)
      .post('/pdf')
      .send(rootTemplate)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');

    const isPDF = response.body.toString('utf8', 0,4) === '%PDF';
    expect(isPDF).toBe(true);
  });

  it('should generate a valid invoice PDF from a JSON template', async () => {
    const invoiceTemplate = {
      document_type: 'invoice',
      document_settings: {
        page_size: 'A4',
        margin: { top: 50, bottom: 50, left: 50, right: 50 },
        font_family: 'Helvetica',
        file_name: 'test_invoice'
      },
      company: {
        name: 'Test Name',
        address: '123 test st.',
        logo_url: 'https://placehold.co/200x200'
      },
      client: {
        name: 'Test Client',
        address: '456 client ave.',
        email: 'test@test.com',
      },
      line_items: [{
        name: 'Test Line Item',
        description: 'Test Description',
        quantity: 1,
        unit_price: 10,
        total: 10,
      }],
      totals: {
        subtotal: 10,
        tax_rate: 0.1,
        tax_amount: 1,
        grand_total: 10.10,
      }
    };

    const response = await request(server)
      .post('/pdf')
      .send(invoiceTemplate)
      .set('Content-Type', 'application/json');

    const { text } = await fromBuffer(Buffer.from(response.body));

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(text).toContain('Test Name');
    expect(text).toContain('Test Client');
    expect(text).toContain('Test Line Item');
  });
});

