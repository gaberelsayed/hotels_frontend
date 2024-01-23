import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
// eslint-disable-next-line
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
	getReservationSearch,
	singlePreReservation,
	updateSingleReservation,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import { toast } from "react-toastify";
import ZReservationForm2 from "./ZReservationForm2";
import { Spin } from "antd";
import HotelRunnerReservationList from "./HotelRunnerReservationList";

// eslint-disable-next-line
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
	const [loading, setLoading] = useState(false);
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
	// eslint-disable-next-line
	const [clickedMenu, setClickedMenu] = useState("reserveARoom");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchClicked, setSearchClicked] = useState(false);
	const [searchedReservation, setSearchedReservation] = useState("");
	const [activeTab, setActiveTab] = useState("reserveARoom");

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
			setActiveTab("reserveARoom");
		} else if (window.location.search.includes("newReservation")) {
			setActiveTab("newReservation");
		} else if (window.location.search.includes("list")) {
			setActiveTab("list");
		} else {
			setActiveTab("reserveARoom");
		}
		// eslint-disable-next-line
	}, [activeTab]);

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
							getHotelReservations(data2[0]._id).then((data3) => {
								if (data3 && data3.error) {
									console.log(data3.error);
								} else {
									setAllReservations(data3 && data3.length > 0 ? data3 : []);
									console.log(data3, "data3");
								}
							});

							setHotelDetails(data2[0]);

							getHotelRooms(data2[0]._id).then((data3) => {
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
					if (hotelDetails && hotelDetails._id) {
						setLoading(true);
						singlePreReservation(
							searchQuery,
							hotelDetails._id,
							hotelDetails.belongsTo._id
						).then((data2) => {
							if (data2 && data2.error) {
								toast.error("No available value, please try again...");
							} else {
								if (
									data2 &&
									data2.reservations &&
									data2.reservations.length === 0
								) {
									toast.error("Incorrect Confirmation #, Please try again...");
									setLoading(false);
								} else {
									setCustomer_details(data2.customer_details);
									setStart_date(data2.checkin_date);
									setEnd_date(data2.checkout_date);
									setDays_of_residence(data2.days_of_residence);
									setPaymentStatus(data2.payment_status);
									setBookingComment(data2.booking_comment);
									setBookingSource(data2.booking_source);
									setConfirmationNumber(data2.confirmation_number);
									setPaymentStatus(data2.payment_status);
									setSearchedReservation(data2);

									setLoading(false);
								}
							}
						});
					}
				} else {
					setCustomer_details(data.customer_details);
					setStart_date(data.checkin_date);
					setEnd_date(data.checkout_date);
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

	const calculatePickedRoomsType = () => {
		const roomTypeCounts = new Map();

		pickedHotelRooms.forEach((roomId) => {
			const room = hotelRooms.find((room) => room._id === roomId);
			const pricing = pickedRoomPricing.find(
				(pricing) => pricing.roomId === roomId
			);

			if (room && pricing) {
				const existing = roomTypeCounts.get(room.room_type) || {
					count: 0,
					chosenPrice: 0,
				};
				roomTypeCounts.set(room.room_type, {
					room_type: room.room_type,
					chosenPrice: pricing.chosenPrice,
					count: existing.count + 1,
				});
			}
		});

		return Array.from(roomTypeCounts.values());
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

		const calculatedPickedRoomsType = calculatePickedRoomsType();

		const new_reservation = {
			customer_details: customer_details,
			checkin_date: start_date,
			checkout_date: end_date,
			days_of_residence: days_of_residence,
			payment_status: payment_status,
			total_amount: total_amount * days_of_residence,
			booking_source: booking_source,
			belongsTo: hotelDetails.belongsTo._id,
			hotelId: hotelDetails._id,
			roomId: pickedHotelRooms,
			booked_at: new Date(),
			sub_total: total_amount,
			pickedRoomsPricing: pickedRoomPricing,
			pickedRoomsType: calculatedPickedRoomsType,
			payment: payment_status,
			reservation_status: pickedHotelRooms.length > 0 ? "InHouse" : "Confirmed",
			total_rooms: pickedHotelRooms.length,
			total_guests: pickedHotelRooms.length,
			booking_comment: booking_comment,
		};

		if (
			searchQuery &&
			searchedReservation &&
			searchedReservation.confirmation_number
		) {
			updateSingleReservation(searchedReservation._id, {
				...new_reservation,
				inhouse_date: new Date(),
			}).then((data) => {
				if (data && data.error) {
					console.log(data.error);
				} else {
					console.log("successful check in");
					toast.success("Checkin Was Successfully Processed!");
					setTimeout(() => {
						window.location.reload(false);
					}, 2000);
				}
			});
		} else {
			createNewReservation(user._id, token, new_reservation).then((data) => {
				if (data && data.error) {
					console.log(data.error, "error create new reservation");
				} else {
					console.log("successful reservation");
					toast.success("Reservation Was Successfully Booked!");

					// if (searchedReservation && searchedReservation._id) {
					// 	console.log(searchedReservation._id, "searchedReservation");
					// 	updatingPreReservation(token, searchedReservation._id).then(
					// 		(data2) => {
					// 			if (data2 && data2.error) {
					// 				console.log(data2.error, "Updating Reservation");
					// 			} else {
					// 				console.log("Done");
					// 			}
					// 		}
					// 	);
					// }

					setTimeout(() => {
						window.location.reload(false);
					}, 2000);
				}
			});
		}
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

		const new_reservation = {
			customer_details: customer_details,
			checkin_date: start_date,
			checkout_date: end_date,
			days_of_residence: days_of_residence,
			payment_status: payment_status,
			total_amount: total_amount * days_of_residence,
			booking_source: booking_source,
			belongsTo: hotelDetails.belongsTo._id,
			hotelId: hotelDetails._id,
			booked_at: new Date(),
			sub_total: total_amount,
			pickedRoomsPricing: pickedRoomPricing,
			pickedRoomsType: pickedRoomsType,
			payment: payment_status,
			reservation_status: pickedHotelRooms.length > 0 ? "InHouse" : "Confirmed",
			total_rooms: pickedHotelRooms.length,
			total_guests: pickedHotelRooms.length,
			booking_comment: booking_comment,
		};

		createNewReservation(user._id, token, new_reservation).then((data) => {
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
			showList={window.location.search.includes("list")}
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
						{activeTab === "reserveARoom" ? (
							<>
								<div style={{ background: "#8a8a8a", padding: "1px" }}>
									<div className='my-2 tab-grid col-md-8'>
										<Tab
											isActive={activeTab === "reserveARoom"}
											onClick={() => {
												setActiveTab("reserveARoom");
											}}
										>
											<Link to='/hotel-management/new-reservation?reserveARoom'>
												{chosenLanguage === "Arabic"
													? "حجز الغرف"
													: "Reserve A Room"}
											</Link>
										</Tab>
										<Tab
											isActive={activeTab === "newReservation"}
											onClick={() => {
												setActiveTab("newReservation");
											}}
										>
											<Link to='/hotel-management/new-reservation?newReservation'>
												{chosenLanguage === "Arabic"
													? "حجز جديد (بدون غرف)"
													: "New Reservation"}
											</Link>
										</Tab>
										<Tab
											isActive={activeTab === "list"}
											onClick={() => {
												setActiveTab("list");
											}}
										>
											<Link to='/hotel-management/new-reservation?list'>
												{chosenLanguage === "Arabic"
													? "قائمة الحجوزات"
													: "Reservation List"}
											</Link>
										</Tab>
									</div>
								</div>

								{/* <div className='row text-center ml-5 my-3'>
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
								</div> */}
								{loading ? (
									<>
										<div className='text-center my-5'>
											<Spin size='large' />
											<p>Loading Reservations...</p>
										</div>
									</>
								) : (
									<>
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
											pickedRoomsType={pickedRoomsType}
											setPickedRoomsType={setPickedRoomsType}
										/>
									</>
								)}
							</>
						) : activeTab === "list" ? (
							<>
								<div style={{ background: "#8a8a8a", padding: "1px" }}>
									<div className='my-2 tab-grid col-md-8'>
										<Tab
											isActive={activeTab === "reserveARoom"}
											onClick={() => {
												setActiveTab("reserveARoom");
											}}
										>
											<Link to='/hotel-management/new-reservation?reserveARoom'>
												{chosenLanguage === "Arabic"
													? "حجز الغرف"
													: "Reserve A Room"}
											</Link>
										</Tab>
										<Tab
											isActive={activeTab === "newReservation"}
											onClick={() => {
												setActiveTab("newReservation");
											}}
										>
											<Link to='/hotel-management/new-reservation?newReservation'>
												{chosenLanguage === "Arabic"
													? "حجز جديد (بدون غرف)"
													: "New Reservation"}
											</Link>
										</Tab>
										<Tab
											isActive={activeTab === "list"}
											onClick={() => {
												setActiveTab("list");
											}}
										>
											<Link to='/hotel-management/new-reservation?list'>
												{chosenLanguage === "Arabic"
													? "قائمة الحجوزات"
													: "Reservation List"}
											</Link>
										</Tab>
									</div>
								</div>
								{hotelDetails && hotelDetails._id ? (
									<HotelRunnerReservationList
										hotelDetails={hotelDetails}
										chosenLanguage={chosenLanguage}
									/>
								) : null}
							</>
						) : (
							<>
								<div style={{ background: "#8a8a8a", padding: "1px" }}>
									<div className='my-2 tab-grid col-md-8'>
										<Tab
											isActive={activeTab === "reserveARoom"}
											onClick={() => {
												setActiveTab("reserveARoom");
											}}
										>
											<Link to='/hotel-management/new-reservation?reserveARoom'>
												{chosenLanguage === "Arabic"
													? "حجز الغرف"
													: "Reserve A Room"}
											</Link>
										</Tab>
										<Tab
											isActive={activeTab === "newReservation"}
											onClick={() => {
												setActiveTab("newReservation");
											}}
										>
											<Link to='/hotel-management/new-reservation?newReservation'>
												{chosenLanguage === "Arabic"
													? "حجز جديد (بدون غرف)"
													: "New Reservation"}
											</Link>
										</Tab>
										<Tab
											isActive={activeTab === "list"}
											onClick={() => {
												setActiveTab("list");
											}}
										>
											<Link to='/hotel-management/new-reservation?list'>
												{chosenLanguage === "Arabic"
													? "قائمة الحجوزات"
													: "Reservation List"}
											</Link>
										</Tab>
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
									hotelDetails={hotelDetails}
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
	min-height: 750px;
	/* background-color: #f0f0f0; */

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) =>
			props.show ? "5% 90%" : props.showList ? "13% 87%" : "13.5% 80%"};
	}

	.container-wrapper {
		/* border: 2px solid lightgrey; */
		padding: 20px;
		border-radius: 20px;
		/* background: white; */
		margin: 0px 10px;
	}

	.tab-grid {
		display: flex;
		/* Additional styling for grid layout */
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

const Tab = styled.div`
	cursor: pointer;
	margin: 0 3px; /* 3px margin between tabs */
	padding: 15px 5px; /* Adjust padding as needed */
	font-weight: ${(props) => (props.isActive ? "bold" : "bold")};
	background-color: ${(props) =>
		props.isActive
			? "transparent"
			: "#bbbbbb"}; /* Light grey for unselected tabs */
	box-shadow: ${(props) =>
		props.isActive ? "inset 5px 5px 5px rgba(0, 0, 0, 0.3)" : "none"};
	transition: all 0.3s ease; /* Smooth transition for changes */
	min-width: 25px; /* Minimum width of the tab */
	width: 100%; /* Full width within the container */
	text-align: center; /* Center the text inside the tab */
	/* Additional styling for tabs */
	z-index: 100;
	font-size: 1.2rem;

	a {
		color: ${(props) => (props.isActive ? "white" : "black")};
	}
`;
