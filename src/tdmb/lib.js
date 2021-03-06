import axios from 'axios';

const API_KEY = process.env.TMDB_KEY;

export const search = async (query) => {
	const url = 'https://api.themoviedb.org/3/search/movie';
	const {
		data: { results },
	} = await axios.get(url, {
		params: { api_key: API_KEY, query },
	});

	return results;
};

export const getTrending = async (page = 1) => {
	const url = 'https://api.themoviedb.org/3/trending/movie/week';
	const {
		data: { results, total_pages: totalPages },
	} = await axios.get(url, {
		params: { api_key: API_KEY, page },
	});
	return { results, totalPages };
};
export const getUpcoming = async () => {
	const url = 'https://api.themoviedb.org/3/movie/upcoming';
	const {
		data: { results },
	} = await axios.get(url, {
		params: { api_key: API_KEY },
	});

	return results;
};

export const getDetails = async (id) => {
	const url = `https://api.themoviedb.org/3/movie/${id}`;
	const { data } = await axios.get(url, {
		params: { api_key: API_KEY },
	});
	return data;
};

export const getGenres = async () => {
	const url = `https://api.themoviedb.org/3/genre/movie/list`;
	const {
		data: { genres },
	} = await axios.get(url, {
		params: { api_key: API_KEY },
	});
	return genres;
};

export const getPosterUrl = (poster_path) => {
	return `https://image.tmdb.org/t/p/w500${poster_path}`;
};

export const getThumbnailUrl = (poster_path) => {
	return `https://image.tmdb.org/t/p/w200${poster_path}`;
};

export const getBackdropUrl = (backdrop_path) => {
	return `https://image.tmdb.org/t/p/original${backdrop_path}`;
};
