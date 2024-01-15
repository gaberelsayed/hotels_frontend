import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import moment from "moment";
import ZReservationForm from "./ZReservationForm";
import {
	createNewReservation,
	getHotelDetails,
	getHotelRooms,
	hotelAccount,
	getHotelReservations,
	getListOfRoomSummary,
	createNewReservation2,
	getReservationSearch,
	updatingPreReservation,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import { toast } from "react-toastify";
import ZReservationForm2 from "./ZReservationForm2";

const isActive = (history, path) => {
	if (history === path) {
		return {
			background: "#0f377e",
			fontWeight: "bold",
			borderRadius: "5px",
			fontSize: "1.1rem",
			textAlign: "center",
			padding: "10px",
			color: "white",
			transition: "var(--mainTransition)",

			// textDecoration: "underline",
		};
	} else {
		return {
			backgroundColor: "grey",
			padding: "10px",
			borderRadius: "5px",
			fontSize: "1rem",
			fontWeight: "bold",
			textAlign: "center",
			cursor: "pointer",
			transition: "var(--mainTransition)",
			color: "white",
		};
	}
};

const NewReservationMain = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [hotelRooms, setHotelRooms] = useState("");
	const [hotelDetails, setHotelDetails] = useState("");
	const [roomsSummary, setRoomsSummary] = useState("");
	const [payment_status, setPaymentStatus] = useState("Not Paid");
	const [booking_comment, setBookingComment] = useState("");
	const [confirmation_number, setConfirmationNumber] = useState("");
	const [booking_source, setBookingSource] = useState("");
	const [pickedHotelRooms, setPickedHotelRooms] = useState([]);
	const [pickedRoomPricing, setPickedRoomPricing] = useState([]);
	const [allReservations, setAllReservations] = useState([]);
	const [values, setValues] = useState("");
	const [pickedRoomsType, setPickedRoomsType] = useState([]);
	const [total_amount, setTotal_Amount] = useState(0);
	const [clickedMenu, setClickedMenu] = useState("reserveARoom");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchClicked, setSearchClicked] = useState(false);
	const [searchedReservation, setSearchedReservation] = useState("");

	const [customer_details, setCustomer_details] = useState({
		name: "",
		phone: "",
		email: "",
		passport: "",
		passportExpiry: "",
		nationality: "",
	});

	const [start_date, setStart_date] = useState("");
	const [end_date, setEnd_date] = useState("");
	const [days_of_residence, setDays_of_residence] = useState(0);

	const { user, token } = isAuthenticated();

	const { languageToggle, chosenLanguage } = useCartContext();

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}

		if (window.location.search.includes("reserveARoom")) {
			setClickedMenu("reserveARoom");
		} else if (window.location.search.includes("newReservation")) {
			setClickedMenu("newReservation");
		} else {
			setClickedMenu("reserveARoom");
		}
		// eslint-disable-next-line
	}, []);

	const disabledDate = (current) => {
		// Can not select days before today and today
		return current < moment();
	};

	const gettingHotelData = () => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				setValues(data);

				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						if (data && data.name && data._id && data2 && data2.length > 0) {
							getHotelReservations(user._id).then((data3) => {
								if (data3 && data3.error) {
									console.log(data3.error);
								} else {
									setAllReservations(data3 && data3.length > 0 ? data3 : []);
								}
							});

							setHotelDetails(data2[0]);

							getHotelRooms(user._id).then((data3) => {
								if (data3 && data3.error) {
									console.log(data3.error);
								} else {
									setHotelRooms(data3);
								}
							});
						}
					}
				});
			}
		});
	};

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

	const gettingSearchQuery = () => {
		if (searchQuery && searchClicked) {
			getReservationSearch(searchQuery).then((data) => {
				if (data && data.error) {
					console.log(data.error, "Error rendering");
				} else {
					setCustomer_details(data.customer_details);
					setStart_date(data.start_date);
					setEnd_date(data.end_date);
					setDays_of_residence(data.days_of_residence);
					setPaymentStatus(data.payment_status);
					setBookingComment(data.booking_comment);
					setBookingSource(data.booking_source);
					setConfirmationNumber(data.confirmation_number);
					setPaymentStatus(data.payment_status);
					setSearchedReservation(data);
				}
			});
		} else {
			setSearchQuery("");
			setSearchClicked(false);
		}
	};

	const clickSubmit = () => {
		if (!customer_details.name) {
			return toast.error("Name is required");
		}
		if (!customer_details.phone) {
			return toast.error("Phone is required");
		}
		if (!customer_details.passport) {
			return toast.error("passport is required");
		}
		if (!customer_details.nationality) {
			return toast.error("nationality is required");
		}
		if (!start_date) {
			return toast.error("Check in Date is required");
		}

		if (!end_date) {
			return toast.error("Check out Date is required");
		}
		if (pickedHotelRooms && pickedHotelRooms.length <= 0) {
			return toast.error("Please Pick Up Rooms To Reserve");
		}

		if (!booking_source) {
			return toast.error("Booking Source is required");
		}

		const new_reservation = {
			customer_details: customer_details,
			start_date: start_date,
			end_date: end_date,
			days_of_residence: days_of_residence,
			payment_status: payment_status,
			total_amount: total_amount * days_of_residence,
			booking_source: booking_source,
			belongsTo: hotelDetails.belongsTo._id,
			hotelId: hotelDetails._id,
			roomId: pickedHotelRooms,
			pickedRoomsPricing: pickedRoomPricing,
			confirmation_number: confirmation_number
				? confirmation_number
				: Math.floor(Math.random() * 1e12)
						.toString()
						.padStart(12, "0"),
			booking_comment: booking_comment,
		};

		createNewReservation(user._id, token, new_reservation).then((data) => {
			if (data && data.error) {
				console.log(data.error, "error create new reservation");
			} else {
				console.log("successful reservation");
				toast.success("Reservation Was Successfully Booked!");

				if (searchedReservation && searchedReservation._id) {
					console.log(searchedReservation._id, "searchedReservation");
					updatingPreReservation(token, searchedReservation._id).then(
						(data2) => {
							if (data2 && data2.error) {
								console.log(data2.error, "Updating Reservation");
							} else {
								console.log("Done");
							}
						}
					);
				}

				setTimeout(() => {
					window.location.reload(false);
				}, 2000);
			}
		});
	};

	useEffect(() => {
		gettingHotelData();

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		gettingOverallRoomsSummary();
		// eslint-disable-next-line
	}, [start_date, end_date]);

	useEffect(() => {
		gettingSearchQuery();
		// eslint-disable-next-line
	}, [searchClicked]);

	const clickSubmit2 = () => {
		if (!customer_details.name) {
			return toast.error("Name is required");
		}
		if (!customer_details.phone) {
			return toast.error("Phone is required");
		}
		if (!customer_details.passport) {
			return toast.error("passport is required");
		}
		if (!customer_details.nationality) {
			return toast.error("nationality is required");
		}
		if (!start_date) {
			return toast.error("Check in Date is required");
		}

		if (!end_date) {
			return toast.error("Check out Date is required");
		}
		if (pickedRoomsType && pickedRoomsType.length <= 0) {
			return toast.error("Please Pick Up Rooms To Reserve");
		}

		if (!booking_source) {
			return toast.error("Booking Source is required");
		}

		const calculateTotalAmountPerDay = () => {
			return pickedRoomsType.reduce((total, room) => {
				return total + room.count * room.chosenPrice;
			}, 0);
		};

		const new_reservation = {
			customer_details: customer_details,
			start_date: start_date,
			end_date: end_date,
			days_of_residence: days_of_residence,
			payment_status: payment_status,
			total_amount: calculateTotalAmountPerDay() * Number(days_of_residence),
			booking_source: booking_source,
			belongsTo: hotelDetails.belongsTo._id,
			hotelId: hotelDetails._id,
			pickedRoomsType: pickedRoomsType,
			confirmation_number: confirmation_number
				? confirmation_number
				: Math.floor(Math.random() * 1e12)
						.toString()
						.padStart(12, "0"),
			booking_comment: booking_comment,
		};

		createNewReservation2(user._id, token, new_reservation).then((data) => {
			if (data && data.error) {
				console.log(data.error, "error create new reservation");
			} else {
				console.log("successful reservation");
				toast.success("Reservation Was Successfully Booked!");
				setTimeout(() => {
					window.location.reload(false);
				}, 2000);
			}
		});
	};

	return (
		<NewReservationMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='NewReservation'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='NewReservation'
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
						<h3>
							{" "}
							{chosenLanguage === "Arabic"
								? "حجز جديد:"
								: "New Reservation:"}{" "}
						</h3>
						{clickedMenu === "reserveARoom" ? (
							<>
								<div className='row text-center ml-5 my-5'>
									<div
										style={isActive(clickedMenu, "reserveARoom")}
										className='col-md-6 col-6  menuItems'
										onClick={() => setClickedMenu("reserveARoom")}
									>
										<Link
											className='dashboardLinks p-0'
											style={isActive(clickedMenu, "reserveARoom")}
											to='/hotel-management/new-reservation?reserveARoom'
										>
											<i className='fa-brands fa-servicestack mx-1'></i>
											Reservation WITH a ROOM
										</Link>
									</div>
									<div
										style={isActive(clickedMenu, "newReservation")}
										className='col-md-6 col-6  menuItems'
										onClick={() => setClickedMenu("newReservation")}
									>
										<Link
											className='dashboardLinks p-0'
											style={isActive(clickedMenu, "newReservation")}
											to='/hotel-management/new-reservation?newReservation'
										>
											<i className='fa-brands fa-servicestack mx-1'></i>
											New Reservation WITH NO ROOM
										</Link>
									</div>
								</div>
								<ZReservationForm
									customer_details={customer_details}
									setCustomer_details={setCustomer_details}
									start_date={start_date}
									setStart_date={setStart_date}
									end_date={end_date}
									setEnd_date={setEnd_date}
									disabledDate={disabledDate}
									days_of_residence={days_of_residence}
									setDays_of_residence={setDays_of_residence}
									chosenLanguage={chosenLanguage}
									hotelDetails={hotelDetails}
									hotelRooms={hotelRooms}
									values={values}
									clickSubmit={clickSubmit}
									pickedHotelRooms={pickedHotelRooms}
									setPickedHotelRooms={setPickedHotelRooms}
									payment_status={payment_status}
									setPaymentStatus={setPaymentStatus}
									total_amount={total_amount}
									setTotal_Amount={setTotal_Amount}
									setPickedRoomPricing={setPickedRoomPricing}
									pickedRoomPricing={pickedRoomPricing}
									allReservations={allReservations}
									setBookingComment={setBookingComment}
									booking_comment={booking_comment}
									setBookingSource={setBookingSource}
									booking_source={booking_source}
									setConfirmationNumber={setConfirmationNumber}
									confirmation_number={confirmation_number}
									searchQuery={searchQuery}
									setSearchQuery={setSearchQuery}
									searchClicked={searchClicked}
									setSearchClicked={setSearchClicked}
									searchedReservation={searchedReservation}
								/>
							</>
						) : (
							<>
								<div className='row text-center ml-5 my-5'>
									<div
										style={isActive(clickedMenu, "reserveARoom")}
										className='col-md-6 col-6  menuItems'
										onClick={() => setClickedMenu("reserveARoom")}
									>
										<Link
											className='dashboardLinks p-0'
											style={isActive(clickedMenu, "reserveARoom")}
											to='/hotel-management/new-reservation?reserveARoom'
										>
											<i className='fa-brands fa-servicestack mx-1'></i>
											Reservation WITH a ROOM
										</Link>
									</div>
									<div
										style={isActive(clickedMenu, "newReservation")}
										className='col-md-6 col-6  menuItems'
										onClick={() => setClickedMenu("newReservation")}
									>
										<Link
											className='dashboardLinks p-0'
											style={isActive(clickedMenu, "newReservation")}
											to='/hotel-management/new-reservation?newReservation'
										>
											<i className='fa-brands fa-servicestack mx-1'></i>
											New Reservation WITH NO ROOM
										</Link>
									</div>
								</div>
								<ZReservationForm2
									customer_details={customer_details}
									setCustomer_details={setCustomer_details}
									start_date={start_date}
									setStart_date={setStart_date}
									end_date={end_date}
									setEnd_date={setEnd_date}
									disabledDate={disabledDate}
									days_of_residence={days_of_residence}
									setDays_of_residence={setDays_of_residence}
									chosenLanguage={chosenLanguage}
									clickSubmit2={clickSubmit2}
									payment_status={payment_status}
									setPaymentStatus={setPaymentStatus}
									total_amount={total_amount}
									setTotal_Amount={setTotal_Amount}
									setPickedRoomPricing={setPickedRoomPricing}
									pickedRoomPricing={pickedRoomPricing}
									allReservations={allReservations}
									setBookingComment={setBookingComment}
									booking_comment={booking_comment}
									setBookingSource={setBookingSource}
									booking_source={booking_source}
									setConfirmationNumber={setConfirmationNumber}
									confirmation_number={confirmation_number}
									clickedMenu={clickedMenu}
									roomsSummary={roomsSummary}
									pickedRoomsType={pickedRoomsType}
									setPickedRoomsType={setPickedRoomsType}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</NewReservationMainWrapper>
	);
};

export default NewReservationMain;

const NewReservationMainWrapper = styled.div`
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
	}

	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
