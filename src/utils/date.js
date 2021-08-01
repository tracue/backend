export default {
	getYesterday: () => {
		return new Date(new Date().getDate() - 1);
	},
	getLastWeek: () => {
		return new Date(new Date().getDate() - 7);
	},
	getLastMonth: () => {
		const currentDate = new Date();
		currentDate.setMonth(currentDate.getMonth() - 1);
		return currentDate;
	},
	getLastSeason: () => {
		const currentDate = new Date();
		currentDate.setMonth(currentDate.getMonth() - 3);
		return currentDate;
	},
	getLastYear: () => {
		const currentDate = new Date();
		currentDate.setFullYear(currentDate.getFullYear() - 1);
		return currentDate;
	},
};
