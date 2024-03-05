import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import {
	getBraintreeClientToken,
	getHotelDetails,
	hotelAccount,
	pendingPaymentReservationList,
	processPayment_Subscription,
	updateSubscriptionCardFn,
	currecyConversion,
	processCommissionPayment,
	gettingCommissionPaidReservations,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Subscription from "./Subscription";
import PendingReservationPayments from "./PendingReservationPayments";
import PaidCommission from "./PaidCommission";

const PaymentMain = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [hotelDetails, setHotelDetails] = useState("");
	const [updateCardClicked, setUpdateCardClicked] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [activeTab, setActiveTab] = useState("subscription");
	const [currentPage, setCurrentPage] = useState(1);
	const [scoreCardObject, setScoreCardObject] = useState("");
	const [scoreCardObject2, setScoreCardObject2] = useState("");
	const [commissionPaidReservations, setCommissionPaidReservations] =
		useState("");
	const [data, setData] = useState({
		loading: false,
		success: false,
		clientToken: null,
		error: "",
		instance: {},
	});
	const [pendingReservations, setPendingReservations] = useState("");

	const { user, token } = isAuthenticated();
	const { languageToggle, chosenLanguage } = useCartContext();
	const history = useHistory(); // Initialize the history object

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}

		if (window.location.search.includes("subscription")) {
			setActiveTab("subscription");
		} else if (window.location.search.includes("pending")) {
			setActiveTab("pending");
		} else if (window.location.search.includes("reports")) {
			setActiveTab("reports");
		} else {
			setActiveTab("subscription");
		}
		// eslint-disable-next-line
	}, [activeTab]);

	const getToken = (userId, token) => {
		setData({ ...data, loading: true });
		getBraintreeClientToken(userId, token, user.storeCountry).then((data) => {
			if (data.error) {
				setData({ ...data, error: data.error });
			} else {
				setData({ ...data, clientToken: data.clientToken });
				setData({ ...data, loading: false });
			}
		});
	};

	useEffect(() => {
		getToken(user._id, token);

		// eslint-disable-next-line
	}, []);

	console.log(scoreCardObject, "scorecardobjectttttttttt");

	const aggregateScoreCardData = async (reservations) => {
		let total = 0;
		let total_amount = 0;
		let commission_janat = 0;
		let commission_affiliate = 0;

		reservations.forEach((reservation) => {
			total += 1;
			total_amount += reservation.total_amount;

			if (reservation.booking_source === "janat") {
				commission_janat += reservation.total_amount * 0.1;
			} else if (reservation.booking_source === "affiliate") {
				commission_affiliate += reservation.total_amount * 0.1;
			}
		});

		const total_commission_due =
			(commission_janat + commission_affiliate) * 1.02;

		// Convert the total commission due to USD
		const total_amount_due_USD = await currecyConversion(
			total_commission_due
		).then((data) => {
			if (data && data.amountInUSD) {
				return data.amountInUSD;
			} else {
				console.error("Error converting currency");
				return 0; // Return 0 if there was an error in conversion
			}
		});

		return {
			total,
			total_amount,
			commission_janat,
			commission_affiliate,
			total_amount_due_USD,
		};
	};

	const gettingHotelData = () => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						if (data && data.name && data._id && data2 && data2.length > 0) {
							setHotelDetails(data2[0]);

							pendingPaymentReservationList(
								currentPage,
								400,
								data2[0]._id
							).then((data) => {
								if (data && data.error) {
									console.log(data.error, "error getting reservations");
								} else {
									setPendingReservations(data);
									aggregateScoreCardData(data).then((aggregatedData) => {
										setScoreCardObject(aggregatedData);
									});
								}
							});

							gettingCommissionPaidReservations(
								currentPage,
								400,
								data2[0]._id
							).then((data4) => {
								if (data4 && data4.error) {
									console.log(data4.error, "error getting reservations");
								} else {
									setCommissionPaidReservations(data4);
									aggregateScoreCardData(data4).then((aggregatedData) => {
										setScoreCardObject2(aggregatedData);
									});
								}
							});
						}
					}
				});
			}
		});
	};

	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, []);

	const updateSubscriptionCard = async () => {
		const { nonce } = await data.instance.requestPaymentMethod();
		updateSubscriptionCardFn(token, {
			paymentMethodNonce: nonce,
			paymentMethodToken: hotelDetails.subscriptionToken,
			subscriptionId: hotelDetails.subscriptionId,
		})
			.then((response) => {
				if (response.success) {
					toast.success("Card updated successfully for your PRO subscription");
					setTimeout(function () {
						window.location.reload(false);
					}, 4000);
				} else {
					toast.error("Failed to update card for your PRO subscription");
					setTimeout(function () {
						window.location.reload(false);
					}, 4000);
				}
			})
			.catch((error) => {
				toast.error("Error updating card for your PRO subscription");
				setTimeout(function () {
					window.location.reload(false);
				}, 4000);
			});
	};

	const buy_subscribe = () => {
		console.log("clicked");
		let nonce;

		// eslint-disable-next-line
		let getNonce = data.instance
			.requestPaymentMethod()
			.then((data) => {
				nonce = data.nonce;

				const paymentData = {
					paymentMethodNonce: nonce,
					amount: 150,
					email: user.email,
					customerId: hotelDetails._id,
					planId: "monthly_plan",
					hotelId: hotelDetails._id,
				};

				processPayment_Subscription(token, paymentData)
					.then((response) => {
						if (
							response.subscription &&
							response.subscription.paymentMethodToken
						) {
							// empty cart
							// create order
							// console.log(response, "responsefromPayment");
							// eslint-disable-next-line

							toast.success(
								"CONGRATULATIONS! You now subscribed to our XHOTEL PRO PLAN"
							);

							console.log(response.subscription, "response.subscription");

							//Here you should update the hotelId

							// setTimeout(function () {
							// 	window.location.reload(false);
							// }, 4000);
						} else {
							toast.error(
								"Not Paid, Maybe insufficient credit, Please try another card"
							);

							setTimeout(function () {
								window.location.reload(false);
							}, 2000);
						}
					})
					.catch((error) => {
						setData({ loading: false });
					});
			})
			.catch((error) => {
				// console.log("dropin error: ", error);
				setData({ ...data, error: error.message });
			});
	};

	const buy = () => {
		data.instance
			.requestPaymentMethod()
			.then((data) => {
				const nonce = data.nonce;
				const paymentData = {
					paymentMethodNonce: nonce,
					amount: Number(scoreCardObject.total_amount_due_USD).toFixed(2)
						? Number(scoreCardObject.total_amount_due_USD).toFixed(2)
						: 10,
					email: user.email,
					customerId: hotelDetails._id,
					planId: "One Time Payment",
					reservationIds:
						pendingReservations && pendingReservations.map((i) => i._id),
				};

				return processCommissionPayment(paymentData);
			})
			.then((response) => {
				// Directly check for a successful transaction indicator from your backend response
				setTimeout(function () {
					window.location.reload(false);
				}, 4000);

				toast.success("You have successfully paid Janat & Affiliate Share");
			})
			.catch((error) => {
				// Handle errors from both requestPaymentMethod and processPayment
				console.error("Payment processing error: ", error);
				setData({ loading: false, error: error.message });
				setTimeout(function () {
					window.location.reload(false);
				}, 4000);

				toast.error(
					"An error occurred during payment processing. Please try again."
				);
			});
	};

	return (
		<PaymentMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
			isArabic={chosenLanguage === "Arabic"}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='Payment'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='Payment'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					)}
				</div>

				<div className='otherContentWrapper'>
					<div style={{ background: "#8a8a8a", padding: "1px" }}>
						<div className='my-2 tab-grid col-md-8'>
							<Tab
								isActive={activeTab === "subscription"}
								onClick={() => {
									setActiveTab("subscription");
									history.push("/hotel-management-payment?subscription"); // Programmatically navigate
								}}
							>
								{chosenLanguage === "Arabic" ? "Subscription" : "Subscription"}
							</Tab>
							<Tab
								isActive={activeTab === "pending"}
								onClick={() => {
									setActiveTab("pending");
									history.push("/hotel-management-payment?pending");
								}}
							>
								{chosenLanguage === "Arabic"
									? "Pending Payments"
									: "Pending Payments"}
							</Tab>

							<Tab
								isActive={activeTab === "reports"}
								onClick={() => {
									setActiveTab("reports");
									history.push("/hotel-management-payment?reports");
								}}
							>
								{chosenLanguage === "Arabic"
									? "Paid Commission"
									: "Paid Commission"}
							</Tab>
						</div>
					</div>
					<div
						className='my-3'
						style={{
							textAlign: chosenLanguage === "Arabic" ? "left" : "right",
							fontWeight: "bold",
							textDecoration: "underline",
							cursor: "pointer",
						}}
						onClick={() => {
							if (chosenLanguage === "English") {
								languageToggle("Arabic");
							} else {
								languageToggle("English");
							}
						}}
					>
						{chosenLanguage === "English" ? "ARABIC" : "English"}
					</div>

					<div className='container-wrapper'>
						{activeTab === "subscription" ? (
							<>
								{hotelDetails && hotelDetails._id ? (
									<Subscription
										user={user}
										token={token}
										updateSubscriptionCard={updateSubscriptionCard}
										buy_subscribe={buy_subscribe}
										setUpdateCardClicked={setUpdateCardClicked}
										updateCardClicked={updateCardClicked}
										data={data}
										setData={setData}
										chosenLanguage={chosenLanguage}
										hotelDetails={hotelDetails}
									/>
								) : null}
							</>
						) : null}

						{activeTab === "reports" ? (
							<>
								{hotelDetails && hotelDetails._id ? (
									<PaidCommission
										allReservations={commissionPaidReservations}
										setCurrentPage={setCurrentPage}
										currentPage={currentPage}
										totalRecords={commissionPaidReservations.length}
										chosenLanguage={chosenLanguage}
										hotelDetails={hotelDetails}
										recordsPerPage={400}
										scoreCardObject={scoreCardObject2}
									/>
								) : null}
							</>
						) : null}

						{activeTab === "pending" ? (
							<>
								{hotelDetails && hotelDetails._id ? (
									<PendingReservationPayments
										allReservations={pendingReservations}
										setCurrentPage={setCurrentPage}
										currentPage={currentPage}
										totalRecords={pendingReservations.length}
										chosenLanguage={chosenLanguage}
										hotelDetails={hotelDetails}
										recordsPerPage={400}
										scoreCardObject={scoreCardObject}
										data={data}
										buy={buy}
									/>
								) : null}
							</>
						) : null}
					</div>
				</div>
			</div>
		</PaymentMainWrapper>
	);
};

