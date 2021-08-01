import DateUtil from '../utils/date.js';
import { retrieveUserListFromDatabase } from './lists.js';

export default {
	User: {
		watchTime: async ({ id }, __, ctx) => {
			try {
				const watchedMovies = await retrieveUserListFromDatabase(
					id,
					'watched',
					ctx.prisma
				);
				const pastDay = filterCreationDate(
					watchedMovies,
					DateUtil.getYesterday()
				);
				const pastWeek = filterCreationDate(
					watchedMovies,
					DateUtil.getLastWeek()
				);
				const pastMonth = filterCreationDate(
					watchedMovies,
					DateUtil.getLastMonth()
				);
				const pastSeason = filterCreationDate(
					watchedMovies,
					DateUtil.getLastSeason()
				);
				const pastYear = filterCreationDate(
					watchedMovies,
					DateUtil.getLastYear()
				);
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

export const filterCreationDate = (movies, inbound) => {
	return movies
		.filter((movie) => movie.createdAt >= inbound)
		.reduce((total, movie) => total + movie.length, 0);
};
