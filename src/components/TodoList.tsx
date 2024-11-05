import React, { useState } from 'react';
import { ListTodo, Plus, Trash2, Check, X } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-purple-400" />
          <h2 className="text-purple-400 font-semibold">Todo List</h2>
        </div>
        {todos.some(todo => todo.completed) && (
          <button
            onClick={clearCompleted}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 bg-purple-900/20 border border-purple-500/30 rounded p-2 text-purple-100 placeholder-purple-400/50"
          />
          <button
            onClick={addTodo}
            disabled={!newTodo.trim()}
            className="p-2 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-2 bg-purple-900/20 rounded p-2"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`p-1 rounded-full border ${
                  todo.completed
                    ? 'border-green-500 text-green-500'
                    : 'border-purple-500 text-purple-500'
                }`}
              >
                {todo.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
              <span
                className={`flex-1 text-purple-100 ${
                  todo.completed ? 'line-through opacity-50' : ''
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;