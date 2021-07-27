const TMDB = require('../tdmb/lib');
module.exports = {
	Query: {
		searchMovies: async (_, { input }, { prisma }) => {
			const results = await TMDB.search(input);
			return results.map(async (item) => {
				// see if is already in database
				const movie = await prisma.movie.findUnique({
					where: { tmdbId: item.id },
				});
				if (movie) {
					return movie;
				} else {
					// create and return if doesn't exist
					const details = await TMDB.details(item.id);
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
			});
		},
	},
	Movie: {
		genres: async (movie, _, { prisma }) => {
			const { genres } = await TMDB.details(movie.tmdbId);
			return genres.map(async (item) => {
				const genre = await prisma.genre.findUnique({
					where: { name: item.name },
				});
				if (genre) {
					return genre.name;
				} else {
					const { name } = await prisma.genre.create({
						data: {
							name: item.name,
						},
					});
					return name;
				}
			});
		},
	},
};
