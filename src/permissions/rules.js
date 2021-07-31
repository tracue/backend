const { rule } = require('graphql-shield');
const { getAuthorizationFromHeaders } = require('../utils');

module.exports = {
	isAuthenticated: rule()(async (_, __, ctx) => {
		const auth = getAuthorizationFromHeaders(ctx);
		const user = await ctx.prisma.user.findUnique({
			where: {
				tokenVerifier: {
					id: auth.userId,
					lastSignIn: auth.lastSignIn,
				},
			},
		});
		return user !== null;
	}),
};
