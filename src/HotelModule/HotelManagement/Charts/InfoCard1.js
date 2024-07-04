import React from "react";
import CountUp from "react-countup";
import { Card } from "antd";
import {
	NewBookingsIcon,
	ScheduleRoomIcon,
	CheckInIcon,
	CheckOutIcon,
} from "../Charts/SvgIcons";
import styled from "styled-components";

const InfoCard1 = ({ chosenLanguage, translations }) => {
	const { newBookings, scheduleRoom, checkIn, checkOut } =
		translations[chosenLanguage] || translations.English;

	return (
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
	);
};

export default InfoCard1;

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
