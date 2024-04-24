import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useCartContext } from "../../../cart_context";
import {
	currecyConversion,
	singlePreReservationById,
	processPayment_Square,
	// eslint-disable-next-line
	processPayment_Stripe,
	// eslint-disable-next-line
	gettingCreatePaymentIntent,
} from "../apiAdmin";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";
import { Modal, Input, Button, Radio } from "antd";
import { EditOutlined } from "@ant-design/icons";

// eslint-disable-next-line
import SquarePaymentForm from "./SquarePaymentForm";

// eslint-disable-next-line
import StripePaymentForm from "./StripePaymentForm";

// eslint-disable-next-line
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// eslint-disable-next-line
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);

const ClientPayVirtualCard = () => {
	const [reservation, setReservation] = useState("");

	const [currency, setCurrency] = useState("");
	const [currency2, setCurrency2] = useState("SAR");
	// eslint-disable-next-line
	const [paymentStatus, setPaymentStatus] = useState(false);
	const [data, setData] = useState({
		loading: true,
		success: false,
		clientToken: null,
		error: "",
		instance: {},
	});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editedSubTotal, setEditedSubTotal] = useState("");

	// eslint-disable-next-line
	const [clientSecret, setClientSecret] = useState("");

	// Use useParams hook to get the route parameters
	const params = useParams();
	// eslint-disable-next-line
	const { chosenLanguage } = useCartContext();
	// Destructure the parameters for easier access
	const { reservationId } = params;

	// eslint-disable-next-line
	const { token } = isAuthenticated();

	const gettingSingleReservation = () => {
		setData({ ...data, loading: true });

		singlePreReservationById(reservationId).then((reservationData) => {
			if (reservationData && reservationData.error) {
				console.log(reservationData.error, "getting single reservation");
				toast.error("Error fetching reservation.");
				setData({ ...data, loading: false });
			} else {
				setReservation(reservationData);
				currecyConversion(
					Number(Number(reservationData.sub_total)).toFixed(2)
				).then((convertedData) => {
					if (convertedData && convertedData.error) {
						console.log("Error converting money");
						toast.error("Error converting currency.");
						setData({ ...data, loading: false });
					} else {
						setCurrency(convertedData);
						setData({ ...data, loading: false });

						// if (
						// 	convertedData.amountInUSD &&
						// 	!clientSecret &&
						// 	reservationData &&
						// 	reservationData._id &&
						// 	(!reservationData.payment_details ||
						// 		reservationData.payment_details.status !== "succeeded")
						// ) {
						// 	// Assuming currency2 is the target currency
						// 	const amountToSend =
						// 		parseFloat(convertedData.amountInUSD).toFixed(2) * 100; // Stripe requires amount in cents
						// 	const metadata = {
						// 		confirmation_number: reservationData.confirmation_number,
						// 		guest_name: reservationData.customer_details.name,
						// 		guest_country: reservationData.customer_details.nationality,
						// 		checkin_date: reservationData.checkin_date,
						// 		checkout_date: reservationData.checkin_date,
						// 		hotel_name: reservationData.hotelId.hotelName,
						// 		booking_source: reservationData.booking_source,
						// 	};

						// 	gettingCreatePaymentIntent(amountToSend, metadata)
						// 		.then((paymentIntentData) => {
						// 			console.log(paymentIntentData, "paymentIntentData");
						// 			if (paymentIntentData) {
						// 				setClientSecret(paymentIntentData);
						// 			} else {
						// 				console.error("Failed to create payment intent.");
						// 				toast.error("Payment processing setup failed.");
						// 			}
						// 		})
						// 		.catch((error) => {
						// 			console.error("Error creating payment intent:", error);
						// 			toast.error("Payment intent creation failed.");
						// 		});
						// }
					}
				});
			}
		});
	};

	useEffect(() => {
		gettingSingleReservation();
		// eslint-disable-next-line
	}, [paymentStatus]);

	console.log(currency, "cu");

	const showModal = () => {
		setIsModalVisible(true);
		setEditedSubTotal(reservation.sub_total);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		setReservation({ ...reservation, sub_total: editedSubTotal });
		currecyConversion(Number(Number(editedSubTotal)).toFixed(2)).then(
			(data2) => {
				if (data2 && data2.error) {
					console.log("Error converting money");
				} else {
					setCurrency(data2);
				}
			}
		);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleChange = (e) => {
		setEditedSubTotal(e.target.value);
	};

	// eslint-disable-next-line
	const options = {
		clientSecret: clientSecret,
	};

	return (
		<ClientPayVirtualCardWrapper className='container my-4'>
			{reservation && reservation._id && reservation.sub_total ? (
				<>
					<h2>
						Checkout Details For{" "}
						{reservation &&
							reservation.hotelId &&
							reservation.hotelId.hotelName.toUpperCase()}
					</h2>
					<h3>
						Confirmation Number:{" "}
						{reservation && reservation.confirmation_number}
					</h3>
					<div className='grid-container mt-3'>
						<div>
							<strong>Guest Name:</strong>{" "}
							{reservation && reservation.customer_details.name}
						</div>
						<div>
							<strong>Guest Phone:</strong>{" "}
							{reservation && reservation.customer_details.phone}
						</div>
						<div>
							<strong>Hotel Name:</strong>{" "}
							{reservation &&
								reservation.hotelId &&
								reservation.hotelId.hotelName}
						</div>

						<div>
							<strong>Booking Date:</strong>{" "}
							{reservation && new Date(reservation.booked_at).toDateString()}
						</div>
						<div>
							<strong>Check-in Date:</strong>{" "}
							{reservation && new Date(reservation.checkin_date).toDateString()}
						</div>
						<div>
							<strong>Check-out Date:</strong>{" "}
							{reservation &&
								new Date(reservation.checkout_date).toDateString()}
						</div>
						<div>
							<strong>Room Type:</strong>{" "}
							{reservation &&
								reservation.pickedRoomsType &&
								reservation.pickedRoomsType.map((i) => i.room_type + ",")}
						</div>
						<div>
							<strong>Nights of Residence:</strong>{" "}
							{reservation && reservation.days_of_residence} Nights
						</div>
						<div>
							<strong>Total Guests:</strong>{" "}
							{reservation && reservation.total_guests}
						</div>

						<div className='currency-selection'>
							<label>Choose A Currency:</label>
							<Radio.Group
								value={currency2}
								onChange={(e) => setCurrency2(e.target.value)}
								style={{ marginLeft: "10px" }}
							>
								<Radio value='USD'>USD</Radio>
								<Radio value='SAR'>SAR</Radio>
							</Radio.Group>
						</div>
						<div className='total-amount'>
							<strong>Reservation Total Amount:</strong>{" "}
							{reservation && currency2 === "USD"
								? parseFloat(currency.amountInUSD).toFixed(2)
								: parseFloat(reservation.sub_total).toFixed(2)}{" "}
							{currency2}
						</div>
						<div className='total-amount'>
							<strong>Transaction Fee & Taxes (2%):</strong> 0 {currency2}
						</div>
						<div
							className='total-amount'
							style={{ color: "darkgreen", fontWeight: "bold", width: "100%" }}
						>
							<strong>Your Payment Total Amount:</strong>{" "}
							{reservation && currency2 === "USD"
								? parseFloat(currency.amountInUSD).toFixed(2)
								: parseFloat(reservation.sub_total).toFixed(2)}{" "}
							{currency2}
							<Button
								type='link'
								onClick={showModal}
								icon={<EditOutlined />}
								style={{ marginLeft: "10px" }}
							/>
						</div>
						<Modal
							title='Edit The Amount'
							open={isModalVisible}
							onOk={handleOk}
							onCancel={handleCancel}
						>
							<Input
								value={editedSubTotal}
								onChange={handleChange}
								prefix={currency2}
								type='number'
							/>
						</Modal>
					</div>

					{paymentStatus ||
					(reservation &&
						reservation.payment_details &&
						reservation.payment_details.transactionId &&
						(reservation.payment_details.status === "succeeded" ||
							reservation.payment_details.status === "COMPLETED" ||
							reservation.payment_details.status ===
								"submitted_for_settlement")) ? (
						<div className='my-4'>
							<h2 style={{ fontSize: "1.6rem" }}>Thank you for your payment</h2>
							<h4 style={{ fontSize: "1.3rem" }}>
								You should receive a confirmation email of your payment shortly
							</h4>
							<h4
								style={{
									fontSize: "1.6rem",
									color: "goldenrod",
									fontWeight: "bold",
								}}
							>
								Looking Forward to seeing you on{" "}
								{new Date(reservation.checkin_date).toDateString()}!
							</h4>
						</div>
					) : (
						<div className='my-5'>
							{reservation &&
							reservation.payment_details &&
							reservation.payment_details.status !== "succeeded" ? (
								<div
									className='my-3'
									style={{ fontWeight: "bolder", color: "darkred" }}
								>
									This payment was paid before but was Unsuccessful.
									<br />
									Please Try Again...
								</div>
							) : null}

							{/* {clientSecret && reservation && reservation._id ? (
								<Elements stripe={stripePromise} options={options}>
									<StripePaymentForm
										processPayment={processPayment_Stripe}
										reservationId={reservation._id}
										amount={parseFloat(currency.amountInUSD).toFixed(2)}
										currency={"USD"}
										reservation={reservation}
										amountInSar={currency.amountInSAR}
										setPaymentStatus={setPaymentStatus}
										clientSecret={clientSecret}
									/>
								</Elements>
							) : null} */}

							<SquarePaymentForm
								processPayment={processPayment_Square}
								reservationId={reservation._id}
								// amount={
								// 	currency2 === "USD"
								// 		? parseFloat(currency.amountInUSD).toFixed(2)
								// 		: parseFloat(reservation.sub_total).toFixed(2)
								// }
								amount={parseFloat(currency.amountInUSD).toFixed(2)}
								currency={"USD"}
								reservation={reservation}
								amountInSar={currency.amountInSAR}
								setPaymentStatus={setPaymentStatus}
							/>
						</div>
					)}
				</>
			) : null}
		</ClientPayVirtualCardWrapper>
	);
};

