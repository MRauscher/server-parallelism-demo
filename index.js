const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory users "database"
let users = [];
let nextId = 1;

// Health/root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'User API is running' });
});

// Create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const newUser = { id: nextId++, name, email };
  users.push(newUser);

  res.status(201).json(newUser);
});

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get single user by id
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Update user completely (PUT)
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[index] = { id, name, email };
  res.json(users[index]);
});

// Partially update user (PATCH)
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;

  res.json(user);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deleted = users.splice(index, 1)[0];
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
