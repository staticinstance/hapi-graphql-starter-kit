import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';
import {
GraphQLSchema,
GraphQLObjectType,
GraphQLString
} from 'graphql';

import Joi from 'joi';
import Pack from './package';

var data = require('./data.json');

// Define our user type, with two string fields; `id` and `name`
var userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        address: { type: GraphQLString }
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
        host: 'localhost',
        port: 3000
    });

const options = {
    info: {
            'title': 'Test API Documentation',
            'version': Pack.version,
        }
    };

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    }, {
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
                config: {
                    description: 'graphql',
                    notes: 'Returns a qraphql result',
                    tags: ['api'],
                    validate: {
                        query: {
                            query: Joi.string()
                                .required()
                                .description('the graphql query'),
                        }
                    }
                }
            }
        }
    }], (err) => {
        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });