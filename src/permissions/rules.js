import { rule } from 'graphql-shield';
import { getAuthorizationFromHeaders } from '../utils.js';

export const isAuthenticated = rule()(async (_, __, ctx) => {
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
});
