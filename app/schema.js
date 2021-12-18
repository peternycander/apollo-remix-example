const { gql } = require("@apollo/client");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const typeDefs = gql`
  type User {
    id: ID!
    name: String
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    currentUserUpdate(name: String): CurrentUserUpdateResponse!
  }

  type CurrentUserUpdateResponse {
    updatedUser: User
    error: Boolean # In a real-world scenario, you should probably use an interface instead of a Boolean here
  }
`;

const mockUser = {
  id: 1,
  name: null,
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      currentUser: () => mockUser,
    },
    Mutation: {
      currentUserUpdate: (_, { name }) => {
        mockUser.name = name;
        return {
          updatedUser: mockUser,
        };
      },
    },
  },
});
