import React from "react";
import moment from "moment";

const SingleReservationSection1 = ({ searchedReservation }) => {
	function getTotalAmount(reservation) {
		const dailyTotal = reservation.pickedRoomsType.reduce(
			(acc, room) => acc + Number(room.chosenPrice) * room.count,
			0
		);
		return dailyTotal * reservation.days_of_residence;
	}

	return (
		<>
			{searchedReservation && searchedReservation.customer_details ? (
				<>
					<h3>Reservation Summary</h3>

					<div className='my-2'>
						Visitor Name:{" "}
						{searchedReservation && searchedReservation.customer_details.name}
					</div>

					<div className='row my-2'>
						<div className='col-md-6'>
							Confirmation #:{" "}
							{searchedReservation && searchedReservation.confirmation_number}
						</div>
						<div className='col-md-6 my-auto' style={{ cursor: "pointer" }}>
							<i className='fa-solid fa-message mr-1'></i>
							SEND A MESSAGE
						</div>
					</div>
					<hr />
					<div>
						<div className='row'>
							<div className='col-md-8'>Channel: </div>
							<div
								className='col-md-4'
								style={{ color: "#763131", fontWeight: "bolder" }}
							>
								{searchedReservation &&
									searchedReservation.booking_source &&
									searchedReservation.booking_source.toUpperCase()}
							</div>
						</div>
					</div>
					<hr />
					<div>
						<div className='row'>
							<div className='col-md-8'>Check-in Date: </div>
							<div
								className='col-md-4'
								style={{ color: "#763131", fontWeight: "bolder" }}
							>
								{searchedReservation &&
									moment(searchedReservation.start_date).format("YYYY-MM-DD")}
							</div>
						</div>
					</div>
					<hr />
					<div>
						<div className='row'>
							<div className='col-md-8'>Check-out Date: </div>
							<div
								className='col-md-4'
								style={{ color: "#763131", fontWeight: "bolder" }}
							>
								{searchedReservation &&
									moment(searchedReservation.end_date).format("YYYY-MM-DD")}
							</div>
						</div>
					</div>
					<hr />

					<div
						className='my-4 mx-auto text-center'
						style={{ fontSize: "18px", fontWeight: "bolder" }}
					>
						Total Amount:{" "}
						{Number(getTotalAmount(searchedReservation)).toFixed(2)} SAR
					</div>

					<hr />
					<div className='my-3 mx-auto text-center'>
						<button className='btn btn-outline-success w-75'>
							Check in guest?
						</button>
					</div>

					<div className='my-3 mx-auto text-center'>
						<button className='btn btn-outline-info w-75'>
							Print Receipt?
						</button>
					</div>
				</>
			) : null}
		</>
	);
};

export default SingleReservationSection1;
