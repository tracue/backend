const jwt = require('jsonwebtoken');

module.exports.getUserIDFromHeaders = (ctx) => {
	const authToken = ctx.req.headers.authorization;
	const token = jwt.verify(authToken, process.env.SECRET_KEY);
	return token.userId;
};
