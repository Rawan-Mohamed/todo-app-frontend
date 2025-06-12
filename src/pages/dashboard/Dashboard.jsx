import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Plus, CheckCircle, Circle, Edit3, Trash2 } from 'lucide-react';
import { todoApi } from '../../api/todoApi';
import toast from 'react-hot-toast';


const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await todoApi.getTodos();
      const todos = response.data?.todos || response.todos || [];
      setTodos(Array.isArray(todos) ? todos : []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch todos');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      setLoading(true);
      const response = await todoApi.createTodo(newTodo.trim());
      const todo = response.data?.todo || response.todo || response;
      setTodos(prev => [...prev, todo]);
      setNewTodo('');
      toast.success('Todo created!');
    } catch (error) {
      toast.error(error.message || 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      setLoading(true);
      const response = await todoApi.updateTodo(id, updates);
      const updatedTodo = response.data?.todo || response.todo || response;
      setTodos(prev => prev.map(todo =>
        todo._id === id ? updatedTodo : todo
      ));
      toast.success('Todo updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setLoading(true);
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      toast.success('Todo deleted!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditText(todo.title);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      handleUpdateTodo(id, { title: editText.trim() });
      setEditingTodo(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleCreateTodo}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !newTodo.trim()}
                className="d-flex align-items-center gap-2 bg-color"
              >
                <Plus size={20} />
                Add
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <div className="mb-4">
        {loading && todos.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 mb-0">Loading your todos...</p>
            </Card.Body>
          </Card>
        ) : Array.isArray(todos) && todos.length === 0 ? (
          <Card>
            <Card.Body className="text-center py-5">
              <CheckCircle size={48} className="text-muted mb-3" />
              <h4>No todos yet</h4>
              <p className="text-muted mb-0">Create your first todo to get started!</p>
            </Card.Body>
          </Card>
        ) : (
          Array.isArray(todos) && todos.map((todo) => (
            <Card key={todo._id} className="todo-card mb-3">
              <Card.Body>
                <div className="d-flex align-items-center gap-3">
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={() => handleUpdateTodo(todo._id, { completed: !todo.completed })}
                  >
                    {todo.completed ? (
                      <CheckCircle size={24} className="text-success" />
                    ) : (
                      <Circle size={24} className="text-muted" />
                    )}
                  </Button>
                  <div className="flex-grow-1">
                    {editingTodo === todo._id ? (
                      <div className="d-flex gap-2">
                        <Form.Control
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                          autoFocus
                        />
                        <Button variant="success" onClick={() => saveEdit(todo._id)}>
                          Save
                        </Button>
                        <Button variant="secondary" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className={`mb-1 ${todo.completed ? 'completed' : ''}`}>
                          {todo.title}
                        </p>
                        <small className="text-muted">
                          {(() => {
                            const dateStr = todo.createdAt || (todo.todo && todo.todo.createdAt);
                            const date = dateStr ? new Date(dateStr) : null;
                            return date && !isNaN(date) ? `Created ${date.toLocaleDateString()}` : 'Created Unknown';
                          })()}
                        </small>
                      </>
                    )}
                  </div>
                  {editingTodo !== todo._id && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => startEditing(todo)}
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTodo(todo._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
      {todos.length > 0 && (
        <Row>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="mb-0">{todos.length}</h3>
                <p className="text-muted mb-0">Total Todos</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="mb-0 text-success">
                  {todos.filter(t => t.completed).length}
                </h3>
                <p className="text-muted mb-0">Completed</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <h3 className="mb-0 text-primary">
                  {todos.filter(t => !t.completed).length}
                </h3>
                <p className="text-muted mb-0">Remaining</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Dashboard; 