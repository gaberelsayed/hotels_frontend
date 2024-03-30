import React from "react";
import styled from "styled-components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const StripePaymentForm = ({ buy, clientSecret, reservation }) => {
	const stripe = useStripe();
	const elements = useElements();

	const CARD_ELEMENT_OPTIONS = {
		style: {
			base: {
				color: "#303238",
				fontSize: "16px",
				fontFamily: "sans-serif",
				fontSmoothing: "antialiased",
				"::placeholder": {
					color: "#CFD7DF",
				},
			},
			invalid: {
				color: "#e5424d",
				":focus": {
					color: "#303238",
				},
			},
		},
		// Add this line to hide the postal code field
		hidePostalCode: true,
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			console.log("Stripe.js has not loaded yet.");
			return;
		}

		const cardElement = elements.getElement(CardElement);

		try {
			const { error, paymentIntent } = await stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: cardElement,
						billing_details: {
							// Include other billing details if necessary, excluding the address if you don't need a ZIP code
							name:
								reservation &&
								reservation.customer_details &&
								reservation.customer_details.name,
							phone:
								reservation &&
								reservation.customer_details &&
								reservation.customer_details.phone,
						},
					},
				}
			);

			if (error) {
				console.error("[error]", error);
				// Display error to the user, e.g., using a toast or an alert
				toast.error(error.message);
			} else if (paymentIntent && paymentIntent.status === "succeeded") {
				console.log("[PaymentIntent]", paymentIntent);
				// Handle successful payment here, e.g., update reservation status, display a confirmation message, etc.
				toast.success("Payment successful!");
				buy(paymentIntent.id); // If you need to pass the payment intent ID to the buy function
			} else {
				// Handle other paymentIntent statuses if necessary
				console.log("PaymentIntent status:", paymentIntent.status);
				toast.info(`Payment status: ${paymentIntent.status}`);
			}
		} catch (err) {
			console.error("Payment confirmation error:", err);
			toast.error(
				"An error occurred during payment confirmation. Please try again."
			);
		}
	};

	return (
		<PaymentFormWrapper>
			<form onSubmit={handleSubmit}>
				<StyledCardElement>
					<CardElement
						options={{ ...CARD_ELEMENT_OPTIONS, autocomplete: "off" }}
					/>
				</StyledCardElement>
				<PayButton type='submit' disabled={!stripe}>
					Pay Now
				</PayButton>
			</form>
		</PaymentFormWrapper>
	);
};

export default StripePaymentForm;

const PaymentFormWrapper = styled.div`
	margin: 20px 0;
`;

const StyledCardElement = styled.div`
	border: 1px solid #e6e6e6;
	padding: 10px;
	border-radius: 4px;
	background-color: white;

	.StripeElement {
		width: 100%;
		padding: 15px;
	}
`;

const PayButton = styled.button`
	background-color: #4caf50;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 4px;
	margin-top: 20px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: #45a049;
	}

	&:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
`;
