import React from "react";
import styled from "styled-components";
import { DatePicker } from "antd";
import HotelOverviewReservation from "./HotelOverviewReservation";
import moment from "moment";

const ZReservationForm = ({
	customer_details,
	setCustomer_details,
	start_date,
	setStart_date,
	end_date,
	setEnd_date,
	disabledDate,
	chosenLanguage,
	hotelDetails,
	hotelRooms,
	values,
	setPickedHotelRooms,
	pickedHotelRooms,
	clickSubmit,
	total_amount,
	setTotal_Amount,
	days_of_residence,
	setDays_of_residence,
	setPickedRoomPricing,
	pickedRoomPricing,
	allReservations,
	setBookingComment,
	booking_comment,
	setBookingSource,
	booking_source,
	payment_status,
	setConfirmationNumber,
	confirmation_number,
	setPaymentStatus,
	searchQuery,
	setSearchQuery,
	searchClicked,
	setSearchClicked,
	searchedReservation,
}) => {
	const onStartDateChange = (date, dateString) => {
		setStart_date(dateString); // Update the start date
	};

	const onEndDateChange = (date, dateString) => {
		setEnd_date(dateString); // Update the end date

		if (dateString && start_date) {
			const start = moment(start_date);
			const end = moment(dateString);
			const duration = end.diff(start, "days");

			if (duration >= 0) {
				setDays_of_residence(duration);
			} else {
				setDays_of_residence(0); // Reset if the end date is before the start date
			}
		} else {
			setDays_of_residence(0); // Reset if end date or start date is not set
		}
	};

	const disabledEndDate = (current) => {
		// Disables all dates before the start date or today's date (whichever is later)
		return current && current < moment(start_date).startOf("day");
	};

	const calculateTotalAmountPerDay = () => {
		return searchedReservation.pickedRoomsType.reduce((total, room) => {
			return total + room.count * room.chosenPrice;
		}, 0);
	};

	return (
		<ZReservationFormWrapper>
			<div className='my-3'>
				<label>Search For A Reservation</label>
				<input
					type='text'
					className='form-control'
					placeholder='search by name, passport #, confirmation #'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<div
					className='mx-auto text-center col-md-4 mt-2'
					onClick={() => {
						setSearchClicked(!searchClicked);
					}}
				>
					<button className='btn btn-primary btn-block'>Search...</button>
				</div>
			</div>
			<h4>Customer Details:</h4>

			<div className='row'>
				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}> Visitor Name</label>
						<input
							background='red'
							type='text'
							value={customer_details.name}
							onChange={(e) =>
								setCustomer_details({
									...customer_details,
									name: e.target.value,
								})
							}
						/>
					</div>
				</div>
				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}> Visitor Phone</label>
						<input
							background='red'
							type='text'
							value={customer_details.phone}
							onChange={(e) =>
								setCustomer_details({
									...customer_details,
									phone: e.target.value,
								})
							}
						/>
					</div>
				</div>
				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}> Visitor Email</label>
						<input
							background='red'
							type='text'
							value={customer_details.email}
							onChange={(e) =>
								setCustomer_details({
									...customer_details,
									email: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}> Visitor Passport #</label>
						<input
							background='red'
							type='text'
							value={customer_details.passport}
							onChange={(e) =>
								setCustomer_details({
									...customer_details,
									passport: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}>Passport Expiry Date</label>
						<input
							background='red'
							type='text'
							value={customer_details.passportExpiry}
							onChange={(e) =>
								setCustomer_details({
									...customer_details,
									passportExpiry: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}>Nationality</label>
						<input
							background='red'
							type='text'
							value={customer_details.nationality}
							onChange={(e) =>
								setCustomer_details({
									...customer_details,
									nationality: e.target.value,
								})
							}
						/>
					</div>
				</div>

				<div
					className={
						booking_source !== "manual" && booking_source
							? "col-md-3 mx-auto"
							: "col-md-4 mx-auto"
					}
				>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}>Booking Source</label>
						<select
							onChange={(e) => setBookingSource(e.target.value)}
							style={{
								height: "auto",
								width: "100%",
								padding: "10px",
								boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
								borderRadius: "10px",
							}}
						>
							<option value=''>
								{booking_source ? booking_source : "Please Select"}
							</option>
							<option value='manual'>Manual Reservation</option>
							<option value='booking.com'>Booking.com</option>
							<option value='trivago'>Trivago</option>
							<option value='expedia'>Expedia</option>
							<option value='hotel.com'>Hotel.com</option>
						</select>
					</div>
				</div>

				{booking_source !== "manual" && booking_source && (
					<div className='col-md-3'>
						<div
							className='form-group'
							style={{ marginTop: "10px", marginBottom: "10px" }}
						>
							<label style={{ fontWeight: "bold" }}>Confirmation #</label>
							<input
								background='red'
								type='text'
								value={confirmation_number}
								onChange={(e) => setConfirmationNumber(e.target.value)}
							/>
						</div>
					</div>
				)}

				<div
					className={
						booking_source !== "manual" && booking_source
							? "col-md-3 mx-auto"
							: "col-md-4 mx-auto"
					}
				>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}>Payment</label>
						<select
							onChange={(e) => setPaymentStatus(e.target.value)}
							style={{
								height: "auto",
								width: "100%",
								padding: "10px",
								boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
								borderRadius: "10px",
							}}
						>
							<option value=''>
								{searchedReservation && searchedReservation.payment
									? searchedReservation.payment
									: "Please Select"}
							</option>
							<option value='not paid'>Not Paid</option>
							<option value='credit/ debit'>Credit/ Debit</option>
							<option value='cash'>Cash</option>
						</select>
					</div>
				</div>

				<div
					className={
						booking_source !== "manual" && booking_source
							? "col-md-3 mx-auto"
							: "col-md-4 mx-auto"
					}
				>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}>Comment</label>
						<textarea
							background='red'
							cols={4}
							type='text'
							value={booking_comment}
							onChange={(e) => setBookingComment(e.target.value)}
						/>
					</div>
				</div>

				<div className='col-md-6'>
					<label
						className='dataPointsReview mt-3'
						style={{
							fontWeight: "bold",
							fontSize: "1.05rem",
							color: "#32322b",
						}}
					>
						Checkin Date{" "}
						{start_date ? `(${new Date(start_date).toDateString()})` : ""}
					</label>
					<br />
					<DatePicker
						className='inputFields'
						disabledDate={disabledDate}
						inputReadOnly
						size='small'
						showToday={true}
						placeholder='Please pick the desired schedule checkin date'
						style={{
							height: "auto",
							width: "100%",
							padding: "10px",
							boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
							borderRadius: "10px",
						}}
						onChange={onStartDateChange}
					/>
				</div>

				<div className='col-md-6'>
					<label
						className='dataPointsReview mt-3'
						style={{
							fontWeight: "bold",
							fontSize: "1.05rem",
							color: "#32322b",
						}}
					>
						Checkout Date{" "}
						{end_date ? `(${new Date(end_date).toDateString()})` : ""}
					</label>
					<br />
					<DatePicker
						className='inputFields'
						disabledDate={disabledEndDate}
						inputReadOnly
						size='small'
						showToday={true}
						placeholder='Please pick the desired schedule checkout date'
						style={{
							height: "auto",
							width: "100%",
							padding: "10px",
							boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
							borderRadius: "10px",
						}}
						onChange={onEndDateChange}
					/>
				</div>
			</div>

			{customer_details.name &&
			start_date &&
			end_date &&
			searchedReservation &&
			searchedReservation.pickedRoomsType &&
			searchedReservation.pickedRoomsType.length > 0 ? (
				<>
					<div className='total-amount my-3'>
						<h5 style={{ fontWeight: "bold" }}>
							Days Of Residence: {days_of_residence} Days /{" "}
							{days_of_residence <= 1 ? 1 : days_of_residence - 1} Nights
						</h5>

						<h4>
							Total Amount Per Day: {calculateTotalAmountPerDay()} SAR/ Day
						</h4>
						<div className='room-list my-3'>
							{searchedReservation &&
								searchedReservation.pickedRoomsType.map((room, index) => (
									<div
										key={index}
										className='room-item my-2'
										style={{ fontWeight: "bold", textTransform: "capitalize" }}
									>
										{`Room Type: ${room.room_type}, Price: ${room.chosenPrice} SAR, Count: ${room.count} Rooms`}
									</div>
								))}
						</div>

						<h3>
							Total Amount:{" "}
							{(
								calculateTotalAmountPerDay() * Number(days_of_residence)
							).toLocaleString()}{" "}
							SAR
						</h3>
					</div>
				</>
			) : null}

			{customer_details.name && start_date && end_date ? (
				<>
					<div className='mt-4'>
						<h6 style={{ fontWeight: "bold" }}>
							Days Of Residence: {days_of_residence} Days /{" "}
							{days_of_residence <= 1 ? 1 : days_of_residence - 1} Nights
						</h6>
						<h6 style={{ fontWeight: "bold" }}>
							Reserved Rooms:{" "}
							{hotelRooms
								.filter((room) => pickedHotelRooms.includes(room._id))
								.map((room, index) => (
									<span key={room._id}>
										{room.room_number}
										{index < pickedHotelRooms.length - 1 ? ", " : ""}
									</span>
								))}
						</h6>
						<h6 style={{ fontWeight: "bold" }}>
							Room Types:{" "}
							{hotelRooms
								.filter((room) => pickedHotelRooms.includes(room._id))
								.map((room, index) => (
									<span
										key={room._id}
										style={{
											textTransform: "capitalize",
											color: "darkgreen",
										}}
									>
										{room.room_type}
										{index < pickedHotelRooms.length - 1 ? ", " : ""}
									</span>
								))}
						</h6>
						<h4>Total Amount Per Day: {total_amount} SAR/ Day</h4>{" "}
						<h2 style={{ fontWeight: "bold" }}>
							Total Amount:{" "}
							{Number(total_amount * days_of_residence).toLocaleString()} SAR
						</h2>{" "}
					</div>
					<div className='mt-5 mx-auto text-center col-md-6'>
						<button
							className='btn btn-success w-50'
							onClick={() => {
								clickSubmit();
							}}
							style={{ fontWeight: "bold", fontSize: "1.2rem" }}
						>
							Reserve Now...
						</button>
					</div>
					<div className='col-md-8 mx-auto mt-5'>
						<hr />
					</div>

					<h4>Pick Up A Room</h4>
					<h5>Please Click Here To Pick A Room:</h5>

					<HotelOverviewReservation
						hotelDetails={hotelDetails}
						hotelRooms={hotelRooms}
						values={values}
						setPickedHotelRooms={setPickedHotelRooms}
						pickedHotelRooms={pickedHotelRooms}
						total_amount={total_amount}
						setTotal_Amount={setTotal_Amount}
						clickSubmit={clickSubmit}
						pickedRoomPricing={pickedRoomPricing}
						setPickedRoomPricing={setPickedRoomPricing}
						allReservations={allReservations}
						start_date={start_date}
						end_date={end_date}
					/>
				</>
			) : null}
		</ZReservationFormWrapper>
	);
};

export default ZReservationForm;

const ZReservationFormWrapper = styled.div`
	h4 {
		font-size: 1.35rem;
		font-weight: bolder;
	}

	h5 {
		font-size: 1.2rem;
		font-weight: bold;
		text-decoration: underline;
		cursor: pointer;
		margin-top: 20px;
	}

	input[type="text"],
	input[type="email"],
	input[type="password"],
	input[type="date"],
	select,
	textarea {
		display: block;
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
	}
	input[type="text"]:focus,
	input[type="email"]:focus,
	input[type="password"]:focus,
	input[type="date"]:focus,
	select:focus,
	textarea:focus,
	label:focus {
		outline: none;
		border: 1px solid var(--primaryColor);

		box-shadow: 5px 8px 3px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		font-weight: bold;
	}
`;
