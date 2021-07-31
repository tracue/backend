import { getUserIDFromHeaders } from '../utils.js';

export default {
	Query: {},
	Mutation: {
		addToFavorites: async (_, { movieId }, ctx) =>
			addMovieToList(movieId, 'favorites', ctx),
		removeFromFavorites: async (_, { movieId }, ctx) =>
			removeMovieToList(movieId, 'favorites', ctx),
		addToWatched: async (_, { movieId }, ctx) => {
			await removeMovieToList(movieId, 'watchLater', ctx);
			return addMovieToList(movieId, 'watched', ctx);
		},
		removeFromWatched: async (_, { movieId }, ctx) =>
			removeMovieToList(movieId, 'watched', ctx),
		addToWatchLater: async (_, { movieId }, ctx) =>
			addMovieToList(movieId, 'watchLater', ctx),
		removeFromWatchLater: async (_, { movieId }, ctx) =>
			removeMovieToList(movieId, 'watchLater', ctx),
	},
	User: {
		favorites: async ({ id }, _, { prisma }) =>
			retrieveUserListFromDatabase(id, 'favorites', prisma),
		watched: async ({ id }, _, { prisma }) =>
			retrieveUserListFromDatabase(id, 'watched', prisma),
		watchLater: async ({ id }, _, { prisma }) =>
			retrieveUserListFromDatabase(id, 'watchLater', prisma),
	},
};

const addMovieToList = async (movieId, listName, ctx) => {
	const userId = getUserIDFromHeaders(ctx);
	return ctx.prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			[listName]: {
				create: {
					movie: {
						connect: { id: movieId },
					},
				},
			},
		},
	});
};
const removeMovieToList = async (movieId, listName, ctx) => {
	const userId = getUserIDFromHeaders(ctx);
	return ctx.prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			[listName]: {
				delete: {
					userId_movieId: {
						userId,
						movieId,
					},
				},
			},
		},
	});
};

export const retrieveUserListFromDatabase = async (
	userId,
	listName,
	prisma
) => {
	return prisma.movie.findMany({
		where: {
			[listName]: {
				some: {
					user: {
						id: {
							equals: userId,
						},
					},
				},
			},
		},
	});
};
