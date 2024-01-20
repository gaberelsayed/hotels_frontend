import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import FilterComponent from "./FilterComponent";

const PreReservationTable = ({
	allPreReservations,
	q,
	setQ,
	chosenLanguage,
}) => {
	const [selectedFilter, setSelectedFilter] = useState("");

	const [filteredReservations, setFilteredReservations] = useState([]);

	useEffect(() => {
		let filtered = allPreReservations;
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize today to the beginning of the day

		switch (selectedFilter) {
			case "Today's New Reservations":
				filtered = allPreReservations.filter(
					(reservation) =>
						new Date(reservation.bookedOn).toDateString() ===
						today.toDateString()
				);
				break;
			case "Cancelations":
				filtered = allPreReservations.filter(
					(reservation) =>
						reservation.overallBookingStatus.toLowerCase() === "canceled"
				);
				break;
			case "Today's Arrivals":
				filtered = allPreReservations.filter(
					(reservation) =>
						new Date(reservation.start_date).toDateString() ===
						today.toDateString()
				);
				break;
			case "Today's Departures":
				filtered = allPreReservations.filter(
					(reservation) =>
						new Date(reservation.end_date).toDateString() ===
						today.toDateString()
				);
				break;

			case "Incomplete reservations":
				filtered = allPreReservations.filter(
					(reservation) =>
						reservation.overallBookingStatus.toLowerCase() !== "closed" &&
						reservation.overallBookingStatus.toLowerCase() !== "canceled"
				);
				break;
			default:
				// No filter selected or "Select All"
				filtered = allPreReservations;
		}

		setFilteredReservations(filtered);
	}, [selectedFilter, allPreReservations]);

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
		<PreReservationTableWrapper isArabic={chosenLanguage === "Arabic"}>
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

			<FilterComponent
				setSelectedFilter={setSelectedFilter}
				selectedFilter={selectedFilter}
				chosenLanguage={chosenLanguage}
			/>

			<div style={{ maxHeight: "1000px", overflow: "auto" }}>
				<table
					className='table table-bordered table-md-responsive table-hover table-striped'
					style={{ fontSize: "0.75rem", overflow: "auto" }}
				>
					<thead style={{ background: "white", color: "black" }}>
						<tr>
							<th scope='col'>#</th>
							<th scope='col'>
								{" "}
								{chosenLanguage === "Arabic"
									? "اسم الزائر"
									: "Client Name"}{" "}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "الهاتف" : "Client Phone"}
							</th>
							{/* <th scope='col'>Client Email</th> */}
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "رقم التأكيد" : "Confirmation"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "تاريخ الحجز" : "Booked On"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "تاريخ الوصول" : "Check In"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "تاريخ المغادرة" : "Check Out"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "حالة السداد" : "Payment Status"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "حالة الحجز" : "Status"}
							</th>
							<th scope='col' style={{ width: "13%" }}>
								{chosenLanguage === "Arabic"
									? "أنواع الغرف (السعر × العدد)"
									: "Room Types (Price x Count)"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic"
									? "المبلغ الإجمالي"
									: "Total Amount"}
							</th>
							<th scope='col'>
								{chosenLanguage === "Arabic" ? "تفاصيل" : "DETAILS..."}
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredReservations &&
							search(filteredReservations).map((reservation, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{reservation.customer_details.name}</td>
									<td>{reservation.customer_details.phone}</td>
									{/* <td>{reservation.customer_details.email}</td> */}
									<td>{reservation.confirmation_number}</td>
									<td>{new Date(reservation.bookedOn).toDateString()}</td>
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
											color:
												reservation &&
												reservation.overallBookingStatus === "canceled"
													? "white"
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
											{chosenLanguage === "Arabic"
												? "التفاصيل..."
												: "Details..."}
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</PreReservationTableWrapper>
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
