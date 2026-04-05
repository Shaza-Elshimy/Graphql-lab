import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserDataSource } from "./datasources/userDataSource.js";
import { TodoDataSource } from "./datasources/todoDataSource.js";

mongoose
  .connect("mongodb://127.0.0.1:27017/graphqlDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
});

const info = await startStandaloneServer(server, {
  listen: {
    port: 3000,
  },
  context: async ({ req }) => {
    let { authorization } = req.headers;
    let user = null;

    if (authorization) {
      try {
        const token = authorization.startsWith("Bearer ")
          ? authorization.split(" ")[1]
          : authorization;

        const decoded = jwt.verify(token, "secretkey");
        user = decoded;
      } catch (err) {
        console.log("Invalid token", err);
      }
    }

    return {
      user,
      dataSources: {
        users: new UserDataSource(),
        todos: new TodoDataSource(),
      },
    };
  },
});

console.log(`Server is running on ${info.url}`);