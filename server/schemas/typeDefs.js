const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    bookId: ID!
    authors: [String]!
    description: String
    image: String
    title: String!
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int
  }

  type Auth{
    token: ID!
    user: User
  }
  
  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    image: String
    title: String!
    link: String
  }
  
  type Query {
    me: User
  }

 

  type Mutation {
    addUser(username: String!, email: String!, password: String!):Auth
    login(email:String!, password: String!):Auth
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
