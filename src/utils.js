import jwt from 'jsonwebtoken';

export const getUserIDFromHeaders = (ctx) => {
	const authToken = ctx.req.headers.authorization;
	const token = jwt.verify(authToken, process.env.SECRET_KEY);
	return token.userId;
};

export const getAuthorizationFromHeaders = (ctx) => {
	const authToken = ctx.req.headers.authorization;
	return jwt.verify(authToken, process.env.SECRET_KEY);
};
