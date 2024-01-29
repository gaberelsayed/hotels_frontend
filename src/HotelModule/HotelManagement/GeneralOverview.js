import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { gettingRoomInventory } from "../apiAdmin";
import { isAuthenticated } from "../../auth";

const GeneralOverview = ({ chosenLanguage, hotelDetails }) => {
	const [roomsSummary, setRoomsSummary] = useState("");

	const { user } = isAuthenticated();

	const currentDate = new Date();
	const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Milliseconds in a day

	const start_date = new Date(currentDate.getTime() - oneDayMilliseconds);
	const end_date = new Date(currentDate.getTime() + 30 * oneDayMilliseconds);

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

	const getRoomInventory = () => {
		const formattedStartDate = formatDate(start_date);
		const formattedEndDate = formatDate(end_date);
		gettingRoomInventory(
			formattedStartDate,
			formattedEndDate,
			user._id,
			hotelDetails._id
		).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				setRoomsSummary(data);
			}
		});
	};

	useEffect(() => {
		getRoomInventory();
		// eslint-disable-next-line
	}, []);

	return (
		<GeneralOverviewWrapper isArabic={chosenLanguage === "Arabic"}>
			<h4>
				Overall Rooms Summary (
				{new Date(start_date).toDateString() +
					" To " +
					new Date(end_date).toDateString()}
				)
			</h4>
			<StyledTableWrapper
				className='col-md-10 mx-auto'
				isArabic={chosenLanguage === "Arabic"}
			>
				<table>
					{chosenLanguage === "Arabic" ? (
						<thead>
							<tr>
								<th>نوع الغرفة</th>
								<th>إجمالي الغرف</th>
								<th>مشغول</th>
								<th>محجوز</th>
								<th>متاح</th>
							</tr>
						</thead>
					) : (
						<thead>
							<tr>
								<th>Room Type</th>
								<th>Total Rooms</th>
								<th>Reserved</th>
								<th>Occupied</th>
								<th>Available</th>
							</tr>
						</thead>
					)}

					<tbody>
						{roomsSummary &&
							roomsSummary.map((room, index) => (
								<tr key={index}>
									<td>{room.room_type}</td>
									<td>{room.total_available}</td>
									<td>{room.reserved}</td>
									<td>{room.occupied}</td>
									<td>{room.available}</td>
								</tr>
							))}
					</tbody>
				</table>
			</StyledTableWrapper>
			{/* <h4>Occupied Rooms</h4>
			<h4>Reserved Rooms</h4> */}
		</GeneralOverviewWrapper>
	);
};

export default GeneralOverview;

const GeneralOverviewWrapper = styled.div`
	text-align: ${(props) => (props.isArabic ? "right" : "")};

	h4 {
		font-weight: bolder;
		font-size: 1.3rem;
		margin: 20px 10px;
	}

	.card {
		min-height: 65px;
		padding: 0px !important;
		margin-bottom: 0px;
		width: 100px;
	}
`;

const StyledTableWrapper = styled.div`
	text-align: ${(props) => (props.isArabic ? "right" : "")};

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		margin-top: 20px;

		th,
		td {
			padding: 12px 15px;
			border: 1px solid #ddd;
			text-transform: capitalize;
		}

		th {
			background-color: #1a2c3e;
			color: white;
			font-weight: bold;
		}

		tr:nth-child(even) {
			background-color: #f2f2f2;
		}

		tr:hover {
			background-color: #ddd;
		}
	}
`;
