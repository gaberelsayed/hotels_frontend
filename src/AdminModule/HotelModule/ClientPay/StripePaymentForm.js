import React from "react";
import styled from "styled-components";
import {
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";

const StripePaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		try {
			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: window.location.href,
				},
				redirect: "if_required",
			});

			if (result.error) {
				console.log("[error]", result.error);
				alert("Payment failed: " + result.error.message);
			} else if (result.paymentIntent.status === "succeeded") {
				console.log("[PaymentIntent]", result.paymentIntent);
				alert("Payment successful!");
			} else if (result.paymentIntent.status === "requires_action") {
				alert(
					"Additional authentication required. Please follow the instructions in the new window."
				);
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
				<StyledPaymentElement>
					<PaymentElement />
				</StyledPaymentElement>
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

const StyledPaymentElement = styled.div`
	border: 1px solid #e6e6e6;
	padding: 10px;
	border-radius: 4px;
	background-color: white;
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
