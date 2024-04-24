import React, { useState } from "react";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import { processPayment_Square } from "../apiAdmin";
import { toast } from "react-toastify";

const SquarePaymentForm = ({
	reservationId,
	amount,
	currency,
	reservation,
	amountInSar,
	setPaymentStatus,
}) => {
	const applicationId = process.env.REACT_APP_APPLICATION_ID_TEST;
	const locationId = "LSCEA11F58GQF"; //Production
	// const locationId = "LSWZYQNK2HY28";
	const [isProcessing, setIsProcessing] = useState(false); // State to track processing status

	const cardTokenizeResponseReceived = async (tokenResult) => {
		if (tokenResult.status === "OK") {
			console.info("Token:", tokenResult.token);
			setIsProcessing(true); // Disable further submissions

			const paymentData = {
				sourceId: tokenResult.token,
				reservationId,
				amount: amount.toString(),
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

			try {
				const response = await processPayment_Square(
					reservationId,
					paymentData
				);
				setPaymentStatus(true);
				toast.success("Successfully Paid");
				console.log(response);
			} catch (error) {
				toast.error("Payment Failed, Please try another card");
				console.error("Error processing payment:", error);
			} finally {
				setIsProcessing(false); // Re-enable the form for further actions
			}
		} else {
			toast.error("Payment Failed, Please try another card");
			console.error("Failed to tokenize card:", tokenResult.errors);
		}
	};

	return (
		<PaymentForm
			applicationId={applicationId}
			locationId={locationId}
			cardTokenizeResponseReceived={cardTokenizeResponseReceived}
			createVerificationDetails={() => ({
				amount: amount.toString(),
				currencyCode: currency,
				intent: "CHARGE",
				billingContact: {
					/* Fill in billing contact information here if available */
				},
			})}
		>
			<CreditCard disabled={isProcessing} />
			{/* Assuming you can control the disabled state */}
		</PaymentForm>
	);
};

export default SquarePaymentForm;
