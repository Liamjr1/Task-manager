import React, { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchTasks();
  }, []);

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        width: 400,
        background: '#fff',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 20 }}>
           Task Manager
        </h1>

        <div style={{ display: 'flex', marginBottom: 16 }}>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: '1px solid #ddd',
              outline: 'none'
            }}
          />
          <button
            onClick={addTask}
            disabled={!title.trim() || isAdding}
            style={{
              marginLeft: 8,
              padding: '10px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: !title.trim() || isAdding ? 'not-allowed' : 'pointer',
              background: title.trim() ? '#667eea' : '#ccc',
              color: '#fff',
              cursor: 'pointer',
              opacity: isAdding ? 0.7 : 1
            }}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: 10 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading tasks...</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li
                key={task.id}
                onClick={() => toggleTask(task.id)}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 8,
                  background: task.completed ? '#f1f1f1' : '#f9f9f9',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: '0.2s',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#888' : '#333'
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
    </div>
  );
}

export default App;
