import React from "react";
import styled from "styled-components";

const SquarePaymentMainForm = ({ paymentForm }) => {
	return (
		<Container>
			<div id='form-container'>
				<div id='sq-walletbox'>
					{/* Display digital wallet buttons based on state */}
					<Button id='sq-apple-pay' style={{ display: "none" }}>
						Apple Pay
					</Button>
					<Button id='sq-masterpass' style={{ display: "none" }}>
						Masterpass
					</Button>
					<Button id='sq-google-pay' style={{ display: "none" }}>
						Google Pay
					</Button>
					<hr />
				</div>
				<div id='sq-ccbox'>
					{/* Credit card form fields will be replaced by Square's iFrames */}
					<div id='sq-card-number'></div>
					<div id='sq-expiration-date'></div>
					<div id='sq-cvv'></div>
					<div id='sq-postal-code'></div>
					<input id='name' type='text' placeholder='Name' />
				</div>
				<Button onClick={() => paymentForm.requestCardNonce()}>Pay</Button>
			</div>
		</Container>
	);
};

export default SquarePaymentMainForm;

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Button = styled.button`
	padding: 10px 20px;
	margin: 10px;
	background-color: #4caf50;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;

	&:hover {
		background-color: #45a049;
	}
`;
