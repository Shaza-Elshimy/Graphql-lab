export const schema = `#graphql
type Query {
  hello: String
  users: [User]
  user(id: ID!): User
  todos: [Todo]
  todo(id: ID!): Todo
}

type User {
    id: ID
    username: String
    email: String
    role: String
    password: String
    todos: [Todo]
  }
type Todo {
    id: ID
    title: String
    status: String
    userId: ID
}

type Mutation {
  createUser(user: UserInput): User
  login(user: LoginInput): LoginResponse
  createTodo(todo: TodoInput): Todo
}

  input UserInput {
    username: String!
    email: String!
    password: String!
    role: String
}

input LoginInput {
  email: String!
  password: String!
}

type LoginResponse {
  message: String
  token: String
}

input TodoInput {
  title: String!
  status: String
  userId: ID
}

`