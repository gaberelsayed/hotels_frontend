import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import { isAuthenticated } from "../../auth";
import { getHotelDetails, gettingDateReport, hotelAccount } from "../apiAdmin";
import { Table } from "antd";

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
										setReservationsToday(data3);
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
									setReservationsYesterday(data4);
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

	const aggregateData = (reservations) => {
		const aggregation =
			reservations &&
			reservations.reduce((acc, reservation) => {
				const source = reservation.booking_source || "Unknown";
				if (!acc[source]) {
					acc[source] = { count: 0, total_amount: 0 };
				}
				acc[source].count += 1;
				acc[source].total_amount += reservation.total_amount;
				return acc;
			}, {});

		return Object.entries(aggregation).map(([source, data]) => ({
			source,
			...data,
		}));
	};

	const getMaxAmount = (data) => {
		return Math.max(...data.map((item) => item.total_amount));
	};

	const sourceToColorMap = (source) => {
		const baseColors = {
			"BOOKING.COM": "#edb67f", // A shade of orange-brown
			EXPEDIA: "#edaf6f", // A shade of dark peach
			AGODA: "#eda46f", // A shade of muted orange
			MANUAL: "#ed917f", // A shade of salmon
			// ...add more sources and shades as needed
		};
		return baseColors[source.toUpperCase()] || "#edb67f"; // Default color if not matched
	};

	const columns = [
		{
			title: chosenLanguage === "Arabic" ? "مصدر الحجز" : "Booking Source",
			dataIndex: "source",
			key: "source",
			render: (text) => (
				<span style={{ color: sourceToColorMap(text), fontWeight: "bold" }}>
					{text.toUpperCase()}
				</span>
			),
		},
		{
			title:
				chosenLanguage === "Arabic" ? "عدد الحجوزات" : "Reservations Count",
			dataIndex: "count",
			key: "count",
		},
		{
			title: chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
			render: (amount, record, index) => {
				const maxAmount = getMaxAmount(aggregatedData); // Make sure you have this function implemented to get the max amount
				const barWidth = (amount / maxAmount) * 100;
				const barColor = sourceToColorMap(record.source);
				return (
					<div
						style={{ position: "relative", width: "100%", textAlign: "left" }}
					>
						<div
							style={{
								display: "inline-block",
								width: `${barWidth}%`,
								backgroundColor: barColor,
								height: "10px",
							}}
						/>
						<span style={{ marginRight: "10px", fontWeight: "bold" }}>
							{`${amount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})} SAR`}
						</span>
					</div>
				);
			},
		},
	];

	const aggregatedData = aggregateData(reservationsToday);

	const AggregatedTable = ({ data, title }) => {
		const dataSource = data.map((item, index) => ({
			key: index,
			...item,
		}));

		return (
			<div>
				<h3>{title}</h3>
				<Table columns={columns} dataSource={dataSource} pagination={false} />
			</div>
		);
	};

	// After fetching the data...
	const today = new Date();

	const aggregatedToday = aggregateData(
		reservationsToday &&
			reservationsToday.filter(
				(reservation) =>
					new Date(reservation.checkin_date).toDateString() ===
					today.toDateString()
			)
	);

	const aggregatedBookedToday = aggregateData(
		reservationsToday &&
			reservationsToday.filter(
				(reservation) =>
					new Date(reservation.booked_at).toDateString() ===
					today.toDateString()
			)
	);

	const summaryObject = {
		checkedInToday: {
			total_amount:
				aggregatedToday &&
				aggregatedToday.reduce((sum, item) => sum + item.total_amount, 0),
			total_reservations_count:
				aggregatedToday &&
				aggregatedToday.reduce((sum, item) => sum + item.count, 0),
		},
		booked_at_today: {
			total_amount:
				aggregatedBookedToday &&
				aggregatedBookedToday.reduce((sum, item) => sum + item.total_amount, 0),
			total_reservations_count:
				aggregatedBookedToday &&
				aggregatedBookedToday.reduce((sum, item) => sum + item.count, 0),
		},
	};

	console.log(summaryObject, "summaryObject");

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
								<div className='container'>
									<AggregatedTable
										data={aggregatedToday}
										title={
											chosenLanguage === "Arabic"
												? "ملخص تسجيلات الدخول اليوم"
												: "Today's Check-ins Summary"
										}
									/>
									<div className='my-4'>
										<AggregatedTable
											data={aggregatedBookedToday}
											title={
												chosenLanguage === "Arabic"
													? "العملاء الذين حجزوا اليوم"
													: "Today's Bookings Summary"
											}
										/>
									</div>
								</div>
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
