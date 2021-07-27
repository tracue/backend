const { default: axios } = require('axios');
require('dotenv').config();

const API_KEY = process.env.TMDB_KEY;

const search = async (query) => {
	const url = 'https://api.themoviedb.org/3/search/movie';
	const {
		data: { results },
	} = await axios.get(url, {
		params: { api_key: API_KEY, query },
	});

	return results.slice(0, 5);
};

module.exports.search = search;
const details = async (id) => {
	const url = `https://api.themoviedb.org/3/movie/${id}`;
	const { data } = await axios.get(url, {
		params: { api_key: API_KEY },
	});
	return data;
};

module.exports.details = details;

const getPosterUrl = (poster_path) => {
	return `https://image.tmdb.org/t/p/w500${poster_path}`;
};

module.exports.getPosterUrl = getPosterUrl;
