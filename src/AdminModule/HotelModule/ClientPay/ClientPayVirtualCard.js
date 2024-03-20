import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useCartContext } from "../../../cart_context";
import {
	currecyConversion,
	getBraintreeClientToken,
	// processPayment,
	processPayment_SAR,
	singlePreReservationById,
} from "../apiAdmin";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";
import PaymentForm from "./PaymentForm";
import { Modal, Input, Button, Radio } from "antd";
import { EditOutlined } from "@ant-design/icons";

const ClientPayVirtualCard = () => {
	const [reservation, setReservation] = useState("");
	const [currency, setCurrency] = useState("");
	const [currency2, setCurrency2] = useState("USD");
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

	const { token } = isAuthenticated();

	const gettingSingleReservation = () => {
		setData({ ...data, loading: true });

		singlePreReservationById(reservationId).then((data) => {
			if (data && data.error) {
				console.log(data.error, "getting single reservation");
			} else {
				setReservation(data);
				console.log(Number(Number(data.sub_total)).toFixed(2), "The currency");
				currecyConversion(Number(Number(data.sub_total)).toFixed(2)).then(
					(data2) => {
						if (data2 && data2.error) {
							console.log("Error converting money");
						} else {
							setCurrency(data2);

							getBraintreeClientToken(token).then((data3) => {
								if (data3.error) {
									setData({ ...data3, error: data3.error });
								} else {
									setData({ ...data3, clientToken: data3.clientToken });
									setData({ ...data3, loading: false });
								}
							});
						}
					}
				);
			}
		});
	};

	useEffect(() => {
		gettingSingleReservation();
		// eslint-disable-next-line
	}, [paymentStatus]);

	console.log(currency, "cu");

	const buy = () => {
		data.instance
			.requestPaymentMethod()
			.then((data) => {
				const nonce = data.nonce;
				// Ensure the sub_total is a number and format it to two decimal places
				const formattedSubTotal = parseFloat(reservation.sub_total).toFixed(2);
				if (isNaN(formattedSubTotal)) {
					throw new Error("Invalid amount format.");
				}

				const paymentData = {
					paymentMethodNonce: nonce,
					amount: formattedSubTotal,
					amountInSAR: currency.amountInSAR,
					email: reservation?.customer_details.email,
					customerId: reservation?._id,
					planId: "One Time Payment",
					country: reservation?.customer_details.nationality,
					hotelName: reservation?.hotelId.hotelName,
					chosenCurrency: currency2,
				};

				return processPayment_SAR(reservation._id, paymentData);
			})
			.then((response) => {
				// Directly check for a successful transaction indicator from your backend response
				setTimeout(() => {
					window.location.reload(false);
				}, 1500);
				if (
					response.message ===
					"Payment processed and reservation updated successfully."
				) {
					toast.success(
						"Payment processed and reservation updated successfully."
					);
					setPaymentStatus(true); // Update state to reflect payment status
				} else {
					// If response does not indicate success, handle as a failed payment
					toast.error(
						"Not Paid, Maybe insufficient credit, Please try another card"
					);
				}
			})
			.catch((error) => {
				// Handle errors from both requestPaymentMethod and processPayment
				console.error("Payment processing error: ", error);
				setData({ loading: false, error: error.message });
				toast.error(
					"An error occurred during payment processing. Please try again."
				);
			});
	};

	// eslint-disable-next-line
	const buy2 = () => {
		let vendorShare; // Define vendorShare outside the promise chain

		data.instance
			.requestPaymentMethod()
			.then((data) => {
				const nonce = data.nonce;
				const totalAmount = parseFloat(reservation.sub_total).toFixed(2);
				if (isNaN(totalAmount)) {
					throw new Error("Invalid amount format.");
				}

				const yourCommission = (totalAmount * 0.03).toFixed(2);
				vendorShare = (totalAmount * 0.97).toFixed(2); // Assign value to vendorShare

				const paymentData = {
					paymentMethodNonce: nonce,
					amount: yourCommission, // Only process your commission through Braintree
					amountInSAR: currency.amountInSAR, // Adjust if necessary for currency conversion
					email: reservation?.customer_details.email,
					customerId: reservation?._id,
					planId: "One Time Payment",
					country: reservation?.customer_details.nationality,
					hotelName: reservation?.hotelId.hotelName,
					chosenCurrency: currency2,
				};

				return processPayment_SAR(reservation._id, paymentData);
			})
			.then((response) => {
				if (
					response.message ===
					"Payment processed and reservation updated successfully."
				) {
					toast.success("2% were sent to Janat Successfully");
					setPaymentStatus(true); // Update state to reflect payment status

					// Here, you can trigger the PayPal payouts route with the vendor's share
					const payoutData = {
						payoutEmail: reservation.belongsTo.email, // Assuming you have the vendor's email
						payoutAmount: vendorShare, // Send the vendor's share via PayPal
					};

					return initiatePayPalPayout(payoutData); // Function to call your PayPal payouts route
				} else {
					toast.error(
						"Not Paid, Maybe insufficient credit, Please try another card"
					);
				}
			})
			.then((payoutResponse) => {
				// Handle the response from your PayPal payouts route
				console.log(payoutResponse);
				toast.success(
					`98% were sent to ${reservation.hotelId.hotelName} Successfully`
				);
			})
			.catch((error) => {
				console.error("Payment processing error: ", error);
				setData({ loading: false, error: error.message });
				toast.error(
					"An error occurred during payment processing. Please try again."
				);
			});
	};

	// Function to initiate PayPal payout
	const initiatePayPalPayout = (payoutData) => {
		return fetch(`${process.env.REACT_APP_API_URL}/create-a-vendor-paypal`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payoutData),
		})
			.then((response) => {
				return response.json();
			})
			.catch((err) => console.log(err));
	};

	const showModal = () => {
		setIsModalVisible(true);
		setEditedSubTotal(reservation.sub_total);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		setReservation({ ...reservation, sub_total: editedSubTotal });
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleChange = (e) => {
		setEditedSubTotal(e.target.value);
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
					{reservation && reservation.sub_total.toLocaleString()} {currency2}
				</div>
				<div className='total-amount'>
					<strong>Transaction Fee & Taxes (2%):</strong> 0 {currency2}
				</div>
				<div
					className='total-amount'
					style={{ color: "darkgreen", fontWeight: "bold", width: "100%" }}
				>
					<strong>Your Payment Total Amount:</strong>{" "}
					{reservation && reservation.sub_total.toLocaleString()} {currency2}
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
				reservation.payment_details.transactionId) ? (
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
				<div>
					<PaymentForm
						setData={setData}
						data={data}
						buy={buy}
						user={reservation}
						token={token}
						language={chosenLanguage}
					/>
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