export default ClientPayVirtualCard;

const ClientPayVirtualCardWrapper = styled.div`
	min-height: 780px;

	h2 {
		font-weight: bold;
		font-size: 1.4rem;
		text-transform: capitalize;
		text-align: center;
	}

	h3 {
		font-weight: bold;
		font-size: 1.2rem;
		text-transform: capitalize;
		color: darkred;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr); /* Aligns 3 items per row */
		grid-gap: 20px; /* Adjusts the gap between grid items */
		max-width: 100%;
	}

	.grid-container > div {
		max-width: 400px; /* Ensures each item does not exceed 75px width */
		word-wrap: break-word; /* Ensures text wraps within the confined width */
		border: 2px solid lightgray;
		padding: 10px;
		text-transform: capitalize;
	}

	.total-amount {
		grid-column: 1 / -1; /* Makes the total amount take up the full width */
		text-align: center;
		margin: auto;
		min-width: 650px !important; /* Ensures each item does not exceed 75px width */
		font-size: 1.5rem;
	}

	.currency-selection {
		margin: auto;
		width: 100%;
		label {
			font-weight: bold;
		}
	}

	@media (max-width: 700px) {
		.grid-container {
			display: grid;
			grid-template-columns: repeat(2, 1fr); /* Aligns 3 items per row */
			grid-gap: 20px; /* Adjusts the gap between grid items */
			max-width: 100%;
		}
	}
`;
