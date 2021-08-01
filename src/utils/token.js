import jwt from 'jsonwebtoken';

export default {
	sign: (id, lastSignIn) => {
		return jwt.sign(
			{ userId: id, lastSignIn: lastSignIn },
			process.env.SECRET_KEY
		);
	},
	getAuthorizationFromHeaders: (ctx) => {
		const authToken = ctx.req.headers.authorization;
		return jwt.verify(authToken, process.env.SECRET_KEY);
	},
	getUserIDFromHeaders: (ctx) => {
		const authToken = ctx.req.headers.authorization;
		const token = jwt.verify(authToken, process.env.SECRET_KEY);
		return token.userId;
	},
};
