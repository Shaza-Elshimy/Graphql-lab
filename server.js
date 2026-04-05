import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
const server  = new ApolloServer({
    typeDefs:schema,
    resolvers:resolvers

}
);
const info = await startStandaloneServer(server, {  
        listen:{
        port:5000
    }
})
console.log(`Server is running on ${info.url}`);