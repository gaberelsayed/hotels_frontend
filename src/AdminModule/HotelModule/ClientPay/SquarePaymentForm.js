import React from "react";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { processPayment_Square } from "../apiAdmin"; // Assuming this is your custom function to call your backend

const SquarePaymentForm = ({
	reservationId,
	amount,
	currency,
	reservation,
	amountInSar,
}) => {
	const applicationId = process.env.REACT_APP_APPLICATION_ID; // Ensure this is set in your environment variables
	const locationId = "LSCEA11F58GQF"; // Ensure this is set in your environment variables

	const cardTokenizeResponseReceived = async (tokenResult) => {
		if (tokenResult.status === "OK") {
			console.info("Token:", tokenResult.token); // For debugging

			const paymentData = {
				sourceId: tokenResult.token,
				reservationId,
				amount: amount.toString(), // Make sure this is a string to match the expected format
				currency,
				reservation,
				amountInSar,
				metadata: {
					confirmation_number: reservation.confirmation_number,
					name: reservation.customer_details.name,
					phone: reservation.customer_details.phone,
					nationality: reservation.customer_details.nationality,
				},
			};

			// Call your backend to process the payment
			try {
				const response = await processPayment_Square(
					reservationId,
					paymentData
				);
				console.log(response); // Handle response from your backend
				// Add any additional handling for successful payment processing here (e.g., navigate to a confirmation page)
			} catch (error) {
				console.error("Error processing payment:", error);
				// Handle any errors that occur during the payment process
			}
		} else {
			console.error("Failed to tokenize card:", tokenResult.errors);
			// Handle tokenization errors here
		}
	};

	return (
		<PaymentForm
			applicationId={applicationId}
			locationId={locationId}
			cardTokenizeResponseReceived={cardTokenizeResponseReceived}
			createVerificationDetails={() => ({
				amount: amount.toString(), // This should be the same as the payment amount
				currencyCode: currency,
				intent: "CHARGE",
				billingContact: {
					/* Fill in billing contact information here if available */
				},
			})}
		>
			<CreditCard />
		</PaymentForm>
	);
};

export default SquarePaymentForm;
