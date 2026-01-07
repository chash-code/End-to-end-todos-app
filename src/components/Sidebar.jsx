```javascript
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const Sidebar = ({ todos, selectedTodo, onSelectTodo }) => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-4 h-[calc(100vh-73px)] overflow-y-auto">
      <h3 className="font-semibold mb-4 text-lg">All Todos ({todos.length})</h3>
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
```
