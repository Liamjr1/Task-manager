import React, { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false); // For initial load
  const [isAdding, setIsAdding] = useState(false); // For the "Add" button
  const [error, setError] = useState('');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Could not fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // Add a new task
  const addTask = async () => {
    if (!title.trim()) return;
    try {
      setIsAdding(true);
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
      setTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle task
  const toggleTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}/toggle`, { 
        method: 'PATCH' 
      });
      if (!res.ok) throw new Error('Failed to toggle task');
      const updatedTask = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Task Manager</h1>

      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task"
          style={{ flex: 1, padding: 8 }}
        />
        <button
          onClick={addTask}
          disabled={!title.trim() || isAdding}
          style={{ padding: '8px 12px', marginLeft: 8 }}
        >
          {isAdding ? '...' : 'Add'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <li
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                padding: '10px',
                marginBottom: 8,
                borderRadius: '4px',
                background: '#f9f9f9',
                cursor: 'pointer',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#999' : '#000',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <input 
                type="checkbox" 
                checked={task.completed} 
                readOnly 
                style={{ marginRight: 10 }} 
              />
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;