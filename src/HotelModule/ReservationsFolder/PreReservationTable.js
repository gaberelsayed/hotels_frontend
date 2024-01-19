import React from "react";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const PreReservationTable = ({ allPreReservations, q, setQ }) => {
	function search(reservations) {
		return reservations.filter((reservation) => {
			const customerDetails = reservation.customer_details;
			const query = q.toLowerCase();

			return (
				customerDetails.name.toLowerCase().includes(query) ||
				customerDetails.phone.toLowerCase().includes(query) ||
				customerDetails.email.toLowerCase().includes(query) ||
				reservation.confirmation_number.toLowerCase().includes(query) ||
				reservation.overallBookingStatus.toLowerCase().includes(query) ||
				reservation.payment_status.toLowerCase().includes(query)
			);
		});
	}

	function getTotalAmount(reservation) {
		const dailyTotal = reservation.pickedRoomsType.reduce(
			(acc, room) => acc + Number(room.chosenPrice) * room.count,
			0
		);
		return dailyTotal * reservation.days_of_residence;
	}

	return (
		<PreReservationTableWrapper>
			<div className='form-group mx-3 text-center'>
				<label
					className='mt-2 mx-3'
					style={{
						fontWeight: "bold",
						fontSize: "1.05rem",
						color: "black",
						borderRadius: "20px",
					}}
				>
					Search
				</label>
				<input
					className='p-2 my-2 '
					type='text'
					value={q}
					onChange={(e) => setQ(e.target.value.toLowerCase())}
					placeholder='Search By Client Phone, Client Name, Email, Date, Payment Status'
					style={{ borderRadius: "20px", width: "50%" }}
				/>
			</div>
			<table
				className='table table-bordered table-md-responsive table-hover table-striped'
				style={{ fontSize: "0.75rem" }}
			>
				<thead style={{ background: "#191919", color: "white" }}>
					<tr>
						<th scope='col'>#</th>
						<th scope='col'>Client Name</th>
						<th scope='col'>Client Phone</th>
						{/* <th scope='col'>Client Email</th> */}
						<th scope='col'>Confirmation</th>
						<th scope='col'>Check In</th>
						<th scope='col'>Check Out</th>
						<th scope='col'>Payment Status</th>
						<th scope='col'>Status</th>
						<th scope='col' style={{ width: "13%" }}>
							Room Types (Price x Count)
						</th>
						<th scope='col'>Total Amount</th>
						<th scope='col'>DETAILS...</th>
					</tr>
				</thead>
				<tbody>
					{allPreReservations &&
						search(allPreReservations).map((reservation, index) => (
							<tr key={index}>
								<td>{index + 1}</td>
								<td>{reservation.customer_details.name}</td>
								<td>{reservation.customer_details.phone}</td>
								{/* <td>{reservation.customer_details.email}</td> */}
								<td>{reservation.confirmation_number}</td>
								<td>{moment(reservation.start_date).format("YYYY-MM-DD")}</td>
								<td>{moment(reservation.end_date).format("YYYY-MM-DD")}</td>
								<td>{reservation.payment_status}</td>
								<td
									style={{
										background:
											reservation &&
											reservation.overallBookingStatus === "canceled"
												? "red"
												: "",
									}}
								>
									{reservation.overallBookingStatus}
								</td>
								<td>
									{reservation.pickedRoomsType.map((room, roomIndex) => (
										<div key={roomIndex}>
											{`${room.room_type}: ${room.chosenPrice} x ${room.count}`}
											<br />
										</div>
									))}
								</td>
								<td>{Number(getTotalAmount(reservation)).toFixed(2)} SAR</td>
								<td
									style={{
										fontWeight: "bolder",
										color: "darkgreen",
										textDecoration: "underline",
										fontSize: "13px",
										cursor: "pointer",
									}}
									onClick={() => {
										window.scrollTo({ behavior: "smooth", top: 0 });
									}}
								>
									<Link
										to={`/single/prereservation/${reservation.confirmation_number}`}
									>
										Details...
									</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</PreReservationTableWrapper>
	);
};

export default PreReservationTable;

const PreReservationTableWrapper = styled.div`
	td {
		text-transform: capitalize;
	}
`;
