// pages/index.tsx
import { useState, useEffect } from 'react';

type Task = {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
};

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle adding a new task
  const addTask = async () => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });
    if (response.ok) {
      fetchTasks();
      setTitle('');
      setDescription('');
    }
  };

  // Handle updating an existing task
  const updateTask = async () => {
    if (!editId) return;
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editId, title, description }),
    });
    if (response.ok) {
      fetchTasks();
      setTitle('');
      setDescription('');
      setIsEditing(false);
      setEditId(null);
    }
  };

  // Handle deleting a task
  const deleteTask = async (id: string) => {
    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      fetchTasks();
    }
  };

  // Handle editing a task
  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(true);
    setEditId(task._id || null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Gerenciador de Tarefas</h1>
      <div className="mb-4">
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {isEditing ? (
          <button
            className="w-full p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            onClick={updateTask}
          >
            Atualizar Tarefa
          </button>
        ) : (
          <button
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={addTask}
          >
            Adicionar Tarefa
          </button>
        )}
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-white shadow-md rounded-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                onClick={() => handleEdit(task)}
              >
                Editar
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => deleteTask(task._id!)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
