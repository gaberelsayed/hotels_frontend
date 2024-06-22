import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import Chart from "react-apexcharts";

const DonutChartCard = ({ chosenLanguage }) => {
	const translations = {
		English: {
			title: "Available Room Today",
		},
		Arabic: {
			title: "الغرف المتاحة اليوم",
		},
	};

	const { title } = translations[chosenLanguage] || translations.English;

	const pieChartOptions = {
		chart: {
			type: "donut",
			toolbar: {
				show: false,
			},
		},
		labels: [title],
		colors: ["#1E90FF", "#E0E0E0"], // Blue for available, gray for the rest
		dataLabels: {
			enabled: false, // Disable data labels on the chart
		},
		plotOptions: {
			pie: {
				donut: {
					size: "75%",
				},
			},
		},
		legend: {
			show: false,
		},
	};

	const pieChartSeries = [785, 215]; // 785 available rooms out of 1000

	return (
		<CardContainer>
			<StyledCard>
				<ChartWrapper>
					<Chart
						options={pieChartOptions}
						series={pieChartSeries}
						type='donut'
						height={140}
					/>
				</ChartWrapper>
				<CardContent>
					<CountText>785</CountText>
					<CardTitle>{title}</CardTitle>
				</CardContent>
			</StyledCard>
		</CardContainer>
	);
};

export default DonutChartCard;

const CardContainer = styled.div``;

const StyledCard = styled(Card)`
	border-radius: 12px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	text-align: center;
	padding: 20px;
`;

const ChartWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const CardContent = styled.div`
	text-align: center;
`;

const CountText = styled.div`
	font-size: 32px;
	font-weight: bold;
	margin-top: -10px; /* Adjust margin to align with the chart */
`;

const CardTitle = styled.div`
	font-size: 16px;
	color: #888;
`;
