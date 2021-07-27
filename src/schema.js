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
		uuid: String!
		title: String!
		year: Int
		description: String
		shortDescription: String
		genre: String
		length: Int!
		posterUrl: String
		imdbUrl: String
		ratingIMDB: Int
		ratingRotten: Int
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
