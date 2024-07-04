import React from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";

const topChannelsOptions = {
	chart: {
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: "55%",
			endingShape: "rounded",
		},
	},
	dataLabels: {
		enabled: false,
	},
	xaxis: {
		categories: ["Booking", "Expedia", "Airbnb", "Agoda", "Other"],
	},
	yaxis: {
		title: {
			text: "",
		},
	},
	fill: {
		opacity: 1,
	},
	tooltip: {
		y: {
			formatter: (val) => `${val}`,
		},
	},
};

const topChannelsSeries = [
	{
		name: "Top Channels",
		data: [
			{ x: "Booking", y: 250, fillColor: "#4285F4" },
			{ x: "Expedia", y: 200, fillColor: "#A142F4" },
			{ x: "Airbnb", y: 150, fillColor: "#FF6F61" },
			{ x: "Agoda", y: 100, fillColor: "#1DB2FF" },
			{ x: "Other", y: 75, fillColor: "#B2B2B2" },
		],
	},
];

const roomNightsOptions = {
	chart: {
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: "55%",
			endingShape: "rounded",
		},
	},
	dataLabels: {
		enabled: false,
	},
	xaxis: {
		categories: [
			"Single room",
			"Double room",
			"Twin room",
			"Queen room",
			"Family room",
			"Penthouse",
		],
	},
	yaxis: {
		title: {
			text: "",
		},
	},
	fill: {
		opacity: 1,
	},
	tooltip: {
		y: {
			formatter: (val) => `${val}`,
		},
	},
};

const roomNightsSeries = [
	{
		name: "Room Nights",
		data: [
			{ x: "Single room", y: 350, fillColor: "#E74C3C" },
			{ x: "Double room", y: 400, fillColor: "#FF7373" },
			{ x: "Twin room", y: 250, fillColor: "#1DB2FF" },
			{ x: "Queen room", y: 200, fillColor: "#9B59B6" },
			{ x: "Family room", y: 150, fillColor: "#3498DB" },
			{ x: "Penthouse", y: 100, fillColor: "#7F8C8D" },
		],
	},
];

const roomRevenueOptions = {
	chart: {
		type: "bar",
		toolbar: {
			show: false,
		},
	},
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: "55%",
			endingShape: "rounded",
		},
	},
	dataLabels: {
		enabled: false,
	},
	xaxis: {
		categories: [
			"Single room",
			"Double room",
			"Twin room",
			"Queen room",
			"Family room",
			"Penthouse",
		],
	},
	yaxis: {
		title: {
			text: "",
		},
	},
	fill: {
		opacity: 1,
	},
	tooltip: {
		y: {
			formatter: (val) => `${val} USD`,
		},
	},
};

const roomRevenueSeries = [
	{
		name: "Room Revenue",
		data: [
			{ x: "Single room", y: 50000, fillColor: "#E74C3C" },
			{ x: "Double room", y: 48000, fillColor: "#FF7373" },
			{ x: "Twin room", y: 35000, fillColor: "#1DB2FF" },
			{ x: "Queen room", y: 30000, fillColor: "#9B59B6" },
			{ x: "Family room", y: 25000, fillColor: "#3498DB" },
			{ x: "Penthouse", y: 20000, fillColor: "#7F8C8D" },
		],
	},
];

const FourthRow = () => {
	return (
		<FourthRowWrapper>
			<ChartCard>
				<ChartTitle>Top channels</ChartTitle>
				<Chart
					options={topChannelsOptions}
					series={topChannelsSeries}
					type='bar'
					height={250}
				/>
			</ChartCard>
			<ChartCard>
				<ChartTitle>Room nights by room types</ChartTitle>
				<Chart
					options={roomNightsOptions}
					series={roomNightsSeries}
					type='bar'
					height={250}
				/>
			</ChartCard>
			<ChartCard>
				<ChartTitle>Room revenue by room types</ChartTitle>
				<Chart
					options={roomRevenueOptions}
					series={roomRevenueSeries}
					type='bar'
					height={250}
				/>
			</ChartCard>
		</FourthRowWrapper>
	);
};

export default FourthRow;

const FourthRowWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	background-color: #f7f8fc;
`;

const ChartCard = styled.div`
	background-color: white;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ChartTitle = styled.h2`
	margin: 0 0 16px 0;
	font-size: 18px;
	font-weight: bold;
	align-self: flex-start;
`;
