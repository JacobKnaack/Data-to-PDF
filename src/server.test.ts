import { describe, it, expect } from 'vitest';

import request from 'supertest';
import server from './server';

describe('PDF Generation Service', () => {
  it('Should return a 200 with a PDF buffer', async () => {
    const testData = {
      text: 'Here is some test content',
    };

    const response = await request(server)
      .post('/pdf')
      .send(testData)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/pdf');

    const isPDF = response.body.toString('utf8', 0,4) === '%PDF';
    expect(isPDF).toBe(true);
  });
});

