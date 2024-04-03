import React from "react";
import styled from "styled-components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { gettingCreatePaymentIntent } from "../apiAdmin";

const StripePaymentForm = ({ clientSecret, currency, reservation }) => {
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
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const cardElement = elements.getElement(CardElement);
		const amountInCents = Math.round(
			(parseFloat(currency.amountInUSD) - 0.05) * 100
		);
		const metadata = {
			confirmation_number: reservation.confirmation_number,
			name: reservation.customer_details.name,
			phone: reservation.customer_details.phone,
			email: reservation.customer_details.email,
			hotel_name: reservation.hotelId.hotelName,
			nationality: reservation.customer_details.nationality,
			checkin_date: reservation.checkin_date,
			checkout_date: reservation.checkout_date,
			reservation_status: reservation.reservation_status,
		};

		try {
			const response = await gettingCreatePaymentIntent(
				amountInCents,
				metadata
			);
			console.log(response, "Response from gettingCreatePaymentIntent");

			const result = await stripe.confirmCardPayment(response, {
				payment_method: { card: cardElement },
			});

			if (result.error) {
				console.log("[error]", result.error);
				alert("Payment failed: " + result.error.message);
			} else if (result.paymentIntent.status === "succeeded") {
				console.log("[PaymentIntent]", result.paymentIntent);
				alert("Payment successful!");
			} else if (result.paymentIntent.status === "requires_action") {
				// Handle additional authentication if required
				const { paymentIntent } = await stripe.handleCardAction(response);
				if (paymentIntent.status === "succeeded") {
					alert("Payment successful after authentication!");
				} else {
					alert("Payment failed after authentication.");
				}
			} else {
				alert("Payment status: " + result.paymentIntent.status);
			}
		} catch (error) {
			console.error("Payment processing error:", error);
			alert("An error occurred during payment processing. Please try again.");
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
