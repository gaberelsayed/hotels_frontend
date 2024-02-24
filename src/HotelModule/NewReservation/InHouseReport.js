import React, { useState } from "react";
import { DatePicker, Radio, Button, Table, Pagination } from "antd";
import moment from "moment";
import styled from "styled-components";
import {
	generalReportReservationsList,
	getGeneralReportReservations,
} from "../apiAdmin"; // Adjust the import path according to your project structure
import DownloadExcel from "../HotelReports/DownloadExcel";

const InHouseReport = ({ hotelDetails, chosenLanguage }) => {
	const [allReservations, setAllReservations] = useState([]);
	const [recordsPerPage] = useState(400);
	const [currentPage, setCurrentPage] = useState(1);
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
	const [cancelFilter, setCancelFilter] = useState(0);
	const [inhouseFilter, setInhouseFilter] = useState(1);
	const [noshowFilter, setNoshowFilter] = useState(0);
	const [showCheckedout, setShowCheckedout] = useState(0);
	const [selectedFilter, setSelectedFilter] = useState("showInhouse");

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
			dateBy,
			noshowFilter,
			cancelFilter,
			inhouseFilter,
			showCheckedout
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
					dateBy,
					noshowFilter,
					cancelFilter,
					inhouseFilter,
					showCheckedout
				).then((data4) => {
					if (data4 && data4.error) {
						console.log(data4.error, "data4.error");
					} else {
						console.log(data4.total, "data4.total");
						setTotalRecords(data4.total);
					}
				});
			}
		});
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
			title: chosenLanguage === "Arabic" ? "رقم التأكيد" : "Confirmation",
			dataIndex: "confirmation_number",
			key: "confirmation_number",
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
			title: chosenLanguage === "Arabic" ? "اسم الزائر" : "Client Name",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) => customer_details.name,
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
			title: chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
			render: (total_amount, record) => {
				return `${total_amount.toLocaleString()}`;
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
			title: chosenLanguage === "Arabic" ? "عدد الغرف" : "Room Count",
			dataIndex: "roomCount",
			key: "roomCount",
		},
		{
			title: chosenLanguage === "Arabic" ? "رقم الغرفة" : "Room Number",
			key: "roomDetails",
			render: (record) => {
				// Check if 'record' and 'roomDetails' are available and have entries
				if (record && record.roomDetails && record.roomDetails.length > 0) {
					return record.roomDetails.map((room, index) => (
						<div key={index}>
							{room.room_number ? room.room_number : "No Room"}
						</div>
					));
				}

				// If 'roomDetails' is not available, check 'roomId'
				else if (record && record.roomId && record.roomId.length > 0) {
					return record.roomId.map((room, index) => (
						<div key={index}>
							{room.room_number ? room.room_number : "No Room"}
						</div>
					));
				}

				// If neither is available, return "No Room"
				return "No Room";
			},
		},

		{
			title: chosenLanguage === "Arabic" ? "إجمالي الضيوف" : "Total Guests",
			dataIndex: "total_guests",
			key: "total_guests",
		},

		{
			title: chosenLanguage === "Arabic" ? "تاريخ الميلاد" : "Date Of Birth",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) =>
				customer_details && customer_details.passportExpiry,
		},

		{
			title:
				chosenLanguage === "Arabic" ? "رقم جواز السفر" : "Guest Passport #",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) =>
				customer_details && customer_details.passport,
		},
		{
			title:
				chosenLanguage === "Arabic" ? "نسخة جواز السفر" : "Passport Copy #",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) =>
				customer_details && customer_details.copyNumber,
		},

		{
			title: chosenLanguage === "Arabic" ? "الهاتف" : "Phone",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) => customer_details && customer_details.phone,
		},

		{
			title: chosenLanguage === "Arabic" ? "رقم لوحة السيارة" : "License Plate",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) =>
				customer_details && customer_details.carLicensePlate
					? customer_details.carLicensePlate
					: "N/A",
		},
		{
			title: chosenLanguage === "Arabic" ? "لون السيارة" : "Car Color",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) =>
				customer_details && customer_details.carColor
					? customer_details.carColor
					: "N/A",
		},
		{
			title: chosenLanguage === "Arabic" ? "موديل/نوع السيارة" : "Car Model",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) =>
				customer_details && customer_details.carModel
					? customer_details.carModel
					: "N/A",
		},
	];

	// Define the pagination config
	const paginationConfig = {
		current: currentPage,
		pageSize: 300, // This should match your state or props
		total: totalRecords,
		onChange: (page) => setCurrentPage(page),
	};

	// eslint-disable-next-line
	const handleChannelSelection = (channel) => {
		setSelectedChannel(channel === "All" ? undefined : channel);
	};

	const handleFilterSelection = (filterType) => {
		setSelectedFilter(filterType);
		if (filterType === "excludeCancelNoShow") {
			setCancelFilter(1);
			setNoshowFilter(1);
			setInhouseFilter(0);
		} else if (filterType === "showInhouse") {
			setCancelFilter(0);
			setNoshowFilter(0);
			setInhouseFilter(1);
		} else if (filterType === "selectAll") {
			setCancelFilter(0);
			setNoshowFilter(0);
			setInhouseFilter(0);
		} else if (filterType === "showCancelNoShow") {
			setCancelFilter(2);
			setNoshowFilter(2);
		} else if (filterType === "showcheckedout") {
			setShowCheckedout(1);
		}
	};

	const generateTableTitle = () => {
		let title = "General Report | ";
		title += `Date Range: ${dateRange[0].format(
			"YYYY-MM-DD"
		)} to ${dateRange[1].format("YYYY-MM-DD")} | `;
		title += `Channel: ${selectedChannel || "All"} | `;
		title += `Date By: ${dateBy.charAt(0).toUpperCase() + dateBy.slice(1)} | `;

		if (selectedFilter === "excludeCancelNoShow") {
			title += "Excluding Cancel & No Show";
		} else if (selectedFilter === "showInhouse") {
			title += "Showing Inhouse Only";
		} else {
			title += "Including All Reservations";
		}

		return title;
	};

	return (
		<InHouseReportWrapper>
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

				<div className='filter-buttons mt-2'>
					<Button
						type={selectedFilter === "selectAll" ? "primary" : "default"}
						style={{
							backgroundColor:
								selectedFilter === "selectAll" ? "#500000" : undefined,
							borderColor:
								selectedFilter === "selectAll" ? "#500000" : undefined,
						}}
						onClick={() => handleFilterSelection("selectAll")}
					>
						All
					</Button>

					<Button
						type={selectedFilter === "showCancelNoShow" ? "primary" : "default"}
						style={{
							backgroundColor:
								selectedFilter === "showCancelNoShow" ? "#500000" : undefined,
							borderColor:
								selectedFilter === "showCancelNoShow" ? "#500000" : undefined,
						}}
						onClick={() => handleFilterSelection("showCancelNoShow")}
					>
						Show Cancel & No Show
					</Button>
					<Button
						type={selectedFilter === "showInhouse" ? "primary" : "default"}
						style={{
							backgroundColor:
								selectedFilter === "showInhouse" ? "#500000" : undefined,
							borderColor:
								selectedFilter === "showInhouse" ? "#500000" : undefined,
						}}
						onClick={() => handleFilterSelection("showInhouse")}
					>
						Show Inhouse
					</Button>
					<Button
						type={selectedFilter === "showcheckedout" ? "primary" : "default"}
						style={{
							backgroundColor:
								selectedFilter === "showcheckedout" ? "#500000" : undefined,
							borderColor:
								selectedFilter === "showcheckedout" ? "#500000" : undefined,
						}}
						onClick={() => handleFilterSelection("showcheckedout")}
					>
						Show Checked Out
					</Button>
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
				title={() => (
					<div
						className='text-center'
						style={{
							fontWeight: "bold",
							fontSize: "1.1rem",
							textDecoration: "underline",
						}}
					>
						{generateTableTitle()}
					</div>
				)}
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
		</InHouseReportWrapper>
	);
};

export default InHouseReport;

const InHouseReportWrapper = styled.div`
	.filters {
		margin-bottom: 20px;
	}

	table {
		font-size: 11px !important;
		text-transform: capitalize;
	}

	.channel-buttons {
		margin-bottom: 20px;

		button {
			margin-right: 10px;
		}
	}

	.filter-buttons {
		margin-bottom: 20px;

		button {
			margin-right: 10px;
		}
	}
`;
