import React from "react";

import { Table } from "antd";
import {
	FaExclamationCircle,
	FaCheckCircle,
	FaTimesCircle,
	FaBed,
	FaUser,
	FaCalendarAlt,
	FaClipboardCheck,
	FaRegClipboard,
	FaEllipsisV,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import styled from "styled-components";

const data = [
	{
		key: "1",
		guest: "Bessie Cooper",
		guestId: "7105394985258",
		accommodation: "Standard Single - STS (219)",
		stay: "09/09/22 - 09/10/22",
		status: "Check out",
		amount: "$430.00",
	},
	{
		key: "2",
		guest: "Theresa Webb",
		guestId: "7105394985258",
		accommodation: "Standard Single - STS (219)",
		stay: "09/09/22 - 09/13/22",
		status: "Check out",
		amount: "",
	},
	{
		key: "3",
		guest: "Dianne Kilmarnock-Thomas",
		guestId: "7105394985258",
		accommodation: "Deluxe King - DLX (341)",
		stay: "09/09/22 - 09/12/22",
		status: "Check out",
		amount: "",
	},
	{
		key: "4",
		guest: "Cameron Harrison",
		guestId: "7105394985258",
		accommodation: "Deluxe King - DLX (341)",
		stay: "09/09/22 - 09/12/22",
		status: "Check out",
		amount: "",
	},
];

const SecondRow = ({ chosenLanguage, translations }) => {
	const t = translations[chosenLanguage] || translations.English;

	const columns = [
		{
			title: chosenLanguage === "Arabic" ? "اسم الضيف" : "Guest",
			dataIndex: "guest",
			key: "guest",
			render: (text, record) => (
				<>
					<div style={{ fontWeight: "bold" }}>{text}</div>
					<div style={{ color: "grey" }}>{record.guestId}</div>
				</>
			),
		},
		{
			title: chosenLanguage === "Arabic" ? "الإقامة" : "Accommodation",
			dataIndex: "accommodation",
			key: "accommodation",
		},
		{
			title: chosenLanguage === "Arabic" ? "الفترة" : "Stay",
			dataIndex: "stay",
			key: "stay",
			render: (stay) => (
				<StayColumn>
					<div>{stay}</div>
					<StayIcons>
						<IconWrapper>
							<FaBed /> 1
						</IconWrapper>
						<IconWrapper>
							<FaUser /> 2
						</IconWrapper>
						<IconWrapper>
							<FaCalendarAlt /> 0
						</IconWrapper>
					</StayIcons>
				</StayColumn>
			),
		},
		{
			title: chosenLanguage === "Arabic" ? "الحالة" : "Status",
			dataIndex: "status",
			key: "status",
			render: (status, record) => (
				<StatusButton>
					{status}
					{record.amount && <Amount>{record.amount}</Amount>}
				</StatusButton>
			),
		},
		{
			title: "",
			dataIndex: "actions",
			key: "actions",
			render: () => (
				<Actions>
					<ActionButton>
						<FaClipboardCheck />
					</ActionButton>
					<ActionButton>
						<FaRegClipboard />
					</ActionButton>
					<ActionButton>
						<FaEllipsisV />
					</ActionButton>
				</Actions>
			),
		},
	];

	const pieChartOptions = {
		chart: {
			type: "donut",
			toolbar: {
				show: false,
			},
		},
		colors: ["#0069cf", "#00a753", "#636363"], // Colors for booked, available, and blocked
		dataLabels: {
			enabled: false,
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

	const pieChartSeries = [60, 35, 5]; // Example data

	return (
		<SecondRowWrapper>
			<LeftSection>
				<SmallInfoCard backgroundColor='#E1F5FE'>
					<CardTitle2>{t.cancellations}</CardTitle2>
					<CardNumber
						style={{
							color: "white",
							background: "#c48989",
							borderRadius: "25%",
							padding: "5px",
							fontSize: "16px",
						}}
					>
						26
					</CardNumber>
				</SmallInfoCard>
				<SmallInfoCard backgroundColor='#EDE7F6'>
					<CardTitle2>{t.noShow}</CardTitle2>
					<CardNumber
						style={{
							color: "white",
							background: "#89a6c4",
							borderRadius: "25%",
							padding: "5px",
							fontSize: "16px",
						}}
					>
						26
					</CardNumber>
				</SmallInfoCard>
				<InfoCard backgroundColor='#E1F5FE'>
					<CardTitle2>{t.individuals}</CardTitle2>
					<SmallCardRow>
						<SmallCardTitle>{t.individuals}</SmallCardTitle>
						<SmallCardNumber>5</SmallCardNumber>
					</SmallCardRow>
					<SmallCardRow>
						<SmallCardTitle>{t.online}</SmallCardTitle>
						<SmallCardNumber>49</SmallCardNumber>
					</SmallCardRow>
					<SmallCardRow>
						<SmallCardTitle>{t.company}</SmallCardTitle>
						<SmallCardNumber>13</SmallCardNumber>
					</SmallCardRow>
				</InfoCard>
			</LeftSection>
			<MiddleSection>
				<ChartCard>
					<Chart
						options={pieChartOptions}
						series={pieChartSeries}
						type='donut'
						height={230}
					/>
					<CardTitle3>{t.occupancy}</CardTitle3>
					<LegendVertical>
						<LegendItem color='#0069cf'>
							<FaCheckCircle /> {t.booked} 60%
						</LegendItem>
						<LegendItem color='#00a753'>
							<FaTimesCircle /> {t.available} 35%
						</LegendItem>
						<LegendItem color='#636363'>
							<FaExclamationCircle /> {t.blocked} 5%
						</LegendItem>
					</LegendVertical>
				</ChartCard>
			</MiddleSection>
			<RightSection style={{ background: "#fff" }}>
				<InfoTable dataSource={data} columns={columns} pagination={false} />
			</RightSection>
		</SecondRowWrapper>
	);
};

export default SecondRow;

// Second row styling
const SecondRowWrapper = styled.div`
	display: grid;
	grid-template-columns: 15% 15% 70%;
	gap: 16px;
`;

// Small info card styling
const SmallInfoCard = styled.div`
	background-color: ${(props) => props.backgroundColor};
	border-radius: 8px;
	padding: 8px;
	text-align: center;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	font-size: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

// Small card row styling for individuals, online, and company
const SmallCardRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

// Small card title styling
const SmallCardTitle = styled.div`
	font-size: 16px;
`;

// Small card number styling
const SmallCardNumber = styled.div`
	font-size: 16px;
	font-weight: bold;
	color: #1e88e5;
`;

// Chart card styling
const ChartCard = styled.div`
	background-color: ${(props) => props.backgroundColor};
	border-radius: 8px;
	padding: 16px;
	text-align: center;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

// Legend styling for vertical alignment
const LegendVertical = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin-top: 16px;
`;

// Legend item styling
const LegendItem = styled.div`
	display: flex;
	align-items: center;
	color: ${(props) => props.color};
	font-size: 14px;
	font-weight: bold;
	margin: 4px 0;
`;

// Define LeftSection
const LeftSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

// Define MiddleSection
const MiddleSection = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

// Card title styling Second Row
const CardTitle2 = styled.div`
	font-size: 18px;
	font-weight: bold;
	color: black;
	text-align: left;
`;

// Card title styling Third Row
const CardTitle3 = styled.div`
	font-size: 18px;
	font-weight: bold;
	color: black;
	text-align: left;
`;

const InfoTable = styled(Table)`
	.ant-table-thead > tr > th {
		background-color: #fafafa;
	}
	.ant-table-tbody > tr > td {
		background-color: #fff;
	}
`;

const RightSection = styled.div`
	display: flex;
	flex-direction: column;
`;

const StayColumn = styled.div`
	display: flex;
	flex-direction: column;
`;

const StayIcons = styled.div`
	display: flex;
	gap: 8px;
`;

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

const StatusButton = styled.div`
	background-color: #1e88e5;
	color: white;
	padding: 4px 16px;
	border-radius: 20px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	width: 200px; /* Fixed width */
`;

const Amount = styled.span`
	background-color: white;
	color: #1e88e5;
	padding: 4px 8px;
	border-radius: 10px;
	font-weight: bold;
`;

const Actions = styled.div`
	display: flex;
	gap: 8px;
	justify-content: center;
`;

const ActionButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #1e88e5;
	font-size: 18px;

	&:hover {
		color: #0056b3;
	}
`;

// Info card styling
const InfoCard = styled.div`
	background-color: ${(props) => props.backgroundColor};
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	height: 100%;
`;

// Card number styling
const CardNumber = styled.div`
	font-size: 25px;
	font-weight: bold;
	/* color: #1e88e5; */
	color: black;
	margin: auto 10px !important;
`;
