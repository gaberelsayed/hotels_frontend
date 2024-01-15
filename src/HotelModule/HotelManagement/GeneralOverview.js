import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getListOfRoomSummary } from "../apiAdmin";

const GeneralOverview = () => {
	const [roomsSummary, setRoomsSummary] = useState("");

	const currentDate = new Date();
	const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Milliseconds in a day

	const start_date = new Date(currentDate.getTime() - oneDayMilliseconds);
	const end_date = new Date(currentDate.getTime() + 60 * oneDayMilliseconds);

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

	const gettingOverallRoomsSummary = () => {
		if (start_date && end_date) {
			const formattedStartDate = formatDate(start_date);
			const formattedEndDate = formatDate(end_date);

			getListOfRoomSummary(formattedStartDate, formattedEndDate).then(
				(data) => {
					if (data && data.error) {
						console.log(data.error, "Error rendering");
					} else {
						setRoomsSummary(data);
					}
				}
			);
		} else {
			setRoomsSummary("");
		}
	};

	useEffect(() => {
		gettingOverallRoomsSummary();
		// eslint-disable-next-line
	}, []);

	console.log(roomsSummary, "summary");

	return (
		<GeneralOverviewWrapper>
			<h4>Overall Rooms Summary</h4>
			<StyledTableWrapper className='col-md-10 mx-auto'>
				<table>
					<thead>
						<tr>
							<th>Room Type</th>
							<th>Total Rooms</th>
							<th>Available</th>
							<th>Occupied</th>
							<th>Reserved</th>
						</tr>
					</thead>
					<tbody>
						{roomsSummary &&
							roomsSummary.map((room, index) => (
								<tr key={index}>
									<td>{room.room_type}</td>
									<td>{room.totalRooms}</td>
									<td>{room.available}</td>
									<td>{room.occupiedRooms}</td>
									<td>{room.reservedRooms}</td>
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
