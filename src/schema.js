const { gql } = require('apollo-server');

module.exports = gql`
	enum Gender {
		Male
		Female
		Other
		Unknown
	}

	type User {
		email: String!
		username: String!
		emailVerified: Boolean
		gender: Gender!
		bio: String
		avatar: String
		favorites: [Movie]
		watched: [Movie]
		toWatch: [Movie]
	}

	type Movie {
		id: String!
		tmdbId: Int!
		title: String!
		releaseDate: String
		description: String
		shortDescription: String
		genres: [String]!
		length: Int!
		posterUrl: String
		imdbUrl: String
		isFavorite: Boolean
		isWatched: Boolean
		isToWatch: Boolean
		favsCount: Int
		watchedCount: Int
		toWatchCount: Int
	}

	type Favorite {
		id: String!
		date: Int
		user: User!
		movie: Movie!
	}

	type Query {
		me: User!
		search(input: String!): [Movie]!
		trending(page: Int): [Movie]!
		movie(tmdbId: Int!): Movie!
	}

	input UserEditInput {
		username: String!
		gender: Gender
		bio: String
	}

	type Mutation {
		signup(email: String!, username: String!, password: String!): LoginResponse
		login(email: String!, password: String!): LoginResponse
		updateUser(input: UserEditInput): User!
	}

	type LoginResponse {
		token: String
		user: User
	}
`;
