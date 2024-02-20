// getExcelDate.js
export const getExcelDate = (dateString) => {
	const date = new Date(dateString);
	const time = date.getTime();
	const excelStartDate = new Date("1899-12-30").getTime();
	const daysSinceExcelStart = Math.floor(
		(time - excelStartDate) / (24 * 60 * 60 * 1000)
	);
	return daysSinceExcelStart;
};
