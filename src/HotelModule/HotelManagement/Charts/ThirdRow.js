import React from "react";
import { Table } from "antd";
import Chart from "react-apexcharts";
import styled from "styled-components";

const roomData = [
	{
		key: "1",
		type: "Standard",
		available: 9,
		sold: 1,
		outOfOrder: 0,
		total: 10,
	},
	{
		key: "2",
		type: "Lux",
		available: 3,
		sold: 2,
		outOfOrder: 0,
		total: 5,
	},
	{
		key: "3",
		type: "Double",
		available: 6,
		sold: 4,
		outOfOrder: 0,
		total: 10,
	},
];

const pieChartOptions = {
	chart: {
		type: "donut",
		toolbar: {
			show: false,
		},
	},
	colors: ["#4CAF50", "#FFC107", "#F44336"], // Colors for clean, cleaning, and dirty
	dataLabels: {
		enabled: false,
	},
	plotOptions: {
		pie: {
			donut: {
				size: "70%",
				labels: {
					show: true,
					name: {
						show: true,
						fontSize: "24px",
						fontWeight: "bold",
						color: "#333",
						offsetY: -10,
					},
					value: {
						show: false,
					},
					total: {
						show: true,
						label: "25",
						color: "#333",
						fontSize: "24px",
						fontWeight: "bold",
					},
				},
			},
		},
	},
	legend: {
		show: false,
	},
	labels: ["Clean", "Cleaning", "Dirty"],
};

const pieChartSeries = [25, 0, 0]; // Example data for housekeeping

const ThirdRow = ({ chosenLanguage }) => {
	const roomColumns = [
		{
			title: chosenLanguage === "Arabic" ? "النوع" : "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: chosenLanguage === "Arabic" ? "المتاح" : "Available",
			dataIndex: "available",
			key: "available",
		},
		{
			title: chosenLanguage === "Arabic" ? "المباع" : "Sold",
			dataIndex: "sold",
			key: "sold",
		},
		{
			title:
				chosenLanguage === "Arabic"
					? "خارج النظام/الخدمة"
					: "Out Of Order/Service",
			dataIndex: "outOfOrder",
			key: "outOfOrder",
		},
		{
			title: chosenLanguage === "Arabic" ? "المجموع" : "Total",
			dataIndex: "total",
			key: "total",
		},
	];

	return (
		<ThirdRowWrapper>
			<TableWrapper>
				<TableTitle>
					{chosenLanguage === "Arabic" ? "الغرف" : "Rooms"}
				</TableTitle>
				<StyledTable
					dataSource={roomData}
					columns={roomColumns}
					pagination={false}
				/>
			</TableWrapper>
			<ChartWrapper>
				<ChartHeader>
					<ChartTitle>
						{chosenLanguage === "Arabic" ? "التنظيف" : "Housekeeping"}
					</ChartTitle>
					<ShowAllLink>
						{chosenLanguage === "Arabic" ? "عرض الكل" : "Show all"}
					</ShowAllLink>
				</ChartHeader>
				<Chart
					options={pieChartOptions}
					series={pieChartSeries}
					type='donut'
					height={200}
				/>
				<LegendList>
					<LegendItem>
						<LegendDot color='#4CAF50' />
						Clean 25
					</LegendItem>
					<LegendItem>
						<LegendDot color='#FFC107' />
						Cleaning 0
					</LegendItem>
					<LegendItem>
						<LegendDot color='#F44336' />
						Dirty 0
					</LegendItem>
				</LegendList>
			</ChartWrapper>
		</ThirdRowWrapper>
	);
};

export default ThirdRow;

const ThirdRowWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
`;

const TableWrapper = styled.div`
	padding: 16px;
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableTitle = styled.h2`
	margin: 0 0 16px 0;
	font-size: 18px;
	font-weight: bold;
`;

const StyledTable = styled(Table)`
	.ant-table {
		background-color: transparent;
	}
	.ant-table-tbody > tr:nth-child(odd) {
		background-color: #f7f8fa; // Light grey for odd rows
	}
	.ant-table-tbody > tr:nth-child(even) {
		background-color: #fff; // White for even rows
	}
`;

const ChartWrapper = styled.div`
	padding: 16px;
	background-color: white;
	border-radius: 8px;
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

const ShowAllLink = styled.a`
	color: #1e88e5;
	cursor: pointer;
	font-size: 14px;
	text-decoration: underline;
`;

const LegendList = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	margin-top: 16px;
`;

const LegendItem = styled.div`
	display: flex;
	align-items: center;
	color: ${(props) => props.color};
	font-size: 14px;
	margin: 4px 0;
`;

const LegendDot = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	margin-right: 8px;
`;
