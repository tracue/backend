const { getUserIDFromHeaders } = require('../utils');

module.exports = {
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
		favorites: async ({ id }, _, ctx) =>
			retrieveUserListFromDatabase(id, 'favorites', ctx),
		watched: async ({ id }, _, ctx) =>
			retrieveUserListFromDatabase(id, 'watched', ctx),
		watchLater: async ({ id }, _, ctx) =>
			retrieveUserListFromDatabase(id, 'watchLater', ctx),
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

const retrieveUserListFromDatabase = async (userId, listName, ctx) => {
	return ctx.prisma.movie.findMany({
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
