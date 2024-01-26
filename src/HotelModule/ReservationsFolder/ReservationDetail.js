import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCartContext } from "../../cart_context";
import { isAuthenticated } from "../../auth";
import { singlePreReservationHotelRunner } from "../apiAdmin";
import { Spin } from "antd";
import moment from "moment";

const Wrapper = styled.div`
	min-height: 750px;
	margin-top: 30px;
	text-align: ${(props) => (props.isArabic ? "right" : "")};
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 120px;
	background-color: #f2f2f2;
	padding: 0 16px;
	h4,
	h3 {
		font-weight: bold;
	}

	button {
		background-color: black;
		color: white;
		padding: 1px;
		font-size: 13px;
		border-radius: 5px;
		text-align: center;
		margin: auto;
	}
`;

const Section = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const HorizontalLine = styled.hr`
	border: none;
	border-bottom: 2px solid black;
	margin: 0;
`;

const Content = styled.div`
	display: flex;
	padding: 16px;
`;

const ContentSection = styled.div`
	padding: 0 16px;

	&:first-child,
	&:last-child {
		flex: 0 0 30%;
	}

	&:nth-child(2) {
		flex: 0 0 40%;
		border-right: 1px solid #ddd;
		border-left: 1px solid #ddd;
	}
`;

// ... other styled components

