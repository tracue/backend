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
	Movie: {
		counts: async (movie, _, { prisma }) => getCounts(movie.id, prisma),
	},
};

export const filterCreationDate = (movies, inbound) => {
	console.log(inbound);
	console.log(typeof inbound);
	return movies
		.filter((movie) => {
			console.log(movie.createdAt);
			console.log(typeof movie.createdAt);
			return movie.createdAt >= inbound;
		})
		.reduce((total, movie) => total + movie.length, 0);
};

export const getCounts = async (movieId, prisma) => {
	return {
		favorites: getMovieListCount(movieId, 'favorites', prisma),
		watched: getMovieListCount(movieId, 'watched', prisma),
		watchLater: getMovieListCount(movieId, 'watchLater', prisma),
	};
};

export const getMovieListCount = async (movieId, listName, prisma) => {
	return prisma.user.count({
		where: {
			[listName]: {
				some: {
					movie: {
						id: movieId,
					},
				},
			},
		},
	});
};
