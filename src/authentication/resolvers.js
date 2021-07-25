const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserIDFromHeaders } = require('../utils');

module.exports = {
	Query: {
		me: async (_, __, ctx) => {
			const userId = getUserIDFromHeaders(ctx);
			return ctx.prisma.user.findUnique({ where: { id: userId } });
		},
	},
	User: {
		favorites: async ({ id }, _, ctx) => {
			try {
				const { favorites } = await ctx.prisma.user.findUnique({
					where: { id },
					include: {
						favorites: {
							select: {
								movie: true,
							},
						},
					},
				});
				return favorites.map((item) => ({ ...item.movie }));
			} catch (e) {
				console.error(e);
				return null;
			}
		},
		watched: async ({ id }, _, ctx) => {
			try {
				const { watched } = await ctx.prisma.user.findUnique({
					where: { id },
					include: {
						watched: {
							select: {
								movie: true,
							},
						},
					},
				});
				return watched.map((item) => ({ ...item.movie }));
			} catch (e) {
				console.error(e);
				return null;
			}
		},
		toWatch: async ({ id }, _, ctx) => {
			try {
				const { toWatch } = await ctx.prisma.user.findUnique({
					where: { id },
					include: {
						toWatch: {
							select: {
								movie: true,
							},
						},
					},
				});
				return toWatch.map((item) => ({ ...item.movie }));
			} catch (e) {
				console.error(e);
				return null;
			}
		},
	},
	Movie: {
		genre: async ({ id }, _, { prisma }) => {
			try {
				const {
					genre: { name },
				} = await prisma.movie.findUnique({
					where: { id },
					include: {
						genre: {
							select: {
								name: true,
							},
						},
					},
				});
				return name;
			} catch (e) {
				console.error(e);
				return null;
			}
		},
	},
	Mutation: {
		signup: async (_, { email, username, password }, { prisma }) => {
			if (await prisma.user.findUnique({ where: { email: email } })) {
				throw new Error('Email already exists');
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await prisma.user.create({
				data: {
					password: hashedPassword,
					email: email,
					username: username,
				},
			});
			const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
			return { token, user };
		},
		login: async (_, { email, password }, { prisma }) => {
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				throw new Error('Wrong Credentials');
			}
			const validation = await bcrypt.compare(password, user.password);
			if (!validation) {
				throw new Error('Wrong Credentials');
			}
			const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
			return { token, user };
		},
	},
};
