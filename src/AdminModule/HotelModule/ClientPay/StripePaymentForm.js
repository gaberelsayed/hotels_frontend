import React from "react";
import styled from "styled-components";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const StripePaymentForm = ({ buy }) => {
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
			// Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		const cardElement = elements.getElement(CardElement);

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: cardElement,
		});

		if (error) {
			console.log("[error]", error);
		} else {
			console.log("[PaymentMethod]", paymentMethod);
			buy(paymentMethod.id);
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
