export const schema = `#graphql
type Query {
  hello: String
  users: [User]
  user(id: ID!): User
}

type User {
    id: ID
    username: String
    email: String
    role: String
    password: String
  }

type Mutation {
  createUser(user: UserInput): User
  login(user: LoginInput): LoginResponse
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

`