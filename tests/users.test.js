const request = require('supertest');
const app = require('../index');

describe('User API', () => {
  beforeEach(() => {
    // No explicit reset yet – basic smoke tests only
  });

  it('should return health message on root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User API is running');
  });

  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Alice');
    expect(res.body.email).toBe('alice@example.com');
  });

  it('should list users', async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Bob', email: 'bob@example.com' });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a user by id', async () => {
    const createRes = await request(app)
      .post('/users')
      .send({ name: 'Charlie', email: 'charlie@example.com' });

    const id = createRes.body.id;
    const res = await request(app).get(`/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });

  it('should return 404 for unknown user', async () => {
    const res = await request(app).get('/users/9999');
    expect(res.statusCode).toBe(404);
  });

  it('should update a user with PUT', async () => {
    const createRes = await request(app)
      .post('/users')
      .send({ name: 'Dave', email: 'dave@example.com' });

    const id = createRes.body.id;
    const res = await request(app)
      .put(`/users/${id}`)
      .send({ name: 'Dave Updated', email: 'dave.updated@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Dave Updated');
    expect(res.body).toHaveProperty('email', 'dave.updated@example.com');
  });

  it('should partially update a user with PATCH', async () => {
    const createRes = await request(app)
      .post('/users')
      .send({ name: 'Eve', email: 'eve@example.com' });

    const id = createRes.body.id;
    const res = await request(app)
      .patch(`/users/${id}`)
      .send({ email: 'eve.updated@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'eve.updated@example.com');
  });

  it('should delete a user', async () => {
    const createRes = await request(app)
      .post('/users')
      .send({ name: 'Frank', email: 'frank@example.com' });

    const id = createRes.body.id;
    const res = await request(app).delete(`/users/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });
});
