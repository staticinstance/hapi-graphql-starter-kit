import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

var data = require('./data.json');

// Define our user type, with two string fields; `id` and `name`
var userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

const server = new Hapi.Server();
server.connection({
  port: 3000
});

server.register({
  register: GraphQL,
  options: {
    // query: {
    //   schema: TestSchema,
    //   rootValue: {},
    //   pretty: false
    // },
    // OR
    
    query: (request) => ({
      schema: schema,
      rootValue: {},
      pretty: false
    }),
    route: {
      path: '/graphql',
      config: {}
    }
  }
}, () =>
  server.start(() =>
    console.log('Server running at:', server.info.uri)
  )
);
