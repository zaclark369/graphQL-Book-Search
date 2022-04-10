const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
   
  }
  type Book {
      bookId: String
      authors: Array<BookAuthor>
      description: String
      title: String
      image: Image
      link: String
  }

   

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId:   authors: [String!]
      description: String!
      title: String!
      bookId: ID!
      image: String
      link: String):User
    removeBook(bookId: ID!):user
    
  }
`;

module.exports = typeDefs;
