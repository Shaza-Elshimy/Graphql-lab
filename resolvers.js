import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
    users: async (_, __, { dataSources }) => {
      return await dataSources.users.getUsers();
    },
    user: async (_, args, { dataSources }) => {
      return await dataSources.users.getUserById(args.id);
    },
    todos: async (_, __, { dataSources }) => {
      return await dataSources.todos.getTodos();
    },
    todo: async (_, args, { dataSources }) => {
      return await dataSources.todos.getTodoById(args.id);
    },
  },
  Mutation: {
    createUser: async (_, args, { dataSources }) => {
      const user = await dataSources.users.createUser(args.user);
      return user;
    },
    login: async (_, args, { dataSources }) => {
      const user = await dataSources.users.getUserByEmail(args.user.email);
      if (!user) {
        throw new GraphQLError("user not found");
      }
      const isMatch = await bcrypt.compare(args.user.password, user.password);
      if (!isMatch) {
        throw new GraphQLError("Invalid email or password");
      }

      let token = jwt.sign({ id: user._id, role: user.role }, "secretkey");
      return { message: "Login successful", token };
    },
    createTodo: async (_, args, { user, dataSources }) => {
      if (!user?.id) {
        throw new GraphQLError("Not authorized");
      }

      const todo = await dataSources.todos.createTodo({
        ...args.todo,
        userId: user.id,
      });
      return todo;
    },
    deleteTodo: async (_, args, { user, dataSources }) => {
      if (!user?.id) {
        throw new GraphQLError("Not authorized");
      }
      const todo = await dataSources.todos.getTodoById(args.id);
      if (!todo) {
        throw new GraphQLError("Todo not found");
      }
      if (todo.userId.toString() !== user.id) {
        throw new GraphQLError("Not authorized to delete this todo");
      }
      await dataSources.todos.deleteTodoById(args.id);
      return "Todo deleted successfully";
    },
    updateTodo: async (_, args, { user, dataSources }) => {
      if (!user?.id) {
        throw new GraphQLError("Not authorized");
      }
      const todo = await dataSources.todos.getTodoById(args.id);
      if (!todo) {
        throw new GraphQLError("Todo not found");
      }
      if (todo.userId.toString() !== user.id) {
        throw new GraphQLError("Not authorized to update this todo");
      }
      const updatedTodo = await dataSources.todos.updateTodoById(args.id, args.todo);
      return updatedTodo;
    },
  },
  User: {
    todos: async (parent, _, { dataSources }) => {
      return await dataSources.todos.getTodosByUserId(parent._id);
    },
  },
};