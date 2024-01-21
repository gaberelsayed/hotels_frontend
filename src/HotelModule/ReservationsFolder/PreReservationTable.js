import React, { useState } from "react";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import moment from "moment";
import FilterComponent from "./FilterComponent";
import { Modal, Pagination, Table } from "antd";
import {
	getReservationSearchAllMatches,
	singlePreReservation,
} from "../apiAdmin";
import { toast } from "react-toastify";
import ReservationDetail from "./ReservationDetail";

const PreReservationTable = ({
	allPreReservations,
	q,
	setQ,
	chosenLanguage,
	handlePageChange,
	handleFilterChange,
	currentPage,
	recordsPerPage,
	selectedFilter,
	setSelectedFilter,
	totalRecords,
	hotelDetails,
	setAllPreReservations,
	setSearchClicked,
	searchClicked,
}) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedReservation, setSelectedReservation] = useState(null);

	function getTotalAmount(reservation) {
		const dailyTotal = reservation.pickedRoomsType.reduce(
			(acc, room) => acc + Number(room.chosenPrice) * room.count,
			0
		);
		return dailyTotal * reservation.days_of_residence;
	}

	const columns = [
		{
			title: "#",
			dataIndex: "index",
			key: "index",
			render: (text, record, index) =>
				(currentPage - 1) * recordsPerPage + index + 1,
		},
		{
			title: chosenLanguage === "Arabic" ? "اسم الزائر" : "Client Name",
			dataIndex: "customer_details",
			key: "name",
			render: (customer_details) => customer_details.name,
		},
		{
			title: chosenLanguage === "Arabic" ? "الهاتف" : "Client Phone",
			dataIndex: "customer_details",
			key: "phone",
			render: (customer_details) => customer_details.phone,
		},
		{
			title: chosenLanguage === "Arabic" ? "رقم التأكيد" : "Confirmation",
			dataIndex: "confirmation_number",
			key: "confirmation_number",
		},
		{
			title: chosenLanguage === "Arabic" ? "تاريخ الحجز" : "Booked On",
			dataIndex: "bookedOn",
			key: "bookedOn",
			render: (bookedOn) => new Date(bookedOn).toDateString(),
		},
		{
			title: chosenLanguage === "Arabic" ? "تاريخ الوصول" : "Check In",
			dataIndex: "start_date",
			key: "start_date",
			render: (start_date) => moment(start_date).format("YYYY-MM-DD"),
		},
		{
			title: chosenLanguage === "Arabic" ? "تاريخ المغادرة" : "Check Out",
			dataIndex: "end_date",
			key: "end_date",
			render: (end_date) => moment(end_date).format("YYYY-MM-DD"),
		},
		{
			title: chosenLanguage === "Arabic" ? "حالة السداد" : "Payment Status",
			dataIndex: "payment_status",
			key: "payment_status",
		},
		{
			title: chosenLanguage === "Arabic" ? "حالة الحجز" : "Status",
			dataIndex: "overallBookingStatus",
			key: "overallBookingStatus",
			render: (overallBookingStatus) => {
				let style = {};
				switch (overallBookingStatus.toLowerCase()) {
					case "canceled":
						style = {
							background: "red",
							color: "white",
							padding: "4px",
							textAlign: "center",
						};
						break;
					case "inhouse":
						style = {
							background: "#FFFACD",
							color: "black",
							padding: "4px",
							textAlign: "center",
						}; // Light yellow background
						break;
					case "closed":
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
				return <div style={style}>{overallBookingStatus}</div>;
			},
		},
		{
			title:
				chosenLanguage === "Arabic"
					? "أنواع الغرف (السعر × العدد)"
					: "Room Types (Price x Count)",
			dataIndex: "pickedRoomsType",
			key: "pickedRoomsType",
			render: (pickedRoomsType) =>
				pickedRoomsType.map((room, index) => (
					<div
						key={index}
					>{`${room.room_type}: ${room.chosenPrice} x ${room.count}`}</div>
				)),
		},
		{
			title: chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
			render: (text, record) =>
				`${Number(getTotalAmount(record)).toFixed(2)} SAR`,
		},
		{
			title: chosenLanguage === "Arabic" ? "تفاصيل" : "DETAILS...",
			key: "details",
			render: (text, record) => (
				<button
					style={{
						color: "blue",
						cursor: "pointer",
						border: "none",
						backgroundColor: "transparent",
					}}
					onClick={() => showDetailsModal(record)}
				>
					{chosenLanguage === "Arabic" ? "التفاصيل..." : "Details..."}
				</button>
			),
		},
	];

	const showDetailsModal = (reservation) => {
		setSelectedReservation(reservation);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		setSelectedReservation(null); // Reset the selected reservation
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setSelectedReservation(null); // Reset the selected reservation
	};

	const searchSubmit = (e) => {
		e.preventDefault();
		if (!q) {
			setSearchClicked(!searchClicked);
			setQ("");
			return;
		}

		getReservationSearchAllMatches(q)
			.then((data) => {
				if (data && data.error) {
					console.log("Search error:", data.error);

					// Check if hotelDetails are available
					if (hotelDetails && hotelDetails._id) {
						singlePreReservation(
							q,
							hotelDetails._id,
							hotelDetails.belongsTo._id
						)
							.then((data2) => {
								if (data2 && data2.error) {
									toast.error("No available value, please try again...");
								} else if (
									data2 &&
									data2.reservations &&
									data2.reservations.length > 0
								) {
									setAllPreReservations(data2.reservations);
								} else {
									toast.error("Incorrect Confirmation #, Please try again...");
								}
							})
							.catch((error) => {
								console.error("Error in singlePreReservation:", error);
								// Handle additional error logic here
							});
					}
				} else if (data) {
					setAllPreReservations(Array.isArray(data) ? data : [data]);
				}
			})
			.catch((error) => {
				console.error("Error in getReservationSearch:", error);
				// Handle additional error logic here
			});
	};

	return (
		<>
			<PreReservationTableWrapper isArabic={chosenLanguage === "Arabic"}>
				<div className='form-group mx-3 text-center'>
					<form className='form' onSubmit={searchSubmit}>
						<label
							className='mt-2 mx-3'
							style={{
								fontWeight: "bold",
								fontSize: "1.05rem",
								color: "black",
							}}
						>
							Search
						</label>
						<input
							className='p-2 my-2 search-input w-50 form-control mx-auto'
							type='text'
							value={q}
							onChange={(e) => setQ(e.target.value.toLowerCase())}
							placeholder={
								chosenLanguage === "Arabic"
									? "البحث حسب هاتف العميل، اسم العميل، البريد الإلكتروني، رقم التأكيد، حالة الدفع"
									: "Search By Client Phone, Client Name, Email, Confirmation #, Payment Status"
							}
							aria-label='Search'
						/>
						<button className='btn btn-success mx-2' type='submit'>
							Search
						</button>
					</form>
				</div>
				{allPreReservations && allPreReservations.length <= 49 ? null : (
					<div
						className='my-3'
						onClick={() => window.scrollTo({ top: 20, behavior: "smooth" })}
					>
						<Pagination
							current={currentPage}
							pageSize={recordsPerPage}
							total={totalRecords}
							onChange={handlePageChange}

							// Add any additional props you need
						/>
					</div>
				)}

				<FilterComponent
					setSelectedFilter={setSelectedFilter}
					selectedFilter={selectedFilter}
					chosenLanguage={chosenLanguage}
				/>

				<Table
					columns={columns}
					dataSource={allPreReservations}
					rowKey={(record) => record.confirmation_number}
					pagination={false} // Disable the table's built-in pagination
					scroll={{ y: 1000 }} // Adjust the height as needed
				/>

				{allPreReservations && allPreReservations.length <= 49 ? null : (
					<div
						className='my-3'
						onClick={() => window.scrollTo({ top: 20, behavior: "smooth" })}
					>
						<Pagination
							current={currentPage}
							pageSize={recordsPerPage}
							total={totalRecords}
							onChange={handlePageChange}

							// Add any additional props you need
						/>
					</div>
				)}
			</PreReservationTableWrapper>

			<Modal
				title={
					chosenLanguage === "Arabic" ? "تفاصيل الحجز" : "Reservation Details"
				}
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				width='84.5%' // Set the width to 80%
				style={{
					// If Arabic, align to the left, else align to the right
					position: "absolute",
					left: chosenLanguage === "Arabic" ? "1%" : "auto",
					right: chosenLanguage === "Arabic" ? "auto" : "5%",
					top: "1%",
				}}
			>
				{selectedReservation && (
					<ReservationDetail reservation={selectedReservation} />
				)}
			</Modal>
		</>
	);
};

export default PreReservationTable;

const PreReservationTableWrapper = styled.div`
	text-align: ${(props) => (props.isArabic ? "right" : "")};

	td {
		text-transform: capitalize;
	}

	.table thead th {
		position: sticky;
		top: 0;
		z-index: 10; // Ensure the header is above other content when scrolling
		background-color: white; // Match the header background color
	}

	.table {
		border-collapse: collapse; // Ensure borders are well aligned
	}
`;
