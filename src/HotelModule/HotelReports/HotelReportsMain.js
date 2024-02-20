import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import {
	checkedoutReservationsList,
	checkedoutReservationsTotalRecords,
	getHotelDetails,
	hotelAccount,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import TableViewReport from "./TableViewReport";
import { DatePicker, Space } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const HotelReportsMain = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [recordsPerPage] = useState(400);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalRecords, setTotalRecords] = useState(0);
	const [allReservations, setAllReservations] = useState([]);
	const [hotelDetails, setHotelDetails] = useState(0);
	const [dateRange, setDateRange] = useState([
		moment().subtract(50, "days"),
		moment().add(60, "days"),
	]);

	const { user, token } = isAuthenticated();
	const { languageToggle, chosenLanguage } = useCartContext();
	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}
		// eslint-disable-next-line
	}, []);

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

	const gettingHotelData = () => {
		const [startDate, endDate] = dateRange;
		const formattedStartDate = formatDate(startDate);
		const formattedEndDate = formatDate(endDate);

		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						setHotelDetails(data2[0]);

						// Use the formatted start and end dates for API calls
						checkedoutReservationsList(
							currentPage,
							recordsPerPage,
							formattedStartDate,
							formattedEndDate,
							data2[0]._id
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
							data2[0]._id
						).then((data4) => {
							if (data4 && data4.error) {
								console.log(data4.error, "data4.error");
							} else {
								setTotalRecords(data4.total);
							}
						});
					}
				});
			}
		});
	};

	console.log(totalRecords, "totalRecords");

	// Call gettingHotelData whenever the date range or other relevant states change
	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, [currentPage, recordsPerPage, dateRange]);

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

					<div className='container-wrapper'>
						{allReservations &&
						allReservations.length > 0 &&
						hotelDetails &&
						hotelDetails._id ? (
							<div
								className='my-3'
								style={{
									textAlign: chosenLanguage === "Arabic" ? "right" : "",
								}}
							>
								<Space
									direction='vertical'
									size={12}
									className='w-25'
									style={{ margin: "10px" }}
								>
									<RangePicker className='w-100' onChange={handleDateChange} />
								</Space>
								<TableViewReport
									allReservations={allReservations}
									totalRecords={totalRecords}
									hotelDetails={hotelDetails}
									chosenLanguage={chosenLanguage}
									setCurrentPage={setCurrentPage}
									currentPage={currentPage}
									recordsPerPage={recordsPerPage}
								/>
							</div>
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
`;
