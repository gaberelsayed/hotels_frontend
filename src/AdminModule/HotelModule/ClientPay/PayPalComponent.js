import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalComponent = ({
	totalAmount,
	currency = "SAR",
	vendorEmail,
	reservationId,
}) => {
	console.log(totalAmount, "totalAmount");
	const createOrder = (data, actions) => {
		// This is where you would call your backend endpoint
		// to create the order with the dynamic values
		console.log("Total Amount: ", totalAmount);

		return fetch(`${process.env.REACT_APP_API_URL}/create-order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				totalAmount,
				currency,
				vendorEmail, // Note: You will need to adjust your backend to expect and handle this email
				reservationId,
			}),
		})
			.then((response) => response.json())
			.then((order) => {
				// The backend should return the order ID in a JSON response
				return order.orderID;
			});
	};

	const onApprove = (data, actions) => {
		// Call your backend endpoint to capture the order
		return fetch(`${process.env.REACT_APP_API_URL}/capture-order`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				orderID: data.orderID,
			}),
		})
			.then((response) => response.json())
			.then((details) => {
				console.log("Payment successful:", details);
				// Handle payment success, e.g., update database, send email, etc.
			});
	};

	const onError = (err) => {
		console.error("Payment error:", err);
		// Handle payment error
	};

	return (
		<PayPalScriptProvider
			options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENTID }}
		>
			<PayPalButtons
				style={{ layout: "vertical" }}
				createOrder={createOrder}
				onApprove={onApprove}
				onError={onError}
			/>
		</PayPalScriptProvider>
	);
};

export default PayPalComponent;
