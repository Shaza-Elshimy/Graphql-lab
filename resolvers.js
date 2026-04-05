import User from "./models/users.js";

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
  },
};