const ReservationDetail = ({ reservation }) => {
	const [loading, setLoading] = useState(true);
	const [singleReservationHotelRunner, setSingleReservationHotelRunner] =
		useState("");
	const { languageToggle, chosenLanguage } = useCartContext();

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	const renderingBookingData = () => {
		setLoading(true);

		singlePreReservationHotelRunner(reservation.confirmation_number).then(
			(data4) => {
				if (data4 && data4.error) {
					console.log(data4.error);
				} else {
					setSingleReservationHotelRunner(
						data4.reservations && data4.reservations[0]
					);
					setLoading(false);
				}
			}
		);
	};

	useEffect(() => {
		renderingBookingData();
		// eslint-disable-next-line
	}, [reservation]);

	const getTotalAmountPerDay = (pickedRoomsType) => {
		return pickedRoomsType.reduce((total, room) => {
			return total + room.chosenPrice * room.count;
		}, 0); // Start with 0 for the total
	};

	const calculateDaysBetweenDates = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			console.error("Invalid start or end date");
			return 0;
		}
		const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
		return days > 0 ? days : 1; // Ensures a minimum of 1 day
	};

	// Calculate the number of days of residency
	const daysOfResidence = calculateDaysBetweenDates(
		reservation.checkin_date,
		reservation.checkout_date
	);

	// Calculate the total amount
	const total_amount_hotel_runner =
		singleReservationHotelRunner &&
		singleReservationHotelRunner.rooms &&
		singleReservationHotelRunner.rooms.length > 0
			? singleReservationHotelRunner.rooms
					.reduce((acc, room) => {
						const roomTotal = room.daily_prices.reduce((sum, price) => {
							return sum + (typeof price.price === "number" ? price.price : 0);
						}, 0);
						return acc + roomTotal;
					}, 0)
					.toFixed(2)
			: reservation.pickedRoomsType
					.reduce((acc, room) => {
						const chosenPrice = parseFloat(room.chosenPrice);
						if (!isNaN(chosenPrice) && typeof room.count === "number") {
							return acc + chosenPrice * room.count * daysOfResidence;
						} else {
							console.error("Invalid chosenPrice or count:", room);
							return acc;
						}
					}, 0)
					.toFixed(2);

	// Revised calculateReservationPeriod function
	function calculateReservationPeriod(checkin, checkout, language) {
		const checkinDate = moment(checkin).locale(
			language === "Arabic" ? "ar" : "en"
		);
		const checkoutDate = moment(checkout).locale(
			language === "Arabic" ? "ar" : "en"
		);
		console.log(checkinDate.toString(), checkoutDate.toString()); // Debugging

		const duration = moment.duration(checkoutDate.diff(checkinDate));
		const days = duration.asDays();
		console.log("Duration in days:", days); // Debugging

		const daysText = language === "Arabic" ? "أيام" : "days";
		const nightsText = language === "Arabic" ? "ليال" : "nights";
		return `${days} ${daysText} / ${days - 1} ${nightsText}`;
	}

	return (
		<Wrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			isArabic={chosenLanguage === "Arabic"}
		>
			{loading ? (
				<div className='text-center my-5'>
					<Spin size='large' />
					<p>Loading...</p>
				</div>
			) : (
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
						<Header>
							<Section>
								{/* Left side of the header */}
								<div className='row'>
									<div className='col-md-6'>
										<div>
											{chosenLanguage === "Arabic"
												? "المبلغ الإجمالي"
												: "Total Amount"}
										</div>
										<h4 className='mx-2'>
											{reservation ? total_amount_hotel_runner : 0}{" "}
											{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
										</h4>
									</div>
									{chosenLanguage === "Arabic" ? (
										<div className='col-md-6 mx-auto text-center'>
											<button className='my-2'>فاتورة رسمية</button>
											<button>كشف حساب</button>
										</div>
									) : (
										<div className='col-md-6 mx-auto text-center'>
											<button className='my-2'>Invoice</button>
											<button>Account Statement</button>
										</div>
									)}
								</div>
							</Section>
							<Section>
								{/* Right side of the header */}
								<div className='row'>
									<div className='col-md-9'>
										<h3>
											{reservation &&
												reservation.customer_details &&
												reservation.customer_details.name}
										</h3>
										<div className='row  my-2'>
											<button className='col-md-5'>Email</button>
											<button className='col-md-5'>SMS</button>
										</div>
									</div>

									<div
										className={
											reservation && reservation.confirmation_number.length <= 8
												? "col-md-3"
												: "col-md-8 mt-1"
										}
									>
										<div style={{ fontSize: "11px", fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "رقم التأكيد"
												: "Confirmation"}
										</div>
										<div className='mt-2 ml-2' style={{ fontWeight: "bold" }}>
											{reservation && reservation.confirmation_number}
										</div>
									</div>
								</div>
							</Section>
						</Header>
						<HorizontalLine />
						<Content>
							<ContentSection>
								<div
									className='row'
									style={{ maxHeight: "350px", overflow: "auto" }}
								>
									{singleReservationHotelRunner &&
									singleReservationHotelRunner.rooms &&
									singleReservationHotelRunner.rooms.length > 0
										? singleReservationHotelRunner.rooms.map(
												(room, roomIndex) =>
													room.daily_prices.map((dayPrice, priceIndex) => (
														<React.Fragment key={`${roomIndex}-${priceIndex}`}>
															<div className='col-md-4 mt-2'>
																{dayPrice.date}
															</div>
															<div
																className='col-md-4 mt-2'
																style={{ textTransform: "uppercase" }}
															>
																{room.name || "Room Type"}
															</div>
															<div className='col-md-4 mt-2'>
																{dayPrice.price}{" "}
																{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
															</div>
														</React.Fragment>
													))
										  )
										: reservation.pickedRoomsType.map((room, index) => (
												<React.Fragment key={index}>
													{/* You can add a date here if available */}
													<div className='col-md-4 mt-2'>{/* Date */}</div>
													<div className='col-md-4 mt-2'>{room.room_type}</div>
													<div className='col-md-4 mt-2'>
														{room.chosenPrice * room.count}{" "}
														{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
													</div>
												</React.Fragment>
										  ))}
									<div className='col-md-4 mt-2'></div>
									<div className='col-md-4 mt-2'></div>
									<div className='col-md-4 mt-2 text-center pb-3'>
										<div style={{ fontWeight: "bold", fontSize: "13px" }}>
											{chosenLanguage === "Arabic"
												? "المبلغ الإجمالي"
												: "Total Amount"}
										</div>
										<div style={{ fontWeight: "bold" }}>
											{/* Calculation of total amount */}
											{total_amount_hotel_runner}{" "}
											{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
										</div>
									</div>
								</div>
								<div className='mt-5'>
									<div className='row' style={{ fontWeight: "bold" }}>
										<div className='col-md-5 mx-auto text-center my-2'>
											{chosenLanguage === "Arabic"
												? "الضرائب والرسوم "
												: "Taxes & Extra Fees"}
										</div>
										<div className='col-md-5 mx-auto text-center my-2'>
											{singleReservationHotelRunner &&
											singleReservationHotelRunner.tax_total
												? singleReservationHotelRunner.tax_total
												: 0}{" "}
											{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
										</div>

										<div className='col-md-5 mx-auto text-center my-2'>
											{chosenLanguage === "Arabic" ? "عمولة" : "Commision"}
										</div>
										<div className='col-md-5 mx-auto text-center my-2'>
											{singleReservationHotelRunner &&
											singleReservationHotelRunner.total
												? singleReservationHotelRunner.total -
												  singleReservationHotelRunner.sub_total
												: reservation.total_amount}{" "}
											{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
										</div>
									</div>
								</div>

								<div className='my-5'>
									<div className='row my-auto'>
										<div className='col-md-5 mx-auto'>
											<h4>
												{chosenLanguage === "Arabic"
													? "حصة الفندق"
													: "Hotel Share"}
											</h4>
										</div>
										<div className='col-md-5 mx-auto'>
											<h2>
												{singleReservationHotelRunner &&
												singleReservationHotelRunner.total
													? singleReservationHotelRunner.total
													: total_amount_hotel_runner}{" "}
												{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
											</h2>
										</div>
									</div>
									<div className='my-3'>
										<div className='row'>
											<div className='col-md-5 mx-auto'>
												<h6>
													{chosenLanguage === "Arabic"
														? "معدل السعر اليومي"
														: "Daily Rate"}
												</h6>
											</div>

											<div className='col-md-5 mx-auto'>
												<h5>
													{getTotalAmountPerDay(reservation.pickedRoomsType)}{" "}
													{chosenLanguage === "Arabic" ? "ريال" : "SAR"}
												</h5>
											</div>
										</div>
									</div>
								</div>
							</ContentSection>
							<ContentSection>
								<div className='row mt-5' style={{ fontWeight: "bold" }}>
									<div className='col-md-4'>
										{chosenLanguage === "Arabic"
											? "مصدر الحجز"
											: "Booking Source"}
										<div
											className='mx-1'
											style={{ textTransform: "capitalize" }}
										>
											{singleReservationHotelRunner &&
											singleReservationHotelRunner.channel_display
												? singleReservationHotelRunner.channel_display
												: reservation.booking_source}
										</div>
									</div>

									<div className='col-md-4'>
										{chosenLanguage === "Arabic"
											? "تاريخ الحجز"
											: "Booking Date"}
										<div className='mx-1'>
											{
												singleReservationHotelRunner &&
												singleReservationHotelRunner.completed_at
													? new Intl.DateTimeFormat(
															chosenLanguage === "Arabic" ? "ar-EG" : "en-GB",
															{
																year: "numeric",
																month: "2-digit",
																day: "2-digit",
															}
													  ).format(
															new Date(
																singleReservationHotelRunner.completed_at
															)
													  )
													: reservation && reservation.booked_at
													  ? new Intl.DateTimeFormat(
																chosenLanguage === "Arabic" ? "ar-EG" : "en-GB",
																{
																	year: "numeric",
																	month: "2-digit",
																	day: "2-digit",
																}
													    ).format(new Date(reservation.booked_at))
													  : "N/A" // Fallback text or handling if date is not available
											}
										</div>
									</div>

									<div className='col-md-4'>
										{chosenLanguage === "Arabic"
											? "حالة الحجز"
											: "Reservation Status"}
										<div
											className='mx-1'
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
												textAlign: "center",
												textTransform: "uppercase",
											}}
										>
											{reservation && reservation.reservation_status}
										</div>
									</div>

									<div className='col-md-4 my-5 mx-auto'>
										{chosenLanguage === "Arabic"
											? "نوع الغرفة"
											: "Reserved Room Types"}
										<div className='mx-1'>
											{singleReservationHotelRunner &&
											singleReservationHotelRunner.rooms &&
											singleReservationHotelRunner.rooms.length > 0
												? singleReservationHotelRunner.rooms.map(
														(room, index) => <div key={index}>{room.name}</div>
												  )
												: reservation.pickedRoomsType.map((room, index) => (
														<div key={index}>{room.room_type}</div>
												  ))}
										</div>
									</div>

									<div className='col-md-4 my-5 mx-auto'>
										{chosenLanguage === "Arabic"
											? "عدد الزوار"
											: "Count Of Visitors"}
										<div className='mx-1'>
											{singleReservationHotelRunner &&
											singleReservationHotelRunner.rooms &&
											singleReservationHotelRunner.rooms.length > 0
												? singleReservationHotelRunner.rooms.reduce(
														(total, room) => total + room.total_guest,
														0
												  )
												: reservation.pickedRoomsType.length}
										</div>
									</div>

									<div className='col-md-8 my-4 mx-auto'>
										{chosenLanguage === "Arabic" ? "ملحوظة" : "Comment"}
										<div>
											{singleReservationHotelRunner &&
											singleReservationHotelRunner.note
												? singleReservationHotelRunner.note
												: reservation.booking_comment}
										</div>
									</div>
								</div>
							</ContentSection>
							<ContentSection>
								<div
									className='row'
									style={{ fontSize: "13px", fontWeight: "bold" }}
								>
									<div className='col-md-4'>
										{chosenLanguage === "Arabic" ? "الوصول" : "Arrival"}
										<div style={{ border: "1px solid black", padding: "3px" }}>
											{moment(reservation && reservation.checkin_date)
												.locale(chosenLanguage === "Arabic" ? "ar" : "en")
												.format("DD/MM/YYYY")}
										</div>
									</div>
									<div className='col-md-4'>
										{chosenLanguage === "Arabic"
											? "تاريخ المغادرة"
											: "Check-out"}
										<div style={{ border: "1px solid black", padding: "3px" }}>
											{moment(reservation && reservation.checkout_date)
												.locale(chosenLanguage === "Arabic" ? "ar" : "en")
												.format("DD/MM/YYYY")}
										</div>
									</div>
									<div className='col-md-4 my-auto'>
										{chosenLanguage === "Arabic"
											? "فترة الحجز"
											: "Reservation Period"}
										<div>
											{reservation
												? calculateReservationPeriod(
														reservation.checkin_date,
														reservation.checkout_date,
														chosenLanguage
												  )
												: ""}
										</div>
									</div>
								</div>

								<div
									className='row mt-5'
									style={{ fontSize: "13px", fontWeight: "bold" }}
								>
									<div className='col-md-5 mx-auto my-2'>
										{chosenLanguage === "Arabic" ? "الجنسية" : "Nationality"}
										<div className='mx-2'>
											{singleReservationHotelRunner &&
												singleReservationHotelRunner.address &&
												singleReservationHotelRunner.address.country}
										</div>
									</div>
									<div className='col-md-5 mx-auto my-2'>
										{chosenLanguage === "Arabic"
											? "رقم جواز السفر"
											: "Passport #"}
										<div className='mx-2'>
											{(reservation && reservation.customer_details.passport) ||
												"N/A"}
										</div>
									</div>
									<div className='col-md-5 mx-auto my-2'>
										{chosenLanguage === "Arabic" ? "الهاتف" : "Phone"}
										<div className='mx-2'>
											{reservation && reservation.customer_details.phone}
										</div>
									</div>
									<div className='col-md-5 mx-auto my-2'>
										{chosenLanguage === "Arabic" ? "البريد" : "Email"}
										<div className='mx-2'>
											{reservation && reservation.customer_details.email}
										</div>
									</div>
									<div className='col-md-5 mx-auto my-2'>
										{chosenLanguage === "Arabic" ? "العنوان" : "Address"}
										<div className='mx-2'>
											{singleReservationHotelRunner &&
												singleReservationHotelRunner.address.street}
											{singleReservationHotelRunner &&
												singleReservationHotelRunner.address.street_2 &&
												`, ${
													singleReservationHotelRunner &&
													singleReservationHotelRunner.address.street_2
												}`}
										</div>
									</div>
								</div>
							</ContentSection>
						</Content>
					</div>
				</div>
			)}
		</Wrapper>
	);
};

export default ReservationDetail;
