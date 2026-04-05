import { GraphQLError } from "graphql";
import User from "./models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Todo from "./models/todos.js";

export const resolvers = {
  Query: {
    hello: () => {
      return "Hello world!";
    },
    users: async () => {
      return await User.find();
    },
    user: async (_, args) => {
      return await User.findById(args.id);
    },
    todos: async () => {
      return await Todo.find();
    },
    todo: async (_, args) => {
      return await Todo.findById(args.id);
    }   
  },
  Mutation: {
    createUser: async (_, args) => {
      const user = await User.create(args.user);
      return user;
    },
    login: async (_, args) => {
      const user = await User.findOne({ email: args.user.email });
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
    createTodo: async (_, args,context) => {
        if (!context?.id) {
            throw new GraphQLError("Not authorized");
        }

      const todo = await Todo.create({...args.todo, userId: context.id });
      return todo;
    },
    deleteTodo: async (_, args, context) => {
        if (!context?.id) {
            throw new GraphQLError("Not authorized");
        }
        const todo = await Todo.findById(args.id);
        if (!todo) {
            throw new GraphQLError("Todo not found");
        }
        if (todo.userId.toString() !== context.id) {
            throw new GraphQLError("Not authorized to delete this todo");
        }
        await Todo.findByIdAndDelete(args.id);
        return "Todo deleted successfully";
    },
    updateTodo: async (_, args, context) => {
        if (!context?.id) {
            throw new GraphQLError("Not authorized");
        }
        const todo = await Todo.findById(args.id);
        if (!todo) {
            throw new GraphQLError("Todo not found");
        }
        if (todo.userId.toString() !== context.id) {
            throw new GraphQLError("Not authorized to update this todo");
        }
        const updatedTodo = await Todo.findByIdAndUpdate(args.id, args.todo, { new: true });
        return updatedTodo;
    }
    
  },
  User:{
    todos: async (parent) => {
        const todo = await Todo.find({ userId: parent._id });
        return await todo;
        }
  }
};