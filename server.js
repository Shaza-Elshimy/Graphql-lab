import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
import mongoose from "mongoose";

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
});

console.log(`Server is running on ${info.url}`);