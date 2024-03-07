import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isAuthenticated } from "../auth";
import { useCartContext } from "../cart_context";
import MonthFilter from "./MonthFilter";
import { getAggregatedReservations, hotelAccount } from "./apiOwner";
import BarChartComponent from "./BarChartComponent";
import BookingSourceTable from "./BookingSourceTable";

const OwnerDashboardMain = () => {
	const [selectedMonth, setSelectedMonth] = useState("January");
	const [reservationsSummary, setReservationsSummary] = useState("");
	const [aggregateByHotelName, setAggregateByHotelName] = useState("");
	const [aggregateByBookingSource, setAggregateByBookingSource] = useState("");
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

							// Aggregate by hotel name
							const byHotelName = data2.reduce((acc, cur) => {
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
							const byBookingSource = data2.reduce((acc, cur) => {
								if (!acc[cur.booking_source]) {
									acc[cur.booking_source] = {
										totalBookings: 0,
										total_amount: 0,
										commission: 0,
										totalBookingsHoused: 0,
										total_amountHoused: 0,
										totalNights: 0, // Initialize totalNights
									};
								}
								acc[cur.booking_source].totalBookings += cur.totalBookings;
								acc[cur.booking_source].total_amount += cur.total_amount;
								acc[cur.booking_source].commission += cur.commission;
								acc[cur.booking_source].totalBookingsHoused +=
									cur.totalBookingsHoused;
								acc[cur.booking_source].total_amountHoused +=
									cur.total_amountHoused;
								acc[cur.booking_source].totalNights += cur.totalNights; // Accumulate totalNights
								return acc;
							}, {});

							// Update the states
							setAggregateByHotelName(byHotelName);
							setAggregateByBookingSource(byBookingSource);
						}
					}
				);
			}
		});
	};

	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, [selectedMonth]);

	console.log(reservationsSummary, "reservationsSummary");
	console.log(aggregateByHotelName, "aggregateByHotelName");
	console.log(aggregateByBookingSource, "aggregateByBookingSource");

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
				/>
			</div>
			<div>
				<div className='row mt-5'>
					<div className='col-lg-6'>
						<BarChartComponent
							aggregateByHotelName={aggregateByHotelName}
							chosenLanguage={chosenLanguage}
						/>
					</div>

					<div className='col-lg-6'>
						<BookingSourceTable
							aggregateByBookingSource={aggregateByBookingSource}
							chosenLanguage={chosenLanguage}
						/>
					</div>
				</div>
			</div>
		</OwnerDashboardMainWrapper>
	);
};

export default OwnerDashboardMain;

const OwnerDashboardMainWrapper = styled.div`
	min-height: 750px;
	padding: 15px;
`;
