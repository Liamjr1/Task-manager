const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const tasks = [];

app.get('/', (req, res) => {
  res.send('API running');
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = {
  id: Date.now().toString(),
  title: title.trim(),
  completed: false,
  createdAt: new Date()
};
    tasks.push(newTask);
    res.status(201).json(newTask);
});
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.patch('/tasks/:id/toggle', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    task.completed = !task.completed;
    res.json(task);
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
