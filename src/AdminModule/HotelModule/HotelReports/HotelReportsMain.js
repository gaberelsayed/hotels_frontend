import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useCartContext } from "../../../cart_context";
import {
	checkedoutReservationsList,
	checkedoutReservationsTotalRecords,
} from "../apiAdmin";
// import { isAuthenticated } from "../../../auth";
import TableViewReport from "./TableViewReport";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { useHistory } from "react-router-dom";
import GeneralReportMain from "./GeneralReport/GeneralReportMain";
import AssignReservations from "./AssignReservations";

const { RangePicker } = DatePicker;

const HotelReportsMain = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [recordsPerPage] = useState(300);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [allReservations, setAllReservations] = useState([]);
	const [scoreCardObject, setScoreCardObject] = useState("");
	const [allChannels, setAllChannels] = useState([
		"agoda",
		"expedia",
		"booking.com",
		"janat",
		"airbnb",
		"affiliate",
		"manual",
	]);
	const [selectedChannel, setSelectedChannel] = useState(undefined);
	const [hotelDetails, setHotelDetails] = useState(0);
	const [dateRange, setDateRange] = useState([
		moment().subtract(45, "days"),
		moment().add(10, "days"),
	]);
	const history = useHistory(); // Initialize the history object

	const [activeTab, setActiveTab] = useState("general");

	// const { user, token } = isAuthenticated();
	const { languageToggle, chosenLanguage } = useCartContext();
	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}

		if (window.location.search.includes("finance")) {
			setActiveTab("finance");
		} else if (window.location.search.includes("general")) {
			setActiveTab("general");
		} else if (window.location.search.includes("assign-financials")) {
			setActiveTab("assign-financials");
		} else {
			setActiveTab("general");
		}
		// eslint-disable-next-line
	}, [activeTab]);

	const formatDate = (date) => {
		if (!date) return "";

		const d = new Date(date);
		let month = "" + (d.getMonth() + 1);
		let day = "" + d.getDate();
		let year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	};

	const gettingHotelData = (hotelDetailsPassed) => {
		if (hotelDetailsPassed && hotelDetailsPassed._id) {
			const [startDate, endDate] = dateRange;
			const formattedStartDate = formatDate(startDate);
			const formattedEndDate = formatDate(endDate);

			checkedoutReservationsList(
				currentPage,
				recordsPerPage,
				formattedStartDate,
				formattedEndDate,
				hotelDetailsPassed._id,
				selectedChannel
			).then((data3) => {
				if (data3 && data3.error) {
					console.log(data3.error);
				} else {
					console.log(data3, "data3");

					setAllReservations(data3 && data3.length > 0 ? data3 : []);
				}
			});

			checkedoutReservationsTotalRecords(
				formattedStartDate,
				formattedEndDate,
				hotelDetailsPassed._id,
				selectedChannel
			).then((data4) => {
				if (data4 && data4.error) {
					console.log(data4.error, "data4.error");
				} else {
					setTotalRecords(data4.total);
					setScoreCardObject(data4);
				}
			});
		}
	};

	// Call gettingHotelData whenever the date range or other relevant states change
	useEffect(() => {
		// Retrieve the hotel details from local storage when the component mounts
		const storedHotelDetails = localStorage.getItem("hotel");
		if (storedHotelDetails) {
			setHotelDetails(JSON.parse(storedHotelDetails));
			gettingHotelData(JSON.parse(storedHotelDetails));
		}
		// eslint-disable-next-line
	}, [currentPage, recordsPerPage, dateRange, selectedChannel]);

	const handleDateChange = (dates, dateStrings) => {
		if (!dates) {
			// Handle the case where dates are cleared
			return;
		}
		setDateRange(dates);
	};

	return (
		<HotelReportsMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='HotelReports'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='HotelReports'
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
								isActive={activeTab === "general"}
								onClick={() => {
									setActiveTab("general");
									history.push("/admin-management/admin-reports?general"); // Programmatically navigate
								}}
							>
								{chosenLanguage === "Arabic"
									? "التقرير العام"
									: "General Report"}
							</Tab>
							<Tab
								isActive={activeTab === "finance"}
								onClick={() => {
									setActiveTab("finance");
									history.push("/admin-management/admin-reports?finance");
								}}
							>
								{chosenLanguage === "Arabic"
									? "Checkout Report"
									: "Checkout Report"}
							</Tab>

							<Tab
								isActive={activeTab === "assign-financials"}
								onClick={() => {
									setActiveTab("assign-financials");
									history.push(
										"/admin-management/admin-reports?assign-financials"
									);
								}}
							>
								{chosenLanguage === "Arabic" ? "Financials" : "Financials"}
							</Tab>
						</div>
					</div>

					<div className='container-wrapper'>
						{activeTab === "finance" ? (
							<>
								{allReservations && hotelDetails && hotelDetails._id ? (
									<div
										className='my-3 text-center mx-auto'
										style={{
											textAlign: chosenLanguage === "Arabic" ? "right" : "",
										}}
									>
										<h5 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
											Checkout Date Range
										</h5>
										<Space
											direction='vertical'
											size={12}
											className='w-25'
											style={{ margin: "10px" }}
										>
											<RangePicker
												className='w-100'
												onChange={handleDateChange}
											/>
										</Space>
										<TableViewReport
											allReservations={allReservations}
											totalRecords={totalRecords}
											hotelDetails={hotelDetails}
											chosenLanguage={chosenLanguage}
											setCurrentPage={setCurrentPage}
											currentPage={currentPage}
											recordsPerPage={recordsPerPage}
											selectedChannel={selectedChannel}
											setSelectedChannel={setSelectedChannel}
											allChannels={allChannels}
											setAllChannels={setAllChannels}
											scoreCardObject={scoreCardObject}
										/>
									</div>
								) : null}
							</>
						) : null}

						{activeTab === "general" ? (
							<>
								<GeneralReportMain
									hotelDetails={hotelDetails}
									chosenLanguage={chosenLanguage}
								/>
							</>
						) : null}

						{activeTab === "assign-financials" ? (
							<>
								<AssignReservations
									hotelDetails={hotelDetails}
									chosenLanguage={chosenLanguage}
								/>
							</>
						) : null}
					</div>
				</div>
			</div>
		</HotelReportsMainWrapper>
	);
};

export default HotelReportsMain;

const HotelReportsMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 92%" : "15% 83%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	@media (max-width: 1400px) {
		background: white;
	}

	.tab-grid {
		display: flex;
		/* Additional styling for grid layout */
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
	color: ${(props) => (props.isActive ? "white" : "black")};
`;
