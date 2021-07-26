const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { permissions } = require('./permissions/permissions');
const typeDefs = require('./schema');
const authResolvers = require('./authentication/resolvers');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
require('dotenv').config();

const prisma = new PrismaClient();

const schema = makeExecutableSchema({ typeDefs, resolvers: [authResolvers] });
const server = new ApolloServer({
	schema: applyMiddleware(schema, permissions),
	context: ({ req }) => ({ prisma, req }),
	cors: { credentials: true, origin: '*' },
	debug: process.env.NODE_DEV === 'development',
});

server
	.listen()
	.then(({ url }) => console.log(`listening on ${url}`))
	.catch((e) => console.error(e))
	.finally(() => prisma.$disconnect());
