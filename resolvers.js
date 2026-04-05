import { users } from "./_db.js"
export const resolvers = {
    Query: {
        hello: () => {
            return "Hello world!"
        },
        users: () => {
            return users   
        }
    }
}