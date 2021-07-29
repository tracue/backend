const TMDB = require('../tdmb/lib');
module.exports = {
	Query: {
		search: async (_, { input }, { prisma }) => {
			const results = await TMDB.search(input);
			return results.map(async (item) => getMovieItem(item.id, prisma));
		},
		trending: async (_, { page }, { prisma }) => {
			const results = await TMDB.getTrending(!page ? 1 : page);
			return results.map(async (item) => getMovieItem(item.id, prisma));
		},
	},
	Movie: {
		genres: async (movie, _, { prisma }) => {
			const movieGenres = await prisma.genre.findMany({
				where: {
					movies: {
						every: { id: movie.id },
					},
				},
			});
			if (movieGenres.length > 0) {
				return movieGenres.map((g) => g.name);
			} else {
				try {
					const { genres } = await TMDB.details(movie.tmdbId);
					return genres.map(async (item) => {
						const { name } = await prisma.genre.upsert({
							where: { name: item.name },
							update: {
								movies: {
									connect: { id: movie.id },
								},
							},
							create: {
								name: item.name,
								movies: {
									connect: { id: movie.id },
								},
							},
						});
						return name;
					});
				} catch (e) {
					console.error(e);
				}
			}
		},
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
		const details = await TMDB.details(movieId);
		return prisma.movie.create({
			data: {
				title: details.title,
				description: details.overview,
				shortDescription: details.tag_line,
				posterUrl: TMDB.getPosterUrl(details.poster_path),
				year: parseInt(details.release_date.split('-')[0]),
				tmdbId: details.id,
				imdbUrl: details.imdb_id,
				length: details.runtime,
			},
			select: {
				tmdbId: true,
				id: true,
				title: true,
				year: true,
				shortDescription: true,
				description: true,
				length: true,
				imdbUrl: true,
				posterUrl: true,
			},
		});
	}
};
