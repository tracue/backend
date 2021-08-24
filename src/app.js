import { ApolloServer } from 'apollo-server';
import Prisma from '@prisma/client';
import { permissions } from './permissions/permissions.js';
import typeDefs from './schema.js';
import statsResolvers from './resolvers/stats.js';
import listsResolvers from './resolvers/lists.js';
import authResolvers from './resolvers/user.js';
import moviesResolvers from './resolvers/movies.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new Prisma.PrismaClient();

const schema = makeExecutableSchema({
	typeDefs,
	resolvers: [authResolvers, moviesResolvers, listsResolvers, statsResolvers],
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
