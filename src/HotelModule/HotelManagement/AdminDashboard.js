import React from "react";
import styled from "styled-components";
import DonutChartCard from "./Charts/DonutChartCard";
import LineChartCard from "./Charts/LineChartCard";
import HorizontalBarChartCard from "./Charts/HorizontalBarChartCard";
import Dashboard from "./Charts/Dashboard";
// eslint-disable-next-line
import InfoCard1 from "./Charts/InfoCard1";

const AdminDashboard = ({ chosenLanguage }) => {
	// eslint-disable-next-line
	const translations = {
		English: {
			newBookings: "New Bookings",
			scheduleRoom: "Schedule Room",
			checkIn: "Check In",
			checkOut: "Check Out",
		},
		Arabic: {
			newBookings: "حجوزات جديدة",
			scheduleRoom: "جدولة الغرفة",
			checkIn: "تسجيل دخول",
			checkOut: "تسجيل خروج",
		},
	};

	return (
		<DashboardWrapper dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
			<Dashboard chosenLanguage={chosenLanguage} />

			{/* <>
				<InfoCard1
					chosenLanguage={chosenLanguage}
					translations={translations}
				/>
			</> */}

			<ChartsGrid>
				<ChartsWrapper>
					<DonutChartCard chosenLanguage={chosenLanguage} />
					<HorizontalBarChartCard chosenLanguage={chosenLanguage} />
				</ChartsWrapper>
				<LineChartWrapper>
					<LineChartCard chosenLanguage={chosenLanguage} />
				</LineChartWrapper>
			</ChartsGrid>
		</DashboardWrapper>
	);
};

export default AdminDashboard;

const DashboardWrapper = styled.div`
	padding: 24px;
	background-color: #f7f8fc;
`;

// Grid for the charts
const ChartsGrid = styled.div`
	display: grid;
	grid-template-columns: 2fr 5fr; // Two columns with a ratio of 2:5
	gap: 25px; // Even gap between the charts
	align-items: start; // Align items to the start of the grid
`;

// Wrapper for the two charts on the left
const ChartsWrapper = styled.div`
	display: grid;
	grid-template-rows: 1fr 1fr; // Two equal rows
	gap: 25px; // Even gap between the charts
	height: 200px; // Combined height for both charts
`;

// Wrapper for the line chart on the right
const LineChartWrapper = styled.div``;
