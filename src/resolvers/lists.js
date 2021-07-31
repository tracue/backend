const { getUserIDFromHeaders } = require('../utils');
const { getMovieItem, validateGenres } = require('./movies');

module.exports = {
	Query: {},
	Mutation: {
		addToFavorites: async (_, { movieId }, ctx) =>
			addMovieToList(movieId, 'favorites', ctx),
		removeFromFavorites: async (_, { movieId }, ctx) =>
			removeMovieToList(movieId, 'favorites', ctx),
		addToWatched: async (_, { movieId }, ctx) =>
			addMovieToList(movieId, 'watched', ctx),
		removeFromWatched: async (_, { movieId }, ctx) =>
			removeMovieToList(movieId, 'watched', ctx),
		addToWatchLater: async (_, { movieId }, ctx) =>
			addMovieToList(movieId, 'watchLater', ctx),
		removeFromWatchLater: async (_, { movieId }, ctx) =>
			removeMovieToList(movieId, 'watchLater', ctx),
	},
	User: {
		favorites: async (_, __, ctx) =>
			retrieveUserListFromDatabase('favorites', ctx),
		watched: async (_, __, ctx) => retrieveUserListFromDatabase('watched', ctx),
		watchLater: async (_, __, ctx) =>
			retrieveUserListFromDatabase('watchLater', ctx),
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

const retrieveUserListFromDatabase = async (listName, ctx) => {
	const userId = getUserIDFromHeaders(ctx);
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
