// import request from 'supertest';
// import app from '../src/app';

// describe('GET /health', () => {
//   it('should return health status', async () => {
//     const response = await request(app).get('/health');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('status', 'OK');
//     expect(response.body).toHaveProperty('timestamp');
//   });
// });

// describe('404 Handler', () => {
//   it('should return 404 for unknown routes', async () => {
//     const response = await request(app).get('/nonexistent-route');
//     expect(response.status).toBe(404);
//     expect(response.body).toHaveProperty('error', 'Route not found');
//   });
// });
