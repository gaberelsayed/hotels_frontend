import React from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";

const bookingOptions = {
	chart: {
		type: "line",
		toolbar: {
			show: false,
		},
	},
	stroke: {
		curve: "smooth",
		width: 2,
	},
	xaxis: {
		categories: [
			"01-Mar-2023",
			"02-Mar-2023",
			"03-Mar-2023",
			"04-Mar-2023",
			"05-Mar-2023",
			"06-Mar-2023",
			"07-Mar-2023",
		],
	},
	yaxis: {
		title: {
			text: "",
		},
	},
	colors: ["#66BB6A"],
	tooltip: {
		y: {
			formatter: (val) => `${val}`,
		},
	},
};

const bookingSeries = [
	{
		name: "Booking",
		data: [30, 40, 35, 50, 49, 60, 70],
	},
];

const visitorsOptions = {
	chart: {
		type: "line",
		toolbar: {
			show: false,
		},
	},
	stroke: {
		curve: "smooth",
		width: 3,
	},
	xaxis: {
		categories: ["10am", "2pm", "6pm", "11pm"],
	},
	yaxis: {
		title: {
			text: "",
		},
	},
	colors: ["#A5D6A7", "#66BB6A"],
	tooltip: {
		y: {
			formatter: (val) => `${val}`,
		},
	},
};

const visitorsSeries = [
	{
		name: "Yesterday",
		data: [10, 20, 30, 40],
	},
	{
		name: "Today",
		data: [20, 40, 35, 50],
	},
];

const FifthRow = () => {
	return (
		<FifthRowWrapper>
			<ChartCardLarge>
				<ChartHeader>
					<ChartTitle>Booking</ChartTitle>
					<ChartSubtitle>Last update 1m ago</ChartSubtitle>
					<ChartTimeframe>Last 7 days</ChartTimeframe>
				</ChartHeader>
				<Chart
					options={bookingOptions}
					series={bookingSeries}
					type='line'
					height={250}
				/>
			</ChartCardLarge>
			<ChartCardSmall>
				<ChartHeader>
					<ChartTitle>Visitors Over Time</ChartTitle>
				</ChartHeader>
				<Chart
					options={visitorsOptions}
					series={visitorsSeries}
					type='line'
					height={250}
				/>
				<Legend>
					<LegendItem color='#A5D6A7'>Yesterday</LegendItem>
					<LegendItem color='#66BB6A'>Today</LegendItem>
				</Legend>
			</ChartCardSmall>
		</FifthRowWrapper>
	);
};

export default FifthRow;

const FifthRowWrapper = styled.div`
	display: grid;
	grid-template-columns: 65% 35%;
	gap: 16px;
	background-color: #f7f8fc;
`;

const ChartCardLarge = styled.div`
	background-color: white;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
`;

const ChartCardSmall = styled.div`
	background-color: white;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ChartHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ChartTitle = styled.h2`
	margin: 0;
	font-size: 18px;
	font-weight: bold;
`;

const ChartSubtitle = styled.p`
	margin: 0;
	font-size: 12px;
	color: gray;
`;

const ChartTimeframe = styled.p`
	margin: 0;
	font-size: 14px;
	color: #66bb6a;
`;

const Legend = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 16px;
`;

const LegendItem = styled.div`
	display: flex;
	align-items: center;
	color: ${(props) => props.color};
	font-size: 14px;
	margin: 0 8px;
`;
