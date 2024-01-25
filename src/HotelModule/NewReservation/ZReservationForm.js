import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DatePicker, Spin } from "antd";
import HotelOverviewReservation from "./HotelOverviewReservation";
import moment from "moment";
import { toast } from "react-toastify";
import { getPaginatedListHotelRunner, prerservationAuto } from "../apiAdmin";

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
	pickedRoomsType,
	setPickedRoomsType,
}) => {
	const [decrement, setDecrement] = useState(0);
	const [loading, setLoading] = useState(false);
	const [taskeenClicked, setTaskeenClicked] = useState(false);

	const [isFixed, setIsFixed] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;
			if (currentScrollPos > 750) {
				setIsFixed(true);
			} else if (currentScrollPos < 750) {
				setIsFixed(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

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
		if (searchedReservation && searchedReservation.pickedRoomsType) {
			return searchedReservation.pickedRoomsType.reduce((total, room) => {
				return total + room.count * room.chosenPrice;
			}, 0);
		}
	};

	const addPreReservations = () => {
		const isConfirmed = window.confirm(
			chosenLanguage === "Arabic"
				? "قد تستغرق هذه العملية بضع دقائق، هل تريد المتابعة؟"
				: "This may take a few minutes, Do you want to proceed?"
		);
		if (!isConfirmed) return;

		setLoading(true);
		getPaginatedListHotelRunner(1, 15).then((data0) => {
			if (data0 && data0.error) {
				console.log(data0.error);
			} else {
				prerservationAuto(
					data0.pages - decrement,
					hotelDetails._id,
					hotelDetails.belongsTo._id
				).then((data) => {
					setDecrement(decrement + 1);
					setLoading(false);
				});
			}
		});
	};

	const handleTaskeenClicked = () => {
		if (!customer_details.name) {
			return toast.error(
				chosenLanguage === "Arabic"
					? "الرجاء إدخال اسم الزائر"
					: "Name is required"
			);
		}
		if (!customer_details.phone) {
			return toast.error(
				chosenLanguage === "Arabic"
					? "الرجاء إدخال رقم هاتف الزائر"
					: "Phone is required"
			);
		}
		if (!customer_details.passport) {
			return toast.error(
				chosenLanguage === "Arabic"
					? "الرجاء إدخال رقم جواز الزائر"
					: "passport is required"
			);
		}
		if (!customer_details.nationality) {
			return toast.error(
				chosenLanguage === "Arabic"
					? "الرجاء إدخال جنسية الزائر"
					: "nationality is required"
			);
		}
		if (!start_date) {
			return toast.error(
				chosenLanguage === "Arabic"
					? "الرجاء إدخال تاريخ وصول الزائر"
					: "Check in Date is required"
			);
		}

		if (!end_date) {
			return toast.error(
				chosenLanguage === "Arabic"
					? "الرجاء إدخال تاريخ مغادرة الزائر"
					: "Check out Date is required"
			);
		}
		setTaskeenClicked(true);
		setTimeout(() => {
			window.scrollTo({ top: 760, behavior: "smooth" });
		}, 1000);
	};

	return (
		<ZReservationFormWrapper
			arabic={chosenLanguage === "Arabic"}
			is_Fixed={isFixed}
		>
			{loading ? (
				<>
					<div className='text-center my-5'>
						<Spin size='large' />
						<p>
							{" "}
							{chosenLanguage === "Arabic" ? "" : ""} Loading Reservations...
						</p>
					</div>
				</>
			) : (
				<>
					<div
						className='mx-auto mb-5 mt-4 text-center'
						onClick={() => {
							addPreReservations();
						}}
					>
						<button className='btn btn-success' style={{ fontWeight: "bold" }}>
							{chosenLanguage === "Arabic"
								? "تنزيل جميع الحجوزات من Booking.com وExpedia وTrivago؟"
								: "Get All Reservations from Booking.com, Expedia & Trivago?"}
						</button>
					</div>

					<div className='row'>
						<div className='col-md-8'>
							<div className='my-3'>
								<div className='row'>
									<div className='col-md-9 my-auto'>
										<input
											type='text'
											className='form-control'
											placeholder={
												chosenLanguage === "Arabic"
													? "البحث بالاسم، رقم جواز السفر، رقم التأكيد"
													: "search by name, passport #, confirmation #"
											}
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
									</div>
									<div
										className='col-md-3 my-auto'
										onClick={() => {
											setSearchClicked(!searchClicked);
										}}
									>
										<button className='btn btn-success'>
											{" "}
											{chosenLanguage === "Arabic" ? "البحث..." : "Search..."}
										</button>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-md-4'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{" "}
											{chosenLanguage === "Arabic" ? "الاسم" : "Guest Name"}
										</label>
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
										<label style={{ fontWeight: "bold" }}>
											{" "}
											{chosenLanguage === "Arabic" ? "الهاتف" : "Guest Phone"}
										</label>
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
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "البريد الإلكتروني"
												: "Guest Email"}{" "}
										</label>
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
										<label style={{ fontWeight: "bold" }}>
											{" "}
											{chosenLanguage === "Arabic"
												? "رقم جواز السفر"
												: "Guest Passport #"}
										</label>
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
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "تاريخ انتهاء جواز السفر"
												: "Passport Expiry Date"}
										</label>
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
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic" ? "الجنسية" : "Nationality"}
										</label>
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

								<div className='col-md-6'>
									<label
										className='dataPointsReview mt-3'
										style={{
											fontWeight: "bold",
											fontSize: "1.05rem",
											color: "#32322b",
										}}
									>
										{chosenLanguage === "Arabic"
											? "تاريخ الوصول"
											: "Checkin Date"}{" "}
										{start_date
											? `(${new Date(start_date).toDateString()})`
											: ""}
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
										{chosenLanguage === "Arabic"
											? "موعد انتهاء الأقامة"
											: "Checkout Date"}{" "}
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

							<div
								className='row my-4 mx-auto'
								style={{
									background: "#d3d3d3",
									width: "99%",
									minHeight: "250px",
								}}
							>
								<div className='col-md-6 mx-auto my-2'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "مصدر الحجز"
												: "Booking Source"}
										</label>
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
									<div className='col-md-6 mx-auto my-2'>
										<div
											className='form-group'
											style={{
												marginTop: "10px",
												marginBottom: "10px",
												fontWeight: "bold",
											}}
										>
											<label style={{ fontWeight: "bold" }}>
												{chosenLanguage === "Arabic"
													? "رقم التأكيد"
													: "Confirmation #"}
											</label>
											<input
												background='red'
												type='text'
												value={confirmation_number}
												onChange={(e) => setConfirmationNumber(e.target.value)}
											/>
										</div>
									</div>
								)}

								<div className='col-md-6 mx-auto my-auto'>
									<div className='form-group'>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "طريقة الدفع او السداد"
												: "Payment"}
										</label>
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

								<div className='col-md-6 mx-auto my-2'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic" ? "تعليق الضيف" : "Comment"}
										</label>
										<textarea
											background='red'
											cols={6}
											type='text'
											value={booking_comment}
											onChange={(e) => setBookingComment(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='col-md-4 taskeen'>
							<h4 className='my-2'>
								{chosenLanguage === "Arabic"
									? "حجز غرفة للضيف"
									: "Reserve A Room For The Guest"}
							</h4>

							<div
								className='row'
								style={{
									textTransform: "capitalize",
									fontWeight: "bold",
									padding: "10px",
								}}
							>
								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic"
										? "رقم التأكيد"
										: "Confirmation #"}
								</div>

								<div className='col-md-6 my-2'>{confirmation_number}</div>

								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "تاريخ الوصول" : "Arrival"}
									<div style={{ background: "#bfbfbf", padding: "2px" }}>
										{start_date ? `${new Date(start_date).toDateString()}` : ""}
									</div>
								</div>

								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "تاريخ المغادرة" : "Departure"}
									<div style={{ background: "#bfbfbf", padding: "2px" }}>
										{end_date ? `${new Date(end_date).toDateString()}` : ""}
									</div>
								</div>
								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "طريقة الدفع" : "Payment"}
								</div>
								<div
									className='col-md-4 mx-auto my-2 '
									style={{
										background: "darkred",
										color: "white",
										textTransform: "uppercase",
									}}
								>
									{searchedReservation.payment_status === payment_status
										? searchedReservation && searchedReservation.payment
										: payment_status}
								</div>
								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "حالة الحجز" : "Status"}
								</div>
								<div
									className='col-md-3 mx-auto my-2 '
									style={{ background: "darkgreen", color: "white" }}
								>
									{searchedReservation &&
										searchedReservation.overallBookingStatus}
								</div>
							</div>
							<h4 className='my-4 text-center' style={{ color: "#006ad1" }}>
								{chosenLanguage === "Arabic"
									? "المبلغ الإجمالي"
									: "Total Amount:"}{" "}
								{calculateTotalAmountPerDay() &&
								searchedReservation &&
								searchedReservation.reservation_id
									? calculateTotalAmountPerDay() &&
									  calculateTotalAmountPerDay().toLocaleString()
									: searchedReservation.total_amount}{" "}
								{chosenLanguage === "Arabic" ? "ريال سعودي" : "SAR"}
							</h4>
							<div className='text-center mx-auto'>
								<button
									className='btn btn-info'
									style={{ fontWeight: "bold", fontSize: "1.2rem" }}
									onClick={() => {
										handleTaskeenClicked();
									}}
								>
									{chosenLanguage === "Arabic"
										? "تسكين الان..."
										: "Check The Guest In..."}
								</button>
							</div>

							<>
								{customer_details.name &&
								start_date &&
								end_date &&
								searchedReservation &&
								searchedReservation.pickedRoomsType &&
								searchedReservation.pickedRoomsType.length > 0 ? (
									<>
										<div className='total-amount my-3'>
											{chosenLanguage === "Arabic" ? (
												<h5 style={{ fontWeight: "bold" }}>
													أيام الإقامة: {days_of_residence} يوم /
													{days_of_residence <= 1 ? 1 : days_of_residence} ليالي
												</h5>
											) : (
												<h5 style={{ fontWeight: "bold" }}>
													Days Of Residence: {days_of_residence} Days /
													{days_of_residence <= 1 ? 1 : days_of_residence}{" "}
													Nights
												</h5>
											)}

											<h5>
												{chosenLanguage === "Arabic"
													? "المبلغ الإجمالي ليوم واحد:"
													: "Total Amount Per Day:"}{" "}
												{calculateTotalAmountPerDay() &&
												searchedReservation &&
												searchedReservation.reservation_id
													? (
															calculateTotalAmountPerDay() / days_of_residence
													  ).toLocaleString()
													: (
															searchedReservation.total_amount /
															days_of_residence
													  ).toLocaleString()}{" "}
												{chosenLanguage === "Arabic"
													? "ريال سعودي/ يوم"
													: "SAR/ Day"}
											</h5>

											{chosenLanguage === "Arabic" ? (
												<div className='room-list my-3'>
													{searchedReservation &&
														searchedReservation.pickedRoomsType.map(
															(room, index) => (
																<div
																	key={index}
																	className='room-item my-2'
																	style={{
																		fontWeight: "bold",
																		textTransform: "capitalize",
																	}}
																>
																	{`نوع الغرفة: ${room.room_type}، السعر: ${room.chosenPrice} ريال سعودي، العدد: ${room.count} غرف`}
																</div>
															)
														)}
												</div>
											) : (
												<div className='room-list my-3'>
													{searchedReservation &&
														searchedReservation.pickedRoomsType.map(
															(room, index) => (
																<div
																	key={index}
																	className='room-item my-2'
																	style={{
																		fontWeight: "bold",
																		textTransform: "capitalize",
																	}}
																>
																	{`Room Type: ${room.room_type}, Price: ${room.chosenPrice} SAR, Count: ${room.count} Rooms`}
																</div>
															)
														)}
												</div>
											)}
										</div>
									</>
								) : null}
							</>
						</div>
					</div>

					{customer_details.name && start_date && end_date && taskeenClicked ? (
						<>
							<div
								className={isFixed ? "fixed-section visible" : "fixed-section"}
							>
								<div className='review-grid'>
									{customer_details.name &&
									start_date &&
									end_date &&
									searchedReservation &&
									searchedReservation.pickedRoomsType &&
									searchedReservation.pickedRoomsType.length > 0 ? (
										<div
											style={{
												borderLeft: "1px white solid",
												paddingRight: "10px",
												maxHeight: "100px",
												overflow: "auto",
											}}
										>
											{searchedReservation &&
												searchedReservation.pickedRoomsType.map(
													(room, index) => (
														<div key={index} className='inner-grid'>
															{index === 0 ? (
																<div>
																	<div>
																		{customer_details && customer_details.name}
																	</div>
																	<div className='mx-auto mt-2'>
																		{chosenLanguage === "Arabic"
																			? "رقم التأكيد"
																			: "Confirmation #"}
																		: {confirmation_number}
																	</div>
																</div>
															) : (
																<div></div>
															)}

															<div>
																{index === 0 ? (
																	<div>
																		{chosenLanguage === "Arabic"
																			? "أنواع الغرف:"
																			: "Room Types:"}{" "}
																	</div>
																) : null}

																<div
																	className='mx-auto mt-1'
																	style={{
																		background: "white",
																		width: "85%",
																		padding: "5px",
																		textTransform: "capitalize",
																	}}
																>
																	{room.room_type}
																</div>
															</div>

															<div>
																{index === 0 ? (
																	<div>
																		{chosenLanguage === "Arabic"
																			? "	عدد الغرف:"
																			: "Room Count:"}{" "}
																	</div>
																) : null}

																<div
																	className='mx-auto mt-1'
																	style={{
																		background: "white",
																		width: "85%",
																		padding: "5px",
																	}}
																>
																	{room.count}
																</div>
															</div>
															<div>
																{index === 0 ? (
																	<div>
																		{chosenLanguage === "Arabic"
																			? "السعر في اليوم الواحد:"
																			: "Price/ Day:"}{" "}
																	</div>
																) : null}

																<div
																	className='mx-auto mt-1'
																	style={{
																		background: "white",
																		width: "85%",
																		padding: "5px",
																	}}
																>
																	{calculateTotalAmountPerDay() &&
																	searchedReservation.reservation_id
																		? calculateTotalAmountPerDay() /
																				days_of_residence &&
																		  (
																				calculateTotalAmountPerDay() /
																				days_of_residence
																		  ).toLocaleString()
																		: (
																				searchedReservation.total_amount /
																				days_of_residence
																		  ).toLocaleString()}
																</div>
															</div>
														</div>
													)
												)}
										</div>
									) : null}

									<div
										style={{
											borderRight: "1px white solid",
											paddingRight: "10px",
											maxHeight: "100px",
											overflow: "auto",
										}}
									>
										<div
											style={{
												borderLeft: "1px white solid",
												paddingRight: "10px",
											}}
										>
											{pickedHotelRooms &&
												pickedRoomPricing &&
												pickedRoomPricing.length > 0 &&
												pickedHotelRooms.length > 0 &&
												hotelRooms
													.filter((room) => pickedHotelRooms.includes(room._id))
													.map((room, index) => (
														<div key={index} className='inner-grid'>
															<div></div>

															<div>
																{index === 0 ? (
																	<div>
																		{chosenLanguage === "Arabic"
																			? "أنواع الغرف:"
																			: "Room Types:"}{" "}
																	</div>
																) : null}

																<div
																	className='mx-auto mt-1'
																	style={{
																		background: "white",
																		width: "85%",
																		padding: "5px",
																		textTransform: "capitalize",
																	}}
																>
																	{room.room_type}
																	<div
																		style={{
																			color: "red",
																			fontWeight: "bold",
																			float: "right",
																			cursor: "pointer",
																		}}
																	>
																		X
																	</div>{" "}
																</div>
															</div>

															<div>
																{index === 0 ? (
																	<div>
																		{chosenLanguage === "Arabic"
																			? "	عدد الغرف:"
																			: "Room Count:"}{" "}
																	</div>
																) : null}

																<div
																	className='mx-auto mt-1'
																	style={{
																		background: "white",
																		width: "85%",
																		padding: "5px",
																	}}
																>
																	1
																</div>
															</div>
															<div>
																{index === 0 ? (
																	<div>
																		{chosenLanguage === "Arabic"
																			? "السعر في اليوم الواحد:"
																			: "Price/ Day:"}{" "}
																	</div>
																) : null}

																<div
																	className='mx-auto mt-1'
																	style={{
																		background: "white",
																		width: "85%",
																		padding: "5px",
																	}}
																>
																	{pickedRoomPricing &&
																		pickedRoomPricing[index] &&
																		pickedRoomPricing[index].chosenPrice}
																</div>
															</div>
														</div>
													))}
										</div>
									</div>
								</div>
								<div className='px-5 py-1' style={{ marginRight: "25%" }}>
									<button
										className='btn btn-success px-5 py-0'
										onClick={() => {
											clickSubmit();
										}}
										style={{ fontWeight: "bold", fontSize: "1.2rem" }}
									>
										{chosenLanguage === "Arabic"
											? "احجز الان..."
											: "Reserve Now..."}
									</button>
									<h4
										className='mt-3'
										style={{
											fontWeight: "bold",
											color:
												calculateTotalAmountPerDay() *
													Number(days_of_residence) !==
												Number(total_amount * days_of_residence)
													? "red"
													: "#3d7bb8",
										}}
									>
										{chosenLanguage === "Arabic"
											? "المبلغ الإجمالي"
											: "Total Amount:"}{" "}
										{Number(total_amount * days_of_residence)}{" "}
										{chosenLanguage === "Arabic" ? "ريال سعودي" : "SAR"}
									</h4>{" "}
								</div>
							</div>

							<div className='col-md-8 mx-auto mt-5'>
								<hr />
							</div>

							<h4>
								{chosenLanguage === "Arabic"
									? "يرجى اختيار الغرف"
									: "Pick Up A Room"}
							</h4>
							<h5>
								{chosenLanguage === "Arabic"
									? "الرجاء الضغط أدناه في الفندق لاختيار غرفة:"
									: "Please Click Here To Pick A Room:"}
							</h5>

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
								chosenLanguage={chosenLanguage}
								pickedRoomsType={pickedRoomsType}
								setPickedRoomsType={setPickedRoomsType}
							/>
						</>
					) : null}
				</>
			)}
		</ZReservationFormWrapper>
	);
};

export default ZReservationForm;

const ZReservationFormWrapper = styled.div`
	margin-top: 40px;
	margin-right: ${(props) => (props.is_Fixed ? "" : "20px")};

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

	.taskeen {
		background-color: white;
		min-height: 250px;
		border-radius: 5px;
	}

	text-align: ${(props) => (props.arabic ? "right" : "")};

	label,
	div {
		text-align: ${(props) => (props.arabic ? "right" : "")};
	}

	.review-grid {
		display: grid;
		grid-template-columns: 35% 35%;
		padding: 20px;
	}

	.fixed-section {
		position: fixed;
		top: 0;
		width: 100%;
		background-color: darkgrey;
		z-index: 10;
		opacity: 0; // Start with the section being transparent
		transition: opacity 0.5s ease-in-out; // Smooth transition for opacity
	}

	.visible {
		opacity: 1; // Fully visible when the class 'visible' is added
	}

	.inner-grid {
		display: grid;
		grid-template-columns: 160px 150px 150px 150px;
	}

	.inner-grid > div > div {
		text-align: center;
		font-weight: bold;
	}
`;
