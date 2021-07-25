const { rule } = require('graphql-shield');
const { getUserIDFromHeaders } = require('../utils');

module.exports = {
	isAuthenticated: rule()(async (parent, args, ctx, info) => {
		const id = getUserIDFromHeaders(ctx);
		const user = await ctx.prisma.user.findUnique({
			where: { id },
		});
		return user !== null;
	}),
};
