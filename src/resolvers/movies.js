import * as TMDB from '../tdmb/lib.js';
import Token from '../utils/token.js';

export default {
	Query: {
		search: async (_, { input }, { prisma }) => {
			const results = await TMDB.search(input);
			await validateGenres(prisma);
			return results.map((item) => getMovieItem(item.id, prisma));
		},
		trending: async (_, { page }, { prisma }) => {
			const results = await TMDB.getTrending(page);
			await validateGenres(prisma);
			return results.map((item) => getMovieItem(item.id, prisma));
		},
		movie: async (_, { tmdbId }, { prisma }) => {
			await validateGenres(prisma);
			return getMovieItem(tmdbId, prisma);
		},
	},
	Movie: {
		genres: async (movie, _, { prisma }) => {
			const { genres } = await prisma.movie.findUnique({
				where: { id: movie.id },
				include: {
					genres: {
						select: { name: true },
					},
				},
			});
			return genres.map((g) => g.name);
		},
		isFavorite: async (movie, _, ctx) => isInList(movie.id, 'favorites', ctx),
		isWatched: async (movie, _, ctx) => isInList(movie.id, 'watched', ctx),
		isWatchLater: async (movie, _, ctx) =>
			isInList(movie.id, 'watchLater', ctx),
		counts: async (movie, _, { prisma }) => getCounts(movie.id, prisma),
	},
};

const getMovieItem = async (movieId, prisma) => {
	// see if is already in database
	const movie = await prisma.movie.findUnique({
		where: { tmdbId: movieId },
	});
	if (movie) {
		return movie;
	} else {
		// create and return if doesn't exist
		const details = await TMDB.getDetails(movieId);
		const genresData = details.genres.map((genre) => ({ name: genre.name }));
		return prisma.movie.create({
			data: {
				title: details.title,
				description: details.overview,
				shortDescription: details.tag_line,
				posterUrl: TMDB.getPosterUrl(details.poster_path),
				releaseDate: details.release_date,
				tmdbId: details.id,
				imdbUrl: details.imdb_id,
				length: details.runtime,
				genres: {
					connect: genresData,
				},
			},
			select: {
				tmdbId: true,
				id: true,
				title: true,
				releaseDate: true,
				shortDescription: true,
				description: true,
				length: true,
				imdbUrl: true,
				posterUrl: true,
			},
		});
	}
};

export const validateGenres = async (prisma) => {
	// check if genres have already been gathered
	// if not, request them from the api and create in database
	const genresCount = await prisma.genre.count();
	if (genresCount === 0) {
		const genres = await TMDB.getGenres();
		await prisma.genre.createMany({
			data: genres.map((genre) => ({ name: genre.name })),
		});
	}
};

export const isInList = async (movieId, listName, ctx) => {
	const userId = Token.getUserIDFromHeaders(ctx);
	const movies = await ctx.prisma.movie.findMany({
		where: {
			id: movieId,
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
	return movies.length > 0;
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
