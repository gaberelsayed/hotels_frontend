import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useCartContext } from "../../../cart_context";
import {
	gettingCreatePaymentIntent,
	currecyConversion,
	// getBraintreeClientToken,
	// processPayment,
	processPayment_Stripe,
	singlePreReservationById,
	createStripeCheckoutSession,
} from "../apiAdmin";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";
import { Modal, Input, Button, Radio } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";

const ClientPayVirtualCard = () => {
	const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
	const [reservation, setReservation] = useState("");
	// eslint-disable-next-line
	const [clientSecret, setClientSecret] = useState("");
	const [currency, setCurrency] = useState("");
	const [currency2, setCurrency2] = useState("SAR");
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
						// Now that you have all needed details, initiate payment intent creation
						// initiatePayment(convertedData.amountInUSD); // Make sure to pass the correct amount you want to charge
					}
				});
			}
		});
	};

	// const initiatePayment = async (amount) => {
	// 	const amountInCents = Math.round(amount * 100); // Convert the amount to the smallest currency unit
	// 	try {
	// 		const secret = await gettingCreatePaymentIntent(amountInCents);
	// 		setClientSecret(secret); // Save the client secret to state
	// 	} catch (error) {
	// 		console.error("Error creating payment intent:", error);
	// 		toast.error("Could not initiate payment process. Please try again.");
	// 	}
	// };

	useEffect(() => {
		gettingSingleReservation();
		// eslint-disable-next-line
	}, [paymentStatus]);

	console.log(currency, "cu");

	const buy_stripe = async (paymentMethodId) => {
		const formattedSubTotal =
			parseFloat(currency.amountInUSD).toFixed(2) - 0.03;

		if (isNaN(formattedSubTotal)) {
			throw new Error("Invalid amount format.");
		}

		const paymentData = {
			paymentMethodId: paymentMethodId,
			amount: formattedSubTotal,
			amountInSAR: currency.amountInSAR,
			email: reservation?.customer_details.email,
			name: reservation?.customer_details.name,
			passport: reservation?.customer_details.passport,
			nationality: reservation?.customer_details.nationality,
			phone: reservation?.customer_details.phone,
			confirmation_number: reservation?.confirmation_number,
			customerId: reservation?._id,
			reservationId: reservation?._id,
			planId: "One Time Payment",
			country: reservation?.customer_details.nationality,
			hotelName: reservation?.hotelId.hotelName,
			checkin_date: reservation?.checkin_date,
			checkout_date: reservation?.checkout_date,
			reservation_status: reservation?.reservation_status,
			chosenCurrency: "USD",
		};

		try {
			const response = await processPayment_Stripe(
				reservation._id,
				paymentData
			);
			if (
				response.message ===
				"Payment processed and reservation updated successfully."
			) {
				if (
					response?.updatedReservation?.payment_details?.status === "succeeded"
				) {
					toast.success(
						"Payment processed and reservation updated successfully."
					);
					setPaymentStatus(true); // Update state to reflect payment status
				} else {
					toast.info(
						`Payment is incomplete. Please contact ${
							reservation && reservation.booking_source
						} to get a new card.`
					);
				}
			} else {
				toast.error(
					"Not Paid, Maybe insufficient credit, Please try another card"
				);
			}
		} catch (error) {
			console.error("Payment processing error: ", error);
			toast.error(
				"An error occurred during payment processing. Please try again."
			);
		}
	};

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
	const redirectToStripeCheckout = async () => {
		try {
			const formattedSubTotal =
				parseFloat(currency.amountInUSD).toFixed(2) - 0.03;

			if (isNaN(formattedSubTotal)) {
				throw new Error("Invalid amount format.");
			}

			const checkoutData = {
				amount: formattedSubTotal,
				reservationId: reservation._id,
				hotelName: reservation?.hotelId.hotelName,
				amountInSAR: currency.amountInSAR,
				chosenCurrency: "USD",
				confirmation_number: reservation?.confirmation_number,
				name: reservation?.customer_details.name,
				phone: reservation?.customer_details.phone,
				email: reservation?.customer_details.email,
				nationality: reservation?.customer_details.nationality,
				checkin_date: reservation?.checkin_date,
				checkout_date: reservation?.checkout_date,
				reservation_status: reservation?.reservation_status,
				// Add any other data you want to include
			};

			const checkoutUrl = await createStripeCheckoutSession(checkoutData);
			window.location.href = checkoutUrl;
		} catch (error) {
			console.error("Error redirecting to Stripe Checkout:", error);
			toast.error("Could not redirect to Stripe Checkout. Please try again.");
		}
	};

	// Render the component with the data

	return (
		<ClientPayVirtualCardWrapper className='container my-4'>
			<h2>
				Checkout Details For{" "}
				{reservation &&
					reservation.hotelId &&
					reservation.hotelId.hotelName.toUpperCase()}
			</h2>
			<h3>
				Confirmation Number: {reservation && reservation.confirmation_number}
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
					{reservation && reservation.hotelId && reservation.hotelId.hotelName}
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
					{reservation && new Date(reservation.checkout_date).toDateString()}
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
						? parseFloat(currency.amountInUSD).toFixed(2) - 0.03
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
						? parseFloat(currency.amountInUSD).toFixed(2) - 0.03
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
					<Elements stripe={stripePromise}>
						<StripePaymentForm
							buy={buy_stripe}
							clientSecret={clientSecret}
							reservation={reservation}
						/>
					</Elements>

					{/* <div className='my-5'>
						<Button onClick={redirectToStripeCheckout}>Pay with Stripe</Button>
					</div> */}
				</div>
			)}
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
