import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
import {
GraphQLSchema,
GraphQLObjectType,
GraphQLString
} from 'graphql';

const Joi = require('joi')
var data = require('./data.json');

const Pack = require('./package');

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