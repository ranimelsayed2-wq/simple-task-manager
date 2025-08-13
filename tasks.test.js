const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const Task = mongoose.model('Task');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  it('should fetch all tasks', async () => {
    await Task.create({ title: 'Task 1' });
    await Task.create({ title: 'Task 2' });

    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBe(2);
  });

  it('should update a task', async () => {
    const task = await Task.create({ title: 'Old Title' });

    const res = await request(app)
      .put(`/tasks/${task._id}`)
      .send({ title: 'New Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New Title');
  });

  it('should delete a task', async () => {
    const task = await Task.create({ title: 'To Delete' });

    const res = await request(app).delete(`/tasks/${task._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });
});
