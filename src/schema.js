import { gql } from 'apollo-server';

export default gql`
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
		watchLater: [Movie]
		watchTime: WatchTime
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
		thumbnailUrl: String
		backdropUrl: String
		imdbUrl: String
		isFavorite: Boolean
		isWatched: Boolean
		isWatchLater: Boolean
		counts: MovieCountStat
	}

	type Genre {
		name: String!
		id: Int!
	}

	type MovieCountStat {
		favorites: Int
		watched: Int
		watchLater: Int
	}

	type Favorite {
		id: String!
		date: Int
		user: User!
		movie: Movie!
	}

	type WatchTime {
		pastDay: Int
		pastWeek: Int
		pastMonth: Int
		pastSeason: Int
		pastYear: Int
	}

	type PaginatedList {
		movies: [Movie]!
		totalPages: Int
	}

	type Query {
		me: User!
		search(input: String!): [Movie]!
		trending(page: Int): PaginatedList!
		upcoming: [Movie]!
		movie(tmdbId: Int!): Movie!
		genres: [Genre]!
	}

	input UserEditInput {
		username: String!
		gender: Gender
		bio: String
	}

	input PasswordEditInput {
		oldPassword: String!
		newPassword: String!
	}

	type Mutation {
		signup(email: String!, username: String!, password: String!): LoginResponse
		login(email: String!, password: String!): LoginResponse
		updateUser(input: UserEditInput): User!
		changeEmail(newEmail: String): User!
		changePassword(input: PasswordEditInput): User!
		addToFavorites(movieId: String!): User!
		removeFromFavorites(movieId: String!): User!
		addToWatched(movieId: String!): User!
		removeFromWatched(movieId: String!): User!
		addToWatchLater(movieId: String!): User!
		removeFromWatchLater(movieId: String!): User!
	}

	type LoginResponse {
		token: String
		user: User
	}
`;
