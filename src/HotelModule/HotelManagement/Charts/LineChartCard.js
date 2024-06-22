import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import Chart from "react-apexcharts";

const LineChartCard = ({ chosenLanguage }) => {
	const translations = {
		English: {
			title: "Reservation Statistic",
			subtitle: "Day over day summary",
			checkIn: "Check In",
			checkOut: "Check Out",
		},
		Arabic: {
			title: "إحصائيات الحجز",
			subtitle: "ملخص يومي",
			checkIn: "تسجيل دخول",
			checkOut: "تسجيل خروج",
		},
	};

	const { title, subtitle, checkIn, checkOut } =
		translations[chosenLanguage] || translations.English;

	const chartOptions = {
		chart: {
			id: "reservation-statistic",
			toolbar: {
				show: false,
			},
		},
		xaxis: {
			categories: [
				"01",
				"02",
				"03",
				"04",
				"05",
				"06",
				"07",
				"08",
				"09",
				"10",
				"11",
				"12",
			],
		},
		stroke: {
			curve: "smooth",
		},
		fill: {
			type: "gradient",
			gradient: {
				shade: "light",
				type: "vertical",
				shadeIntensity: 0.5,
				gradientToColors: ["#87CEEB", "#FFA07A"],
				opacityFrom: 0.7,
				opacityTo: 0.9,
			},
		},
		colors: ["#aac7fe", "#f68d8d"],
		dataLabels: {
			enabled: false,
		},
		grid: {
			borderColor: "#f1f1f1",
		},
	};

	const chartSeries = [
		{
			name: checkIn,
			data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
		},
		{
			name: checkOut,
			data: [200, 330, 548, 670, 540, 480, 690, 900, 1100, 1000],
		},
	];

	return (
		<StyledCard>
			<CardHeader>
				<HeaderContent>
					<div>
						<ChartTitle>{title}</ChartTitle>
						<Subtitle>{subtitle}</Subtitle>
					</div>
					<Stats>
						<StatItem>
							<StatNumber className='mx-2'>549</StatNumber> {checkIn}
						</StatItem>
						<StatItem>
							<StatNumber className='mx-2'>327</StatNumber> {checkOut}
						</StatItem>
					</Stats>
				</HeaderContent>
			</CardHeader>

			<ChartWrapper>
				<Chart
					options={chartOptions}
					series={chartSeries}
					type='area'
					height={480} // Adjust height to match combined height of the charts on the right
				/>
			</ChartWrapper>
		</StyledCard>
	);
};

export default LineChartCard;

const StyledCard = styled(Card)`
	border-radius: 12px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	padding: 0; // Remove extra padding
	text-align: center;
`;

const CardHeader = styled.div`
	padding: 20px; // Add padding for header
`;

const HeaderContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ChartTitle = styled.div`
	font-size: 18px;
	font-weight: bold;
`;

const Subtitle = styled.div`
	font-size: 14px;
	text-align: center;
	color: #888;
	margin-bottom: 8px;
`;

const Stats = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const StatItem = styled.div`
	display: flex;
	align-items: center;
	color: #888;
`;

const StatNumber = styled.span`
	font-size: 18px;
	color: #000;
	font-weight: bold;
	margin-right: 4px;
`;

const ChartWrapper = styled.div`
	width: 100%; // Ensure chart takes full width
`;
