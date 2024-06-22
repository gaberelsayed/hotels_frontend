import React from "react";
import styled from "styled-components";
import { Card } from "antd";
import CountUp from "react-countup";
import DonutChartCard from "./Charts/DonutChartCard";
import LineChartCard from "./Charts/LineChartCard";
import HorizontalBarChartCard from "./Charts/HorizontalBarChartCard";
import {
	NewBookingsIcon,
	ScheduleRoomIcon,
	CheckInIcon,
	CheckOutIcon,
} from "./Charts/SvgIcons";

const Dashboard = ({ chosenLanguage }) => {
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

	const { newBookings, scheduleRoom, checkIn, checkOut } =
		translations[chosenLanguage] || translations.English;

	return (
		<DashboardWrapper dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
			<InfoCardsGrid>
				<InfoCard
					gradientColors={
						chosenLanguage === "Arabic"
							? ["#00f2fe", "#4facfe"]
							: ["#4facfe", "#00f2fe"]
					}
				>
					<InfoCardContentWrapper>
						<InfoCardContent>
							<CountUp end={872} />
							<InfoCardTitle>{newBookings}</InfoCardTitle>
						</InfoCardContent>
						<InfoCardIcon>
							<NewBookingsIcon />
						</InfoCardIcon>
					</InfoCardContentWrapper>
				</InfoCard>
				<InfoCard
					gradientColors={
						chosenLanguage === "Arabic"
							? ["#38f9d7", "#43e97b"]
							: ["#43e97b", "#38f9d7"]
					}
				>
					<InfoCardContentWrapper>
						<InfoCardContent>
							<CountUp end={285} />
							<InfoCardTitle>{scheduleRoom}</InfoCardTitle>
						</InfoCardContent>
						<InfoCardIcon>
							<ScheduleRoomIcon />
						</InfoCardIcon>
					</InfoCardContentWrapper>
				</InfoCard>
				<InfoCard
					gradientColors={
						chosenLanguage === "Arabic"
							? ["#fbd786", "#ffa927"]
							: ["#ffa927", "#fbd786"]
					}
				>
					<InfoCardContentWrapper>
						<InfoCardContent>
							<CountUp end={53} />
							<InfoCardTitle>{checkIn}</InfoCardTitle>
						</InfoCardContent>
						<InfoCardIcon>
							<CheckInIcon />
						</InfoCardIcon>
					</InfoCardContentWrapper>
				</InfoCard>
				<InfoCard
					gradientColors={
						chosenLanguage === "Arabic"
							? ["#fad0c4", "#ff9a9e"]
							: ["#ff9a9e", "#fad0c4"]
					}
				>
					<InfoCardContentWrapper>
						<InfoCardContent>
							<CountUp end={78} />
							<InfoCardTitle>{checkOut}</InfoCardTitle>
						</InfoCardContent>
						<InfoCardIcon>
							<CheckOutIcon />
						</InfoCardIcon>
					</InfoCardContentWrapper>
				</InfoCard>
			</InfoCardsGrid>

			<ChartsGrid className='mt-4'>
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

export default Dashboard;

const DashboardWrapper = styled.div`
	padding: 24px;
	background-color: #f7f8fc;
`;

// Grid for the info cards
const InfoCardsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr); // Four equal columns
	gap: 25px; // Even gap between the cards
`;

// Wrapper for the content inside the info cards
const InfoCardContentWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
`;

// InfoCard component styled from antd Card
const InfoCard = styled(Card)`
	border-radius: 12px;
	color: #fff;
	height: 120px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	opacity: 0.85;
	background: linear-gradient(
		to right,
		${(props) => props.gradientColors[0]},
		${(props) => props.gradientColors[1]}
	);
`;

// Content inside the InfoCard
const InfoCardContent = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	justify-content: center;
	span {
		font-size: 2rem;
		font-weight: bold;
	}
`;

// Title inside the InfoCard
const InfoCardTitle = styled.div`
	font-size: 20px;
	font-weight: bold;
	margin-top: 8px;
`;

// Icon inside the InfoCard
const InfoCardIcon = styled.div`
	font-size: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px;
	border-radius: 50%;
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
