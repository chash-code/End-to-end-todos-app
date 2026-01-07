```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import todoService from '../services/todo.service';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TodoCard from '../components/TodoCard';
import UpdateTodoModal from '../components/UpdateTodoModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TodosDashboard = () => {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [todos, filter]);

  const loadTodos = async () => {
    setLoading(true);
    const result = await todoService.getAllTodos(currentUser.uid);
    if (result.success) {
      setTodos(result.data);
    }
    setLoading(false);
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredTodos(todos);
    } else if (filter === 'completed') {
      setFilteredTodos(todos.filter(todo => todo.completed));
    } else if (filter === 'pending') {
      setFilteredTodos(todos.filter(todo => todo.pending));
    }
  };

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) return;

    const result = await todoService.createTodo(
      { title: newTodoTitle },
      currentUser.uid
    );

    if (result.success) {
      setNewTodoTitle('');
      loadTodos();
    }
  };

  const handleToggleStatus = async (todoId, currentStatus) => {
    await todoService.toggleTodoStatus(todoId, currentStatus);
    loadTodos();
  };

  const handleDeleteTodo = async (todoId) => {
    await todoService.deleteTodo(todoId);
    loadTodos();
  };

  const handleUpdateTodo = async (todoId, updates) => {
    await todoService.updateTodo(todoId, updates);
    setIsModalOpen(false);
    loadTodos();
  };

  const handleSelectTodo = (todo) => {
    setSelectedTodo(todo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} filter={filter} onFilterChange={setFilter} />
      
      <div className="flex">
        <Sidebar
          todos={todos}
          selectedTodo={selectedTodo}
          onSelectTodo={handleSelectTodo}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>
              <div className="flex gap-2">
                <Input
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
                />
                <Button onClick={handleCreateTodo}>Add Todo</Button>
              </div>
            </div>

            {selectedTodo ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Todo Details</h2>
                <TodoCard
                  todo={selectedTodo}
                  onToggle={handleToggleStatus}
                  onDelete={handleDeleteTodo}
                  onEdit={() => setIsModalOpen(true)}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4">All Todos</h2>
                {loading ? (
                  <p className="text-center text-gray-500">Loading todos...</p>
                ) : filteredTodos.length === 0 ? (
                  <p className="text-center text-gray-500">No todos found. Create one above!</p>
                ) : (
                  <div className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <div key={todo.id} onClick={() => handleSelectTodo(todo)}>
                        <TodoCard
                          todo={todo}
                          onToggle={handleToggleStatus}
                          onDelete={handleDeleteTodo}
                          onEdit={() => {
                            setSelectedTodo(todo);
                            setIsModalOpen(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && selectedTodo && (
        <UpdateTodoModal
          todo={selectedTodo}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateTodo}
        />
      )}
    </div>
  );
};

export default TodosDashboard;
```
