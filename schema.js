export const schema = `#graphql
type Query {
  hello: String
  users: [User]
}
  type User {
    id: ID
    name: String
    username: String
    email: String
  }
`