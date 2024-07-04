import React from "react";
import styled from "styled-components";

import ThirdRow from "./ThirdRow";
import FourthRow from "./FourthRow";
import FifthRow from "./FifthRow";
import SecondRow from "./SecondRow";

const translations = {
	English: {
		arrivals: "Arrivals",
		departures: "Departures",
		inHouse: "In-house",
		stayovers: "Stayovers",
		booking: "Booking",
		overBookings: "OverBookings",
		cancellations: "Cancellations",
		noShow: "No show",
		occupancy: "Occupancy",
		individuals: "Individuals",
		online: "Online",
		company: "Company",
		availableRoomToday: "Available Room Today",
		booked: "Booked",
		available: "Available",
		blocked: "Blocked",
		type: "Type",
		availableRooms: "Available",
		sold: "Sold",
		outOfOrder: "Out Of Order/Service",
		total: "Total",
		housekeeping: "Housekeeping",
		clean: "Clean",
		cleaning: "Cleaning",
		dirty: "Dirty",
	},
	Arabic: {
		arrivals: "الوصول",
		departures: "المغادرة",
		inHouse: "في المنزل",
		stayovers: "البقاء",
		booking: "الحجز",
		overBookings: "الحجوزات الزائدة",
		cancellations: "الإلغاءات",
		noShow: "عدم الحضور",
		occupancy: "الإشغال",
		individuals: "الأفراد",
		online: "عبر الإنترنت",
		company: "شركة",
		availableRoomToday: "الغرف المتاحة اليوم",
		booked: "محجوزة",
		available: "متاحة",
		blocked: "مغلقة",
		type: "النوع",
		availableRooms: "متاح",
		sold: "مباع",
		outOfOrder: "خارج الخدمة",
		total: "المجموع",
		housekeeping: "التدبير المنزلي",
		clean: "نظيف",
		cleaning: "تنظيف",
		dirty: "متسخ",
	},
};

const Dashboard = ({ chosenLanguage = "English" }) => {
	const t = translations[chosenLanguage] || translations.English;

	return (
		<DashboardWrapper dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
			<FirstRow>
				<InfoCard backgroundColor='#E3F2FD'>
					<CardNumber>26</CardNumber>
					<CardTitle>{t.arrivals}</CardTitle>
					<Badge>5</Badge>
				</InfoCard>
				<InfoCard backgroundColor='#F3E5F5'>
					<CardNumber>12</CardNumber>
					<CardTitle>{t.departures}</CardTitle>
					<Badge>3</Badge>
				</InfoCard>
				<InfoCard backgroundColor='#E8F5E9'>
					<CardNumber>37</CardNumber>
					<CardTitle>{t.inHouse}</CardTitle>
				</InfoCard>
				<InfoCard backgroundColor='#FFF3E0' border>
					<CardNumber>25</CardNumber>
					<CardTitle>{t.stayovers}</CardTitle>
				</InfoCard>
				<InfoCard backgroundColor='#FFFDE7'>
					<CardNumber>16</CardNumber>
					<CardTitle>{t.booking}</CardTitle>
				</InfoCard>
				<InfoCard backgroundColor='#FFEBEE'>
					<CardNumber>14</CardNumber>
					<CardTitle>{t.overBookings}</CardTitle>
				</InfoCard>
			</FirstRow>

			<>
				<SecondRow
					chosenLanguage={chosenLanguage}
					translations={translations}
				/>
			</>

			<>
				<ThirdRow chosenLanguage={chosenLanguage} />
			</>

			<>
				<FourthRow chosenLanguage={chosenLanguage} />
			</>

			<>
				<FifthRow chosenLanguage={chosenLanguage} />
			</>
		</DashboardWrapper>
	);
};

export default Dashboard;

// Styled components with comments for adjustments

const DashboardWrapper = styled.div`
	padding: 24px;
	background-color: #f7f8fc;
	display: grid;
	grid-template-rows: auto auto auto;
	gap: 24px;
`;

// First row styling
const FirstRow = styled.div`
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	gap: 16px;
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

// Card title styling First Row
const CardTitle = styled.div`
	font-size: 18px;
	font-weight: bold;
	color: black;
	margin: auto 10px !important;
`;

// Card number styling
const CardNumber = styled.div`
	font-size: 25px;
	font-weight: bold;
	/* color: #1e88e5; */
	color: black;
	margin: auto 10px !important;
`;

// Styles for the badge
const Badge = styled.div`
	background-color: #1e88e5;
	color: white;
	border-radius: 50%;
	padding: 4px 8px;
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 14px;
	font-weight: bold;
`;
