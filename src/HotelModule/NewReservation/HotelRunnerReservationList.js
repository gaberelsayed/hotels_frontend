import React, { useState, useEffect } from "react";
import { Table, Pagination, Spin } from "antd";
import { getPaginatedListHotelRunner } from "../apiAdmin";
import styled from "styled-components";

const HotelRunnerReservationList = ({ chosenLanguage }) => {
	const [reservations, setReservations] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchReservations(currentPage);
	}, [currentPage]);

	const fetchReservations = (page) => {
		setLoading(true);
		getPaginatedListHotelRunner(page, 15).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setReservations(data.reservations);
				setTotalPages(data.pages * 15); // Assuming 'pages' times 'per_page' gives total record count
				setLoading(false);
			}
		});
	};

	const columns = [
		{
			title: "Confirmation #",
			dataIndex: "provider_number",
			key: "provider_number",
		},
		{
			title: "Guest",
			dataIndex: "guest",
			key: "guest",
		},
		{
			title: "Check-In Date",
			dataIndex: "checkin_date",
			key: "checkin_date",
		},
		{
			title: "Check-Out Date",
			dataIndex: "checkout_date",
			key: "checkout_date",
		},
		{
			title: "Total Amount",
			dataIndex: "total",
			key: "total",
		},
		{
			title: "Reservation State",
			dataIndex: "state",
			key: "state",
		},
		{
			title: "Payment Method",
			dataIndex: "payment",
			key: "payment",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
			render: (address) =>
				`${address.street}, ${address.city}, ${address.country}`,
		},
		{
			title: "Created At",
			dataIndex: "completed_at",
			key: "completed_at",
			render: (text) => new Date(text).toDateString(),
		},
		{
			title: "Room Count",
			key: "room_count",
			render: (record) => record.rooms.length,
		},
		{
			title: "Total Individuals",
			key: "total_individuals",
			render: (record) =>
				record.rooms.reduce((sum, room) => sum + room.total_guest, 0),
		},
		{
			title: "Room Type",
			key: "room_type",
			render: (record) => record.rooms.map((room) => room.name).join(", "),
		},
	];

	return (
		<HotelRunnerReservationListWrapper>
			{loading ? (
				<>
					<div className='text-center my-5'>
						<Spin size='large' />
						<p>Loading...</p>
					</div>
				</>
			) : (
				<>
					<Table
						columns={columns}
						dataSource={reservations}
						rowKey={(record) => record.hr_number}
						pagination={false} // Disable Table's own pagination
					/>
					<div
						className='my-3'
						onClick={() => {
							window.scrollTo({ top: 5, behavior: "smooth" });
						}}
					>
						<Pagination
							current={currentPage}
							total={totalPages}
							onChange={(page) => setCurrentPage(page)}
							pageSize={50}
							style={{ background: "white" }}
						/>
					</div>
				</>
			)}
		</HotelRunnerReservationListWrapper>
	);
};

export default HotelRunnerReservationList;

const HotelRunnerReservationListWrapper = styled.div`
	margin-top: 50px;
	margin-bottom: 50px;
`;
