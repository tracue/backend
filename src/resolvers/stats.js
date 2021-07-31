import { getUserIDFromHeaders } from '../utils.js';
import { retrieveUserListFromDatabase } from './lists.js';

export default {
	Query: {
		watchTime: async (_, __, ctx) => {
			const userId = getUserIDFromHeaders(ctx);
			try {
				const watchedMovies = await retrieveUserListFromDatabase(
					userId,
					'watched',
					ctx.prisma
				);
				const pastDay = filterCreationDate(watchedMovies, 1);
				const pastWeek = filterCreationDate(watchedMovies, 7);
				const pastMonth = filterCreationDate(watchedMovies, 30);
				const pastSeason = filterCreationDate(watchedMovies, 90);
				const pastYear = filterCreationDate(watchedMovies, 365);
				return {
					pastDay,
					pastWeek,
					pastMonth,
					pastSeason,
					pastYear,
				};
			} catch (e) {
				console.error(e);
			}
		},
	},
};

export const filterCreationDate = (movies, days) => {
	return movies
		.filter((movie) => movie.createdAt >= new Date(new Date().getDate() - days))
		.reduce((total, movie) => total + movie['length'], 0);
};
