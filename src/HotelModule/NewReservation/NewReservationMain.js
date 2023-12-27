import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import moment from "moment";
import ZReservationForm from "./ZReservationForm";
import {
	createNewReservation,
	getHotelDetails,
	getHotelRooms,
	hotelAccount,
	getHotelReservations,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import { toast } from "react-toastify";

const NewReservationMain = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [hotelRooms, setHotelRooms] = useState("");
	const [hotelDetails, setHotelDetails] = useState("");
	const [payment_status, setPaymentStatus] = useState("Not Paid");
	const [pickedHotelRooms, setPickedHotelRooms] = useState([]);
	const [pickedRoomPricing, setPickedRoomPricing] = useState([]);
	const [allReservations, setAllReservations] = useState([]);
	const [values, setValues] = useState("");
	const [total_amount, setTotal_Amount] = useState(0);

	const [customer_details, setCustomer_details] = useState({
		name: "",
		phone: "",
		email: "",
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

	const clickSubmit = () => {
		if (!customer_details.name) {
			return toast.error("Name is required");
		}
		if (!customer_details.phone) {
			return toast.error("Phone is required");
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

		const new_reservation = {
			customer_details: customer_details,
			start_date: start_date,
			end_date: end_date,
			days_of_residence: days_of_residence,
			payment_status: payment_status,
			total_amount: total_amount * days_of_residence,
			booking_source: "From Hotel",
			belongsTo: hotelDetails.belongsTo._id,
			hotelId: hotelDetails._id,
			roomId: pickedHotelRooms,
			pickedRoomsPricing: pickedRoomPricing,
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

	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, []);

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
						/>
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
