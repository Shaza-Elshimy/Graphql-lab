import { GraphQLError } from "graphql";
import User from "./models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    }
  },
};