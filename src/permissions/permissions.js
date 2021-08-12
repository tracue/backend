import { shield } from 'graphql-shield';
import { isAuthenticated } from './rules.js';
export const permissions = shield({
	Query: {
		me: isAuthenticated,
		search: isAuthenticated,
		trending: isAuthenticated,
		movie: isAuthenticated,
		upcoming: isAuthenticated,
		genres: isAuthenticated,
	},
	Mutation: {
		updateUser: isAuthenticated,
		addToFavorites: isAuthenticated,
		removeFromFavorites: isAuthenticated,
		addToWatched: isAuthenticated,
		removeFromWatched: isAuthenticated,
		addToWatchLater: isAuthenticated,
		removeFromWatchLater: isAuthenticated,
	},
});
