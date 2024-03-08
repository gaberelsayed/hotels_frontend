import React from "react";
import styled from "styled-components";
import { DatePicker } from "antd";
// import moment from "moment";
import { Table } from "antd";
import ScoreCards from "./ScoreCards";

const DayToDayReport = ({
	selectedDate,
	setSelectedDate,
	reservationListToDate,
	chosenLanguage,
}) => {
	const handleDateChange = (date, dateString) => {
		setSelectedDate(dateString);
	};

	const totalReservations = reservationListToDate.length;
	const inhouseReservations = reservationListToDate.filter(
		(reservation) =>
			reservation.reservation_status === "inhouse" ||
			reservation.reservation_status.includes("checked_out") ||
			reservation.reservation_status === "cancelled" ||
			reservation.reservation_status === "no_show"
	).length;
	const otherReservations = totalReservations - inhouseReservations;
	const totalAmount = reservationListToDate.reduce(
		(sum, reservation) => sum + reservation.total_amount,
		0
	);
	const inhouseTotalAmount = reservationListToDate
		.filter(
			(reservation) =>
				reservation.reservation_status === "inhouse" ||
				reservation.reservation_status.includes("checked_out") ||
				reservation.reservation_status === "cancelled" ||
				reservation.reservation_status === "no_show"
		)
		.reduce((sum, reservation) => sum + reservation.total_amount, 0);
	const otherTotalAmount = totalAmount - inhouseTotalAmount;

	// Define the scorecard data for reservation counts and total amounts
	const reservationScoreCardData = {
		total: totalReservations,
		inhouse: inhouseReservations,
		other: otherReservations,
	};

	const amountScoreCardData = {
		total: totalAmount,
		inhouse: inhouseTotalAmount,
		other: otherTotalAmount,
	};

	const columns = [
		{
			title: chosenLanguage === "Arabic" ? "الرقم" : "Index",
			dataIndex: "index",
			key: "index",
			width: 80,
		},
		{
			title: chosenLanguage === "Arabic" ? "الاسم" : "Name",
			dataIndex: "name",
			key: "name",
			width: 350,
		},
		{
			title: chosenLanguage === "Arabic" ? "رقم التأكيد" : "Confirmation #",
			dataIndex: "confirmation_number",
			key: "confirmation_number",
			width: 180,
		},
		{
			title: chosenLanguage === "Arabic" ? "حالة الحجز" : "Reservation Status",
			dataIndex: "reservation_status",
			key: "reservation_status",
			width: 200,
		},
		{
			title: chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
			width: 170,

			render: (text) =>
				Number(text)
					.toFixed(2)
					.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
		},
		{
			title: chosenLanguage === "Arabic" ? "مصدر الحجز" : "Booking Source",
			dataIndex: "booking_source",
			key: "booking_source",
		},
	];

	const dataSource = reservationListToDate.map((reservation, index) => ({
		key: index,
		index: index + 1,
		name: reservation.customer_details.name,
		confirmation_number: reservation.confirmation_number,
		reservation_status: reservation.reservation_status,
		total_amount: reservation.total_amount,
		booking_source: reservation.booking_source,
	}));

	return (
		<DayToDayReportWrapper>
			<div className='datepicker-container'>
				<DatePicker
					className='w-25'
					// value={moment(selectedDate)}
					onChange={handleDateChange}
					format='YYYY-MM-DD'
				/>
			</div>
			<div
				className='text-center'
				style={{ fontWeight: "bold", fontSize: "1.1rem" }}
			>
				Selected Date: {new Date(selectedDate).toLocaleDateString()}
			</div>
			<ScoreCards
				scoreCardObject={reservationScoreCardData}
				titles={{
					total:
						chosenLanguage === "Arabic"
							? "إجمالي الحجوزات"
							: "Total Reservations",
					inhouse:
						chosenLanguage === "Arabic"
							? "الحجوزات المكتملة"
							: "Complete Reservations",
					others:
						chosenLanguage === "Arabic"
							? "الحجوزات غير المكتملة"
							: "Uncomplete Reservations",
				}}
			/>

			<ScoreCards
				scoreCardObject={amountScoreCardData}
				titles={{
					total:
						chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount",
					inhouse:
						chosenLanguage === "Arabic" ? "المبلغ المكتمل" : "Complete Amount",
					others:
						chosenLanguage === "Arabic"
							? "المبلغ غير المكتمل"
							: "Uncomplete Amount",
				}}
			/>
			<div className='table-container'>
				<Table dataSource={dataSource} columns={columns} pagination={false} />
			</div>
		</DayToDayReportWrapper>
	);
};

export default DayToDayReport;

const DayToDayReportWrapper = styled.div`
	.datepicker-container {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}
	.scorecards-container {
		display: flex;
		justify-content: space-evenly;
		margin-bottom: 20px;
	}
	.scorecard {
		text-align: center;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 150px;
	}
	.table-container {
		margin-top: 20px;
		padding-left: 200px;
		padding-right: 200px;
	}

	@media (max-width: 1100px) {
		.table-container {
			padding-left: 5px;
			padding-right: 5px;
		}
	}
`;
