import React from "react";
import styled from "styled-components";
import DropIn from "braintree-web-drop-in-react";

const DropInPayment = ({
	data,
	setData,
	buy,
	user,
	chosenLanguage,
	scoreCardObject,
}) => {
	// eslint-disable-next-line
	const { commission_janat, commission_affiliate, total_amount_due_USD } =
		scoreCardObject;
	const total_commission_due = commission_janat + commission_affiliate;

	return (
		<DropInPaymentWrapper>
			<InfoText>
				{chosenLanguage === "Arabic" ? "العمولة:" : "Commission:"}{" "}
				{total_commission_due.toLocaleString()} SAR
			</InfoText>
			<InfoText>
				{chosenLanguage === "Arabic"
					? "المعاملات والضرائب:"
					: "Transaction & Taxes:"}{" "}
				{(total_commission_due * 0.02).toLocaleString()} SAR
			</InfoText>
			<TotalAmountText>
				{chosenLanguage === "Arabic"
					? "إجمالي المبلغ المستحق:"
					: "Total Amount Due:"}{" "}
				{(total_commission_due * 1.02).toLocaleString()} SAR
			</TotalAmountText>
			{/* <TotalAmountTextUSD>
				{chosenLanguage === "Arabic"
					? "المبلغ الإجمالي المستحق بالدولار الأمريكي:"
					: "Total Amount Due in USD:"}{" "}
				{total_amount_due_USD && total_amount_due_USD.toLocaleString(2)} USD
			</TotalAmountTextUSD> */}
			{data && data.loading ? null : (
				<div className='col-md-10 mx-auto'>
					<DropIn
						options={{
							authorization: data && data.clientToken,
						}}
						onInstance={(instance) => (data.instance = instance)}
					/>
					<div className='mx-auto text-center'>
						<PayButton onClick={buy}>
							{chosenLanguage === "Arabic" ? "ادفع الآن" : "Pay Now"}{" "}
							{Number(total_commission_due * 1.02).toLocaleString()} SAR
						</PayButton>
					</div>
				</div>
			)}
		</DropInPaymentWrapper>
	);
};

export default DropInPayment;

const DropInPaymentWrapper = styled.div``;

const InfoText = styled.div`
	text-align: center;
	font-weight: bold;
	margin-bottom: 10px;
`;

const TotalAmountText = styled(InfoText)`
	font-size: 1.2rem;
	color: green;
`;

const PayButton = styled.button`
	background-color: #28a745;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	font-size: 1rem;
	font-weight: bold;
	margin-top: 20px;
	cursor: pointer;
	width: 50%;
	text-align: center;

	&:hover {
		background-color: #218838;
	}
`;

// const TotalAmountTextUSD = styled(TotalAmountText)`
// 	color: #4caf50; /* Adjust the color as needed */
// `;