export default PaymentMain;

const PaymentMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "3% 96%" : "13% 85%")};
	}

	text-align: ${(props) => (props.isArabic ? "right" : "")};

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	.ulist {
		list-style-type: none; /* Remove default bullets */
	}

	.ulist li {
		padding-left: 1.5em; /* Add some padding to the left of list items */
	}

	.ulist li::before {
		content: "✔︎"; /* Insert content before each li element */
		padding-right: 0.5em; /* Add some padding to the right of the check mark */
		color: green; /* Make the check mark green */
	}
	.tab-grid {
		display: flex;
		/* Additional styling for grid layout */
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;

const Tab = styled.div`
	cursor: pointer;
	margin: 0 3px; /* 3px margin between tabs */
	padding: 15px 5px; /* Adjust padding as needed */
	font-weight: ${(props) => (props.isActive ? "bold" : "bold")};
	background-color: ${(props) =>
		props.isActive
			? "transparent"
			: "#bbbbbb"}; /* Light grey for unselected tabs */
	box-shadow: ${(props) =>
		props.isActive ? "inset 5px 5px 5px rgba(0, 0, 0, 0.3)" : "none"};
	transition: all 0.3s ease; /* Smooth transition for changes */
	min-width: 25px; /* Minimum width of the tab */
	width: 100%; /* Full width within the container */
	text-align: center; /* Center the text inside the tab */
	/* Additional styling for tabs */
	z-index: 100;
	font-size: 1.2rem;
	color: ${(props) => (props.isActive ? "white" : "black")};
`;
