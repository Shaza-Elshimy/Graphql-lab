import Todo from "../models/todos.js";

export class TodoDataSource {
  async getTodos() {
    return Todo.find();
  }

  async getTodoById(id) {
    return Todo.findById(id);
  }

  async getTodosByUserId(userId) {
    return Todo.find({ userId });
  }

  async createTodo(todoInput) {
    return Todo.create(todoInput);
  }

  async deleteTodoById(id) {
    return Todo.findByIdAndDelete(id);
  }

  async updateTodoById(id, todoInput) {
    return Todo.findByIdAndUpdate(id, todoInput, { new: true });
  }
}
