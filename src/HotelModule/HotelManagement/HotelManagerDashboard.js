import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import { isAuthenticated } from "../../auth";
import { getHotelDetails, gettingDateReport, hotelAccount } from "../apiAdmin";
import MyReport from "./MyReport";
import GeneralOverview from "./GeneralOverview";

const HotelManagerDashboard = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [hotelDetails, setHotelDetails] = useState("");
	const [reservationsToday, setReservationsToday] = useState("");
	// eslint-disable-next-line
	const [reservationsYesterday, setReservationsYesterday] = useState("");
	const [activeTab, setActiveTab] = useState("Today");
	const { languageToggle, chosenLanguage } = useCartContext();

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}

		if (window.location.search.includes("today")) {
			setActiveTab("Today");
		} else if (window.location.search.includes("yesterday")) {
			setActiveTab("Yesterday");
		} else if (window.location.search.includes("overview")) {
			setActiveTab("Overview");
		} else {
			setActiveTab("Today");
		}
		// eslint-disable-next-line
	}, [activeTab]);

	// Helper function to format a date object into yyyy-mm-dd
	function formatDate(date) {
		const d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
	}

	const gettingHotelData = () => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						if (data && data.name && data._id && data2 && data2.length > 0) {
							setHotelDetails(data2[0]);

							// Format today's date
							const today = new Date();
							const formattedToday = formatDate(today);

							// Get yesterday's date
							const yesterday = new Date(today);
							yesterday.setDate(yesterday.getDate() - 1);
							const formattedYesterday = formatDate(yesterday);

							// Get today's report
							gettingDateReport(formattedToday, data2[0]._id, data._id).then(
								(data3) => {
									if (data3 && data3.error) {
										console.log(data3.error);
									} else {
										setReservationsToday(
											data3.filter(
												(i) => !i.reservation_status.includes("cancelled")
											)
										);
									}
								}
							);

							// Get yesterday's report
							gettingDateReport(
								formattedYesterday,
								data2[0]._id,
								data._id
							).then((data4) => {
								if (data4 && data4.error) {
									console.log(data4.error);
								} else {
									setReservationsYesterday(
										data4.filter(
											(i) => !i.reservation_status.includes("cancelled")
										)
									);
								}
							});
						}
					}
				});
			}
		});
	};

	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, []);

	console.log(reservationsYesterday, "reservationsYesterday");

	return (
		<HotelManagerDashboardWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
			isArabic={chosenLanguage === "Arabic"}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='AdminDasboard'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='AdminDasboard'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					)}
				</div>

				<div className='otherContentWrapper'>
					<div
						style={{
							textAlign: chosenLanguage === "Arabic" ? "left" : "right",
							fontWeight: "bold",
							textDecoration: "underline",
							cursor: "pointer",
						}}
						onClick={() => {
							if (chosenLanguage === "English") {
								languageToggle("Arabic");
							} else {
								languageToggle("English");
							}
						}}
					>
						{chosenLanguage === "English" ? "ARABIC" : "English"}
					</div>

					<div style={{ background: "#8a8a8a", padding: "1px" }}>
						<div className='my-2 tab-grid col-md-8'>
							<Tab
								isActive={activeTab === "Today"}
								onClick={() => {
									setActiveTab("Today");
								}}
							>
								<Link to='/hotel-management/dashboard?today'>
									{chosenLanguage === "Arabic"
										? "تقرير حجوزات اليوم"
										: "Today's Overview"}
								</Link>
							</Tab>
							<Tab
								isActive={activeTab === "Yesterday"}
								onClick={() => {
									setActiveTab("Yesterday");
								}}
							>
								<Link to='/hotel-management/dashboard?yesterday'>
									{chosenLanguage === "Arabic"
										? "تقرير حجوزات الأمس"
										: "Yestery Overview"}
								</Link>
							</Tab>
							<Tab
								isActive={activeTab === "Overview"}
								onClick={() => {
									setActiveTab("Overview");
								}}
							>
								<Link to='/hotel-management/dashboard?overview'>
									{chosenLanguage === "Arabic"
										? "لمحة عامة"
										: "Reservations Overview"}
								</Link>
							</Tab>
						</div>
					</div>

					<div className='container-wrapper'>
						<div>
							<h4
								style={{
									fontWeight: "bold",
									textTransform: "capitalize",
									textAlign: "center",
								}}
							>
								Hotel ({hotelDetails && hotelDetails.hotelName})
							</h4>
						</div>

						{activeTab === "Today" &&
						reservationsToday &&
						reservationsToday.length > 0 ? (
							<>
								<MyReport
									reservations={reservationsToday}
									fromTab='Today'
									chosenLanguage={chosenLanguage}
								/>
							</>
						) : null}

						{activeTab === "Yesterday" &&
						reservationsYesterday &&
						reservationsYesterday.length > 0 ? (
							<>
								<MyReport
									reservations={reservationsYesterday}
									chosenLanguage={chosenLanguage}
									fromTab='Yesterday'
								/>
							</>
						) : null}

						{activeTab === "Overview" && hotelDetails && hotelDetails._id ? (
							<>
								<GeneralOverview
									hotelDetails={hotelDetails}
									chosenLanguage={chosenLanguage}
								/>
							</>
						) : null}
					</div>
				</div>
			</div>
		</HotelManagerDashboardWrapper>
	);
};

export default HotelManagerDashboard;

const HotelManagerDashboardWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;
	text-align: ${(props) => (props.isArabic ? "right" : "")};

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 90%" : "15% 84%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	.tab-grid {
		display: flex;
		/* Additional styling for grid layout */
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;

const Tab = styled.div`
	cursor: pointer;
	margin: 0 3px; /* 3px margin between tabs */
	padding: 15px 5px; /* Adjust padding as needed */
	font-weight: ${(props) => (props.isActive ? "bold" : "bold")};
	background-color: ${(props) =>
		props.isActive
			? "transparent"
			: "#bbbbbb"}; /* Light grey for unselected tabs */
	box-shadow: ${(props) =>
		props.isActive ? "inset 5px 5px 5px rgba(0, 0, 0, 0.3)" : "none"};
	transition: all 0.3s ease; /* Smooth transition for changes */
	min-width: 25px; /* Minimum width of the tab */
	width: 100%; /* Full width within the container */
	text-align: center; /* Center the text inside the tab */
	/* Additional styling for tabs */
	z-index: 100;
	font-size: 1.2rem;

	a {
		color: ${(props) => (props.isActive ? "white" : "black")};
	}
`;
