import * as TMDB from '../tdmb/lib.js';
import Token from '../utils/token.js';

export default {
	Query: {
		search: async (_, { input, limit }, { prisma }) => {
			let results = await TMDB.search(input);
			if (limit) {
				results = results.slice(0, limit);
			}
			await validateGenres(prisma);
			return results.map((item) => getMovieItem(item.id, prisma));
		},
		trending: async (_, { page, limit }, { prisma }) => {
			let { results, totalPages } = await TMDB.getTrending(page);
			if (limit) {
				results = results.slice(0, limit);
			}
			await validateGenres(prisma);
			const movies = await results.map((item) => getMovieItem(item.id, prisma));
			return { movies, totalPages };
		},
		upcoming: async (_, { limit }, { prisma }) => {
			let results = await TMDB.getUpcoming();
			if (limit) {
				results = results.slice(0, limit);
			}
			await validateGenres(prisma);
			return results.map((item) => getMovieItem(item.id, prisma));
		},
		genres: async (_, __, { prisma }) => {
			await validateGenres(prisma);
			return retrieveGenres(prisma);
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
				thumbnailUrl: TMDB.getThumbnailUrl(details.poster_path),
				backdropUrl: TMDB.getBackdropUrl(details.backdrop_path),
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
				thumbnailUrl: true,
				backdropUrl: true,
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
			data: genres.map((genre) => ({ name: genre.name, id: genre.id })),
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

export const retrieveGenres = async (prisma) => {
	return prisma.genre.findMany();
};
