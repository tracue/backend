const { shield } = require('graphql-shield');
const { isAuthenticated } = require('./rules');
module.exports = {
	permissions: shield({
		Query: {
			me: isAuthenticated,
			search: isAuthenticated,
			trending: isAuthenticated,
			movie: isAuthenticated,
		},
		Mutation: {
			updateUser: isAuthenticated,
		},
	}),
};
