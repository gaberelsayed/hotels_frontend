import React, { useState } from "react";
import styled from "styled-components";
import { createConnectAccount } from "../apiAdmin";

const Payouts = ({ hotelDetails }) => {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		setLoading(true);

		try {
			let res = await createConnectAccount(hotelDetails._id); //Get login link
			console.log(res.url, "res");
			window.location.href = res.url;
			setLoading(false);
		} catch (error) {
			console.log(error, "Stripe Connect Failed");
			setLoading(false);
		}
	};
	return (
		<PayoutsWrapper dir='ltr'>
			<h1>Connect Your Bank Account</h1>
			<div>
				{hotelDetails &&
				hotelDetails.stripe_seller &&
				hotelDetails.stripe_seller.charges_enabled ? (
					<>
						<h3 className='my-3'>Hotel Successfully Connected For Payouts</h3>
					</>
				) : (
					<>
						<button
							disabled={loading}
							onClick={handleClick}
							className='btn btn-info my-3'
						>
							SETUP PAYOUTS...
						</button>
					</>
				)}
			</div>
		</PayoutsWrapper>
	);
};

export default Payouts;

const PayoutsWrapper = styled.div`
	text-align: center;
	padding: 20px;

	h1 {
		font-size: 2rem;
		font-weight: bold;
	}

	h3 {
		font-size: 1.3rem;
		font-weight: bold;
		text-decoration: underline;
	}
`;
