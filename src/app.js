const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { permissions } = require('./permissions/permissions');
const typeDefs = require('./schema');
const listsResolvers = require('./resolvers/lists');
const authResolvers = require('./resolvers/auth');
const moviesResolvers = require('./resolvers/movies');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
require('dotenv').config();

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
	typeDefs,
	resolvers: [authResolvers, moviesResolvers, listsResolvers],
});
const server = new ApolloServer({
	schema: applyMiddleware(schema, permissions),
	context: ({ req }) => ({ prisma, req }),
	cors: { credentials: true, origin: '*' },
	debug: process.env.NODE_DEV === 'development',
});

server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url }) => console.log(`listening on ${url}`))
	.catch((e) => console.error(e))
	.finally(() => prisma.$disconnect());
