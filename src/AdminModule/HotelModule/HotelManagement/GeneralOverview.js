import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { isAuthenticated } from "../../../auth";
import {
	gettingBookingSource,
	gettingDayOverDay,
	gettingMonthOverMonth,
	gettingReservationStatus,
} from "../apiAdmin";
import ReactApexChart from "react-apexcharts";

export const GeneralOverview = ({ hotelDetails }) => {
	const [dayOverDay, setDayOverDay] = useState([]);
	const [optionsTotalAmount, setOptionsTotalAmount] = useState({});
	const [seriesTotalAmount, setSeriesTotalAmount] = useState([]);
	const [optionsReservationCount, setOptionsReservationCount] = useState({});
	const [seriesReservationCount, setSeriesReservationCount] = useState([]);
	const [monthOverMonth, setMonthOverMonth] = useState([]);
	const [bookingSource, setBookingSource] = useState([]);
	const [reservationStatus, setReservationStatus] = useState([]);
	const [optionsMonthTotalAmount, setOptionsMonthTotalAmount] = useState({});
	const [seriesMonthTotalAmount, setSeriesMonthTotalAmount] = useState([]);

	const [optionsBookingSource, setOptionsBookingSource] = useState({});
	const [seriesBookingSourceTotalAmount, setSeriesBookingSourceTotalAmount] =
		useState([]);

	const [optionsStatusTotalAmount, setOptionsStatusTotalAmount] = useState({});
	const [seriesStatusTotalAmount, setSeriesStatusTotalAmount] = useState([]);

	const gettingAllReports = () => {
		gettingDayOverDay(hotelDetails._id, hotelDetails.belongsTo._id).then(
			(data) => {
				if (data && data.error) {
					console.log(data.error);
				} else {
					setDayOverDay(data);

					//Line Charts
					const dates = data && data.map((item) => item._id);
					const totalAmounts = data && data.map((item) => item.totalAmount);
					const totalAmountsCancelled =
						data && data.map((item) => item.cancelledAmount);
					const reservationCounts =
						data && data.map((item) => item.totalReservations);
					const reservationCountsCancelled =
						data && data.map((item) => item.cancelledReservations);

					setOptionsTotalAmount({
						chart: { id: "total-amounts" },
						xaxis: { categories: dates },
						yaxis: {
							title: { text: "Amounts" },
							labels: {
								formatter: (val) => val.toFixed(0), // No decimal places
							},
						},
						dataLabels: {
							enabled: true,
							formatter: (val) => `${val.toLocaleString()}`, // Format with commas and append "SAR"
							style: {
								fontSize: "12px", // Adjust font size
							},
						},
						colors: ["#6facea", "#ea706f", "#eaae6f"],
					});

					// In the gettingDayOverDay.then() callback:
					const actualAmounts = totalAmounts.map(
						(total, index) => total - totalAmountsCancelled[index]
					);
					const actualCounts = reservationCounts.map(
						(count, index) => count - reservationCountsCancelled[index]
					);

					setSeriesTotalAmount([
						{ name: "Total Amount", data: totalAmounts },
						{ name: "Cancelled Amount", data: totalAmountsCancelled },
						{ name: "Actual Amount", data: actualAmounts }, // Added Actual Amount series
					]);

					setOptionsReservationCount({
						chart: { id: "reservation-counts" },
						xaxis: { categories: dates },
						yaxis: {
							title: { text: "Reservations" },
							labels: {
								formatter: (val) => val.toFixed(0), // No decimal places
							},
						},
						dataLabels: {
							enabled: true,
							formatter: (val) => val.toLocaleString(), // Format with commas
							style: {
								fontSize: "12px", // Adjust font size
							},
						},
						colors: ["#6facea", "#ea706f", "#eaae6f"],
					});

					setSeriesReservationCount([
						{ name: "Reservation Count", data: reservationCounts },
						{
							name: "Cancelled Reservations",
							data: reservationCountsCancelled,
						},
						{ name: "Actual Count", data: actualCounts }, // Added Actual Count series
					]);
				}
			}
		);

		gettingMonthOverMonth(hotelDetails._id, hotelDetails.belongsTo._id).then(
			(data) => {
				if (data && data.error) {
					console.log(data.error);
				} else {
					setMonthOverMonth(data);

					//Bar Chart MonthOverMOnth
					const monthLabels = data.map((item) => item._id);
					const totalAmounts = data.map((item) => item.totalAmount);
					const cancelledAmounts = data.map((item) => item.cancelledAmount);

					// In the gettingMonthOverMonth.then() callback:
					const actualMonthAmounts = totalAmounts.map(
						(total, index) => total - cancelledAmounts[index]
					);
					setOptionsMonthTotalAmount({
						chart: { id: "month-total-amount" },
						xaxis: { categories: monthLabels },
						yaxis: {
							title: { text: "Amounts" },
							labels: {
								formatter: (val) => val.toFixed(0), // No decimal places
							},
						},
						dataLabels: {
							enabled: true,
							offsetY: -20, // Move data labels above the bars
							formatter: (val) => `${val.toLocaleString()}`,
							style: {
								fontSize: "11px",
								colors: ["black"], // Set the color of data labels to black
							},
						},
						plotOptions: {
							bar: {
								horizontal: false,
								columnWidth: "55%",
								endingShape: "rounded",
								dataLabels: {
									position: "top", // Position data labels at the top of the bars
								},
							},
						},
						colors: ["#6feaad", "#ea706f", "#eaae6f"],
					});

					setSeriesMonthTotalAmount([
						{ name: "Total Amount", data: totalAmounts },
						{ name: "Cancelled Amount", data: cancelledAmounts },
						{ name: "Actual Amount", data: actualMonthAmounts }, // Added Actual Amount series
					]);
				}
			}
		);

		gettingBookingSource(hotelDetails._id, hotelDetails.belongsTo._id).then(
			(data) => {
				if (data && data.error) {
					console.log(data.error);
				} else {
					setBookingSource(data);

					//Bar Chart BookingSource
					const bookingSourceLabel = data.map((item) => item._id);
					const totalAmounts = data.map((item) => item.totalAmount);
					const cancelledAmounts = data.map((item) => item.cancelledAmount);
					const actualAmounts = totalAmounts.map(
						(total, index) => total - cancelledAmounts[index]
					); // Calculate Actual Amounts

					setOptionsBookingSource({
						chart: { id: "booking-source-amount" },
						xaxis: {
							categories: bookingSourceLabel.map((label) =>
								label.toUpperCase()
							), // Convert labels to uppercase
							labels: {
								style: {
									fontWeight: 600, // Make labels bold
									cssClass: "apexcharts-xaxis-label",
								},
							},
						},
						yaxis: {
							title: { text: "Amounts" },
							labels: {
								formatter: (val) => val.toFixed(0), // No decimal places
							},
						},
						dataLabels: {
							enabled: true,
							offsetY: -20, // Move data labels above the bars
							formatter: (val) => `${val.toLocaleString()}`,
							style: {
								fontSize: "11px",
								colors: ["black"], // Set the color of data labels to black
							},
						},
						plotOptions: {
							bar: {
								horizontal: false,
								columnWidth: "55%",
								endingShape: "rounded",
								dataLabels: {
									position: "top", // Position data labels at the top of the bars
								},
							},
						},
						colors: ["#6feaad", "#ea706f", "#eaae6f"],
					});

					setSeriesBookingSourceTotalAmount([
						{ name: "Total Amount", data: totalAmounts },
						{ name: "Cancelled Amount", data: cancelledAmounts },
						{ name: "Actual Amount", data: actualAmounts }, // Added Actual Amount series
					]);
				}
			}
		);

		gettingReservationStatus(hotelDetails._id, hotelDetails.belongsTo._id).then(
			(data) => {
				if (data && data.error) {
					console.log(data.error);
				} else {
					setReservationStatus(data);

					//Bar Chart Status
					const statusLabel = data.map((item) => item._id);
					const totalAmounts = data.map((item) => item.totalAmount);

					setOptionsStatusTotalAmount({
						chart: { id: "month-total-amount" },
						xaxis: {
							categories: statusLabel.map((label) => label.toUpperCase()), // Convert labels to uppercase
							labels: {
								style: {
									fontWeight: 600, // Make labels bold
									cssClass: "apexcharts-xaxis-label",
								},
							},
						},
						yaxis: {
							title: { text: "Amounts" },
							labels: {
								formatter: (val) => val.toFixed(0), // No decimal places
							},
						},
						dataLabels: {
							enabled: true,
							offsetY: -20, // Move data labels above the bars
							formatter: (val) => `${val.toLocaleString()}`,
							style: {
								fontSize: "11px",
								colors: ["black"], // Set the color of data labels to black
							},
						},
						plotOptions: {
							bar: {
								horizontal: false,
								columnWidth: "55%",
								endingShape: "rounded",
								dataLabels: {
									position: "top", // Position data labels at the top of the bars
								},
							},
						},
						colors: ["#eaea6f", "#ea706f", "#eaae6f"],
					});

					setSeriesStatusTotalAmount([
						{ name: "Total Amount", data: totalAmounts },
					]);
				}
			}
		);
	};

	useEffect(() => {
		gettingAllReports();

		// eslint-disable-next-line
	}, []);

	return (
		<GeneralOverviewWrapper dir='ltr'>
			{dayOverDay && dayOverDay.length > 0 ? (
				<>
					<h4
						style={{
							fontSize: "1.2rem",
							fontWeight: "bold",
							textAlign: "center",
							marginTop: "20px",
						}}
					>
						Day Over Day (Check Out Date) By Total Amount (SAR)
					</h4>
					<ReactApexChart
						options={optionsTotalAmount}
						series={seriesTotalAmount}
						type='line'
						height={350}
					/>
					<h4
						style={{
							fontSize: "1.2rem",
							fontWeight: "bold",
							textAlign: "center",
							marginTop: "20px",
						}}
					>
						Day Over Day (Check Out Date) By Reservation Count
					</h4>

					<ReactApexChart
						options={optionsReservationCount}
						series={seriesReservationCount}
						type='line'
						height={350}
					/>
					{bookingSource &&
					bookingSource.length > 0 &&
					monthOverMonth &&
					monthOverMonth.length > 0 &&
					reservationStatus ? (
						<div>
							<div className='row mt-5'>
								<div className='col-md-12 mx-auto'>
									<h4
										style={{
											fontSize: "1rem",
											fontWeight: "bold",
											textAlign: "center",
											marginTop: "20px",
										}}
									>
										Booking Status Overall Overview
									</h4>
									<ReactApexChart
										options={optionsStatusTotalAmount}
										series={seriesStatusTotalAmount}
										type='bar'
										height={350}
									/>
								</div>
								<div className='col-md-12'>
									<h4
										style={{
											fontSize: "1rem",
											fontWeight: "bold",
											textAlign: "center",
											marginTop: "20px",
										}}
									>
										Booking Channels Overall Overview
									</h4>
									<ReactApexChart
										options={optionsBookingSource}
										series={seriesBookingSourceTotalAmount}
										type='bar'
										height={350}
									/>
								</div>

								<div className='col-md-12 mx-auto my-3'>
									<h4
										style={{
											fontSize: "1rem",
											fontWeight: "bold",
											textAlign: "center",
											marginTop: "20px",
										}}
									>
										MTD (Check Out Month) Overall Overview
									</h4>
									<ReactApexChart
										options={optionsMonthTotalAmount}
										series={seriesMonthTotalAmount}
										type='bar'
										height={350}
									/>
								</div>
							</div>
						</div>
					) : null}
				</>
			) : null}
		</GeneralOverviewWrapper>
	);
};

export default GeneralOverview;

const GeneralOverviewWrapper = styled.div``;
