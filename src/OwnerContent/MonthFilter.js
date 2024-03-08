import React from "react";
import styled from "styled-components";
import { Button } from "antd";

const monthsEnglish = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const monthsArabic = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
];

const MonthFilter = ({
	selectedMonth,
	setSelectedMonth,
	selectedHotelName,
	setSelectedHotelName,
	chosenLanguage,
}) => {
	const months = chosenLanguage === "Arabic" ? monthsArabic : monthsEnglish;

	return (
		<MonthFilterWrapper>
			{months.map((month, index) => (
				<MonthButton
					key={index}
					selected={monthsEnglish[index] === selectedMonth}
					onClick={() => setSelectedMonth(monthsEnglish[index])}
				>
					{month}
				</MonthButton>
			))}
		</MonthFilterWrapper>
	);
};

export default MonthFilter;

const MonthFilterWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 10px;
	margin-bottom: 20px;
`;

const MonthButton = styled(Button)`
	width: calc(100% / 12 - 10px);
	background-color: ${({ selected }) => (selected ? "#b37400" : "transparent")};
	color: ${({ selected }) => (selected ? "#fff" : "#000")};
	border: ${({ selected }) => (selected ? "none" : "1px solid #b37400")};
	&:hover {
		color: white !important;
		background-color: orange;
		border: 1px solid #b37400 !important;
	}

	@media (max-width: 768px) {
		width: calc(16.666% - 10px); /* 6 months per line */
	}

	@media (max-width: 480px) {
		width: calc(25% - 10px); /* 4 months per line */
	}
`;
