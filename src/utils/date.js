export default {
	getYesterday: () => {
		const currentDate = new Date();
		currentDate.setDate(currentDate.getDate() - 1);
		return currentDate;
	},
	getLastWeek: () => {
		const currentDate = new Date();
		currentDate.setDate(currentDate.getDate() - 7);
		return currentDate;
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
