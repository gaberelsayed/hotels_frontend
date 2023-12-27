import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import { getHotelReservations2 } from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import moment from "moment";

const ReservationsMain = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [allReservations, setAllReservations] = useState([]);
	const [q, setQ] = useState("");
	const { languageToggle, chosenLanguage } = useCartContext();

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}
		// eslint-disable-next-line
	}, []);

	const getAllReservations = () => {
		getHotelReservations2(user._id).then((data3) => {
			if (data3 && data3.error) {
				console.log(data3.error);
			} else {
				setAllReservations(data3 && data3.length > 0 ? data3 : []);
			}
		});
	};

	useEffect(() => {
		getAllReservations();
		// eslint-disable-next-line
	}, []);

	function search(reservations) {
		return reservations.filter((reservation) => {
			const customerDetails = reservation.customer_details;
			const rooms = reservation.roomId
				.map((room) => room.room_number + room.room_type)
				.join(" ")
				.toLowerCase();
			const query = q.toLowerCase();

			return (
				customerDetails.name.toLowerCase().includes(query) ||
				customerDetails.phone.toLowerCase().includes(query) ||
				customerDetails.email.toLowerCase().includes(query) ||
				rooms.includes(query) ||
				reservation.payment_status.toLowerCase().includes(query)
			);
		});
	}

	function getTotalAmount(reservation) {
		const dailyTotal = reservation.pickedRoomsPricing.reduce(
			(acc, item) => acc + Number(item.chosenPrice),
			0
		);
		return dailyTotal * reservation.days_of_residence;
	}

	return (
		<ReservationsMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='Reservations'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='Reservations'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					)}
				</div>

				<div className='otherContentWrapper'>
					<div
						style={{
							textAlign: chosenLanguage === "Arabic" ? "left" : "right",
							fontWeight: "bold",
							textDecoration: "underline",
							cursor: "pointer",
						}}
						onClick={() => {
							if (chosenLanguage === "English") {
								languageToggle("Arabic");
							} else {
								languageToggle("English");
							}
						}}
					>
						{chosenLanguage === "English" ? "ARABIC" : "English"}
					</div>

					<div className='container-wrapper'>
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
									<th scope='col'>Client Email</th>
									<th scope='col'>Check In</th>
									<th scope='col'>Check Out</th>
									<th scope='col'>Payment Status</th>
									<th scope='col'>Booked Rooms</th>
									<th scope='col'>Total Amount</th>
									<th scope='col'>UPDATE...</th>
								</tr>
							</thead>
							<tbody>
								{allReservations &&
									allReservations &&
									search(allReservations).map((reservation, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{reservation.customer_details.name}</td>
											<td>{reservation.customer_details.phone}</td>
											<td>{reservation.customer_details.email}</td>
											<td>
												{moment(reservation.start_date).format("YYYY-MM-DD")}
											</td>
											<td>
												{moment(reservation.end_date).format("YYYY-MM-DD")}
											</td>
											<td>{reservation.payment_status}</td>
											<td>
												{reservation.roomId.map((room) => (
													<div
														key={room._id}
														style={{ textTransform: "capitalize" }}
													>
														{`${room.room_type}: ${room.room_pricing.basePrice} SAR`}
														<br />
													</div>
												))}
											</td>
											<td>{getTotalAmount(reservation)} SAR</td>
											<td
												style={{
													fontWeight: "bolder",
													color: "darkgreen",
													textDecoration: "underline",
													fontSize: "15px",
													cursor: "pointer",
												}}
											>
												UPDATE
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</ReservationsMainWrapper>
	);
};

export default ReservationsMain;

const ReservationsMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 75%" : "17% 75%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;

		table {
			width: 100%; // Ensures the table uses the full width

			th,
			td {
				vertical-align: middle; // Centers content vertically in each cell
				text-align: center; // Centers content horizontally
				padding: 8px; // Adds some padding for better readability
			}
		}
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
