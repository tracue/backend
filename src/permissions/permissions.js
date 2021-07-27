const { shield } = require('graphql-shield');
const { isAuthenticated } = require('./rules');
module.exports = {
	permissions: shield({
		Query: {
			me: isAuthenticated,
			searchMovies: isAuthenticated,
		},
		Mutation: {
			updateUser: isAuthenticated,
		},
	}),
};
