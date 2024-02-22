import React, { useState } from "react";
import { DatePicker, Radio, Button, Table, Pagination } from "antd";
import moment from "moment";
import styled from "styled-components";
import {
	generalReportReservationsList,
	getGeneralReportReservations,
} from "../../apiAdmin"; // Adjust the import path according to your project structure
import ScoreCards from "../ScoreCards";
import DownloadExcel from "../DownloadExcel";

const GeneralReportMain = ({ hotelDetails, chosenLanguage }) => {
	const [allReservations, setAllReservations] = useState([]);
	const [recordsPerPage] = useState(400);
	const [currentPage, setCurrentPage] = useState(1);
	const [scoreCardObject, setScoreCardObject] = useState("");
	// eslint-disable-next-line
	const [allChannels, setAllChannels] = useState([
		"agoda",
		"expedia",
		"booking.com",
		"janat",
		"affiliate",
		"manual",
	]);
	const [totalRecords, setTotalRecords] = useState(0);

	const [selectedChannel, setSelectedChannel] = useState(undefined);
	const [dateBy, setDateBy] = useState("checkin");
	const [dateRange, setDateRange] = useState([
		moment().subtract(7, "days"),
		moment(),
	]);

	const { RangePicker } = DatePicker;

	const applyFilter = () => {
		const [startDate, endDate] = dateRange;
		const formattedStartDate = startDate.format("YYYY-MM-DD");
		const formattedEndDate = endDate.format("YYYY-MM-DD");
		const channel = selectedChannel || "undefined";

		generalReportReservationsList(
			currentPage, // Assuming page is 1 for now
			recordsPerPage, // Assuming records per page is 10 for now
			formattedStartDate,
			formattedEndDate,
			hotelDetails._id, // Replace with your actual hotelId
			channel,
			dateBy
		).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllReservations(data);

				getGeneralReportReservations(
					formattedStartDate,
					formattedEndDate,
					hotelDetails._id,
					selectedChannel,
					dateBy
				).then((data4) => {
					if (data4 && data4.error) {
						console.log(data4.error, "data4.error");
					} else {
						console.log(data4.total, "data4.total");
						setTotalRecords(data4.total);
						setScoreCardObject(data4);
					}
				});
			}
		});
	};

	const calculateExpediaTotalAmount = (reservation) => {
		let totalAmount = 0;
		const checkinDate = moment(reservation.checkin_date);
		const checkoutDate = moment(reservation.checkout_date);

		hotelDetails.pricingCalendar.forEach((pricing) => {
			const calendarDate = moment(pricing.calendarDate);
			if (
				calendarDate.isSameOrAfter(checkinDate) &&
				calendarDate.isSameOrBefore(checkoutDate)
			) {
				totalAmount += Number(pricing.price);
			}
		});

		return totalAmount;
	};

	const columns = [
		{
			title: "#",
			dataIndex: "index",
			key: "index",
			render: (text, record, index) =>
				(currentPage - 1) * recordsPerPage + index + 1,
		},
		{
			title: chosenLanguage === "Arabic" ? "حالة الحجز" : "Status",
			dataIndex: "reservation_status",
			key: "reservation_status",
			render: (reservation_status) => {
				let style = {};
				switch (reservation_status.toLowerCase()) {
					case "closed":
					case "checked_out":
					case "early_checked_out":
						style = {
							background: "#90EE90",
							color: "green",
							padding: "4px",
							textAlign: "center",
						}; // Light green background
						break;
					case "confirmed":
						style = {
							background: "",
							color: "black",
							padding: "4px",
							textAlign: "center",
						};
						break;
					default:
						style = { padding: "4px", textAlign: "center" };
				}
				return <div style={style}>{reservation_status}</div>;
			},
		},
		{
			title: chosenLanguage === "Arabic" ? "حالة السداد" : "Payment Status",
			dataIndex: "payment",
			key: "payment",
			render: (payment, record) => {
				const paidOnlinePayments = [
					"agoda collect",
					"expedia collect",
					"booking.com collect",
				];
				const isPaidOnline =
					paidOnlinePayments.includes(payment) ||
					record.booking_source === "agoda";
				return isPaidOnline ? "Paid Online" : "Paid in Cash";
			},
		},

		{
			title: chosenLanguage === "Arabic" ? " صافي البیع" : "Subtotal",
			dataIndex: "sub_total",
			key: "sub_total",
			render: (total_amount, record) => {
				let displayAmount = total_amount;
				if (record.payment === "expedia collect") {
					displayAmount = calculateExpediaTotalAmount(record) - total_amount;
				}
				return `${displayAmount.toLocaleString()}`;
			},
		},

		{
			title: chosenLanguage === "Arabic" ? "اجمالي العمولة" : "Commission",
			dataIndex: "commission",
			key: "commission",
			render: (commission, record) => {
				let displayCommission = commission;
				if (record.payment === "expedia collect") {
					// displayCommission = record.total_amount;
					displayCommission = 0;
				} else if (["janat", "affiliate"].includes(record.booking_source)) {
					displayCommission = record.total_amount * 0.1;
				} else {
					displayCommission = record.total_amount - record.sub_total;
				}
				return `${displayCommission.toLocaleString()}`;
			},
		},

		{
			title: chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
			render: (total_amount, record) => {
				return `${total_amount.toLocaleString()}`;
			},
		},

		{
			title: chosenLanguage === "Arabic" ? "اسم الزائر" : "Client Name",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) => customer_details.name,
		},

		{
			title: chosenLanguage === "Arabic" ? "تاريخ الحجز" : "Booked On",
			dataIndex: "booked_at",
			key: "booked_at",
			render: (booked_at) => new Date(booked_at).toDateString(),
		},
		{
			title: chosenLanguage === "Arabic" ? "تاريخ الوصول" : "Check In",
			dataIndex: "checkin_date",
			key: "checkin_date",
			render: (checkin_date) => moment(checkin_date).format("YYYY-MM-DD"),
		},
		{
			title: chosenLanguage === "Arabic" ? "تاريخ المغادرة" : "Check Out",
			dataIndex: "checkout_date",
			key: "checkout_date",
			render: (checkout_date) => moment(checkout_date).format("YYYY-MM-DD"),
		},

		{
			title: chosenLanguage === "Arabic" ? "عدد الغرف" : "Room Count",
			dataIndex: "pickedRoomsType",
			key: "roomCount",
			render: (pickedRoomsType) => {
				// Calculate the total count of rooms
				const totalCount = pickedRoomsType.reduce((total, room) => {
					return total + room.count;
				}, 0);

				return totalCount;
			},
		},

		{
			title: chosenLanguage === "Arabic" ? "أنواع الغرف" : "Room Types",
			dataIndex: "pickedRoomsType",
			key: "pickedRoomsType",
			render: (pickedRoomsType) =>
				pickedRoomsType.map((room, index) => (
					<div
						style={{ textTransform: "capitalize" }}
						key={index}
					>{`${room.room_type}`}</div>
				)),
		},

		{
			title: chosenLanguage === "Arabic" ? "رقم التأكيد" : "Confirmation",
			dataIndex: "confirmation_number",
			key: "confirmation_number",
		},
		{
			title: chosenLanguage === "Arabic" ? "مصدر الحجز" : "Source",
			dataIndex: "booking_source",
			key: "booking_source",
		},
	];

	// Define the pagination config
	const paginationConfig = {
		current: currentPage,
		pageSize: 300, // This should match your state or props
		total: totalRecords,
		onChange: (page) => setCurrentPage(page),
	};

	const handleChannelSelection = (channel) => {
		setSelectedChannel(channel === "All" ? undefined : channel);
	};

	return (
		<GeneralReportMainWrapper>
			<div className='my-4'>
				<ScoreCards scoreCardObject={scoreCardObject} />
			</div>
			<div className='filters text-center'>
				<div className='mt-2'>
					<Radio.Group
						onChange={(e) => setDateBy(e.target.value)}
						value={dateBy}
					>
						<Radio value='checkin'>Check-In</Radio>
						<Radio value='checkout'>Check-Out</Radio>
						<Radio value='bookat'>Booked At</Radio>
					</Radio.Group>
				</div>

				<div className='mt-2'>
					<RangePicker onChange={setDateRange} />
				</div>

				<div className='channel-buttons mt-2'>
					<Button
						type={selectedChannel === undefined ? "primary" : "default"}
						onClick={() => handleChannelSelection("All")}
					>
						All
					</Button>
					{allChannels.map((channel) => (
						<Button
							style={{ textTransform: "capitalize" }}
							key={channel}
							type={selectedChannel === channel ? "primary" : "default"}
							onClick={() => handleChannelSelection(channel)}
						>
							{channel}
						</Button>
					))}
				</div>
				<Button onClick={applyFilter}>Apply Now</Button>
			</div>

			<div className='float-left my-3'>
				<DownloadExcel
					data={allReservations}
					columns={columns}
					title={"General Report"}
					currentPage={currentPage}
					recordsPerPage={recordsPerPage}
				/>
			</div>
			<Table
				columns={columns}
				dataSource={allReservations}
				rowKey='id'
				pagination={false}
				scroll={{ y: 1060 }}
				sticky
			/>

			<div
				className='my-3'
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				<Pagination {...paginationConfig} />
			</div>
		</GeneralReportMainWrapper>
	);
};

export default GeneralReportMain;

const GeneralReportMainWrapper = styled.div`
	.filters {
		margin-bottom: 20px;
	}

	table {
		font-size: 12px !important;
		text-transform: capitalize;
	}

	.channel-buttons {
		margin-bottom: 20px;

		button {
			margin-right: 10px;
		}
	}
`;
