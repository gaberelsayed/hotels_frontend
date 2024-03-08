import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isAuthenticated } from "../auth";
import { useCartContext } from "../cart_context";
import MonthFilter from "./MonthFilter";
import {
	getAggregatedReservations,
	getReservationToDate,
	hotelAccount,
} from "./apiOwner";
import BarChartComponent from "./BarChartComponent";
import BookingSourceTable from "./BookingSourceTable";
import HotelNameFilter from "./HotelNameFilter";
import DayToDayReport from "./DayToDayReport";

const OwnerDashboardMain = () => {
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currentMonth = new Date().getMonth();
	const [selectedMonth, setSelectedMonth] = useState(monthNames[currentMonth]);

	// eslint-disable-next-line
	const [reservationsSummary, setReservationsSummary] = useState("");
	const [aggregateByHotelName, setAggregateByHotelName] = useState("");
	const [aggregateByBookingSource, setAggregateByBookingSource] = useState("");
	const [distinctHotelNames, setDistinctHotelNames] = useState("");
	const [selectedHotelName, setSelectedHotelName] = useState("");
	const [selectedDate, setSelectedDate] = useState(
		new Date(new Date().setDate(new Date().getDate() - 1))
			.toISOString()
			.slice(0, 10)
	);
	const [reservationListToDate, setReservationListToDate] = useState("");

	const { languageToggle, chosenLanguage } = useCartContext();

	const { user, token } = isAuthenticated();

	const gettingHotelData = () => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				const formattedHotelIds = data.hotelIdsOwner.join("-");
				getAggregatedReservations(selectedMonth, formattedHotelIds).then(
					(data2) => {
						if (data2 && data2.error) {
							console.log("Error returning aggregation");
						} else {
							setReservationsSummary(data2);

							// Populate distinct hotel names from the original data
							const distinctNames = [
								...new Set(data2.map((item) => item.hotelName)),
							];

							// Filter data if selectedHotelName is provided and exists in the data
							const filteredData =
								selectedHotelName &&
								data2.some((data) => data.hotelName === selectedHotelName)
									? data2.filter((data) => data.hotelName === selectedHotelName)
									: data2;

							// Aggregate by hotel name
							const byHotelName = filteredData.reduce((acc, cur) => {
								if (!acc[cur.hotelName]) {
									acc[cur.hotelName] = {
										totalBookings: 0,
										total_amount: 0,
										commission: 0,
										totalBookingsHoused: 0,
										total_amountHoused: 0,
									};
								}
								acc[cur.hotelName].totalBookings += cur.totalBookings;
								acc[cur.hotelName].total_amount += cur.total_amount;
								acc[cur.hotelName].commission += cur.commission;
								acc[cur.hotelName].totalBookingsHoused +=
									cur.totalBookingsHoused;
								acc[cur.hotelName].total_amountHoused += cur.total_amountHoused;
								return acc;
							}, {});

							// Aggregate by booking source
							const byBookingSource = filteredData.reduce((acc, cur) => {
								if (!acc[cur.booking_source]) {
									acc[cur.booking_source] = {
										totalBookings: 0,
										total_amount: 0,
										commission: 0,
										totalBookingsHoused: 0,
										total_amountHoused: 0,
										totalNights: 0,
									};
								}
								acc[cur.booking_source].totalBookings += cur.totalBookings;
								acc[cur.booking_source].total_amount += cur.total_amount;
								acc[cur.booking_source].commission += cur.commission;
								acc[cur.booking_source].totalBookingsHoused +=
									cur.totalBookingsHoused;
								acc[cur.booking_source].total_amountHoused +=
									cur.total_amountHoused;
								acc[cur.booking_source].totalNights += cur.totalNights;
								return acc;
							}, {});

							// Update the states
							setAggregateByHotelName(byHotelName);
							setAggregateByBookingSource(byBookingSource);
							setDistinctHotelNames(distinctNames);

							getReservationToDate(formattedHotelIds, selectedDate).then(
								(data3) => {
									if (data3 && data3.error) {
										console.log(data3.error, "returning list to date");
									} else {
										// Filter data3 if selectedHotelName is provided and exists in the data
										const filteredData3 = selectedHotelName
											? data3.filter(
													(reservation) =>
														reservation.hotelId.hotelName === selectedHotelName
											  )
											: data3;

										setReservationListToDate(filteredData3);
									}
								}
							);
						}
					}
				);
			}
		});
	};

	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, [selectedMonth, selectedHotelName, selectedDate]);

	console.log(reservationListToDate, "reservationListToDate");

	return (
		<OwnerDashboardMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
		>
			<div
				style={{
					textAlign: chosenLanguage === "Arabic" ? "left" : "right",
					fontWeight: "bold",
					textDecoration: "underline",
					cursor: "pointer",
					padding: "10px",
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

			<div>
				<MonthFilter
					selectedMonth={selectedMonth}
					setSelectedMonth={setSelectedMonth}
					chosenLanguage={chosenLanguage}
					selectedHotelName={selectedHotelName}
					setSelectedHotelName={setSelectedHotelName}
				/>
			</div>
			{distinctHotelNames && distinctHotelNames.length > 0 ? (
				<div>
					<HotelNameFilter
						chosenLanguage={chosenLanguage}
						selectedHotelName={selectedHotelName}
						setSelectedHotelName={setSelectedHotelName}
						distinctHotelNames={distinctHotelNames}
					/>
				</div>
			) : null}

			<div>
				<div className='row mt-5 p-3' style={{ backgroundColor: "#e0e0e0" }}>
					<div className='col-lg-6 my-auto'>
						<BarChartComponent
							aggregateByHotelName={aggregateByHotelName}
							chosenLanguage={chosenLanguage}
							selectedHotelName={selectedHotelName}
							selectedMonth={selectedMonth}
						/>
					</div>

					<div className='col-lg-6'>
						<BookingSourceTable
							aggregateByBookingSource={aggregateByBookingSource}
							chosenLanguage={chosenLanguage}
							selectedHotelName={selectedHotelName}
						/>
					</div>
				</div>
			</div>
			{reservationListToDate && reservationListToDate.length > 0 ? (
				<div className='mt-5'>
					<DayToDayReport
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
						reservationListToDate={reservationListToDate}
						chosenLanguage={chosenLanguage}
					/>
				</div>
			) : null}
		</OwnerDashboardMainWrapper>
	);
};

export default OwnerDashboardMain;

const OwnerDashboardMainWrapper = styled.div`
	min-height: 750px;
	padding: 15px;

	@media (max-width: 1000px) {
		padding: 5px;

		.row {
			padding: 2px !important;
		}
	}
`;
