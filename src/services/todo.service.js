```javascript
import axios from 'axios';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

class TodoService {
  constructor() {
    this.collectionName = 'todos';
  }

  // Create a new todo
  async createTodo(todoData, userId) {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...todoData,
        userId,
        completed: false,
        pending: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return {
        success: true,
        id: docRef.id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all todos for a user
  async getAllTodos(userId) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const todos = [];
      
      querySnapshot.forEach((doc) => {
        todos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        data: todos
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update todo
  async updateTodo(todoId, updates) {
    try {
      const todoRef = doc(db, this.collectionName, todoId);
      await updateDoc(todoRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Toggle todo status
  async toggleTodoStatus(todoId, currentStatus) {
    try {
      const todoRef = doc(db, this.collectionName, todoId);
      await updateDoc(todoRef, {
        completed: !currentStatus,
        pending: currentStatus,
        updatedAt: Timestamp.now()
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete todo
  async deleteTodo(todoId) {
    try {
      await deleteDoc(doc(db, this.collectionName, todoId));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new TodoService();
```
