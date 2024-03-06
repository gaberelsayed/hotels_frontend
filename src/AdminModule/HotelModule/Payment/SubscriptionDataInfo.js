import React, { useState, useEffect } from "react";
import { getSubscriptionData } from "../apiAdmin";
import styled from "styled-components";

const SubscriptionDataInfo = ({ user, token, hotelDetails }) => {
	const [subscriptionInfo, setSubscriptionInfo] = useState({});

	useEffect(() => {
		if (hotelDetails.subscriptionId) {
			getSubscriptionData(user._id, token, hotelDetails.subscriptionId)
				.then((data) => {
					if (data.error) {
						console.log(data.error);
					} else {
						setSubscriptionInfo(data);
					}
				})
				.catch((err) => console.log(err));
		}

		// eslint-disable-next-line
	}, [user, token]);

	const creditCardMaskedNumber =
		subscriptionInfo &&
		subscriptionInfo.transactions &&
		subscriptionInfo.transactions[subscriptionInfo.transactions.length - 1] &&
		subscriptionInfo.transactions[subscriptionInfo.transactions.length - 1]
			.creditCard &&
		subscriptionInfo.transactions[subscriptionInfo.transactions.length - 1]
			.creditCard.maskedNumber;

	return (
		<SubscriptionDataInfoWrapper>
			<h4>Subscription Info</h4>
			<p>
				Subscription ID <strong>{subscriptionInfo.id}</strong>{" "}
			</p>
			<p>
				Status <strong>{subscriptionInfo.status}</strong>{" "}
			</p>
			<p>
				Credit Card <strong>{creditCardMaskedNumber}</strong>{" "}
			</p>
			<p>
				Start date{" "}
				<strong>{new Date(subscriptionInfo.createdAt).toDateString()}</strong>{" "}
			</p>
			<p>
				Next billing date <strong>{subscriptionInfo.nextBillingDate}</strong>{" "}
			</p>
		</SubscriptionDataInfoWrapper>
	);
};

export default SubscriptionDataInfo;

const SubscriptionDataInfoWrapper = styled.div`
	margin-bottom: 20px;
	margin-top: 20px;

	h4 {
		font-weight: bolder;
		text-decoration: underline;
	}
	p {
		font-size: 0.95rem;
	}
`;
