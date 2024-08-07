import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useCartContext } from "../cart_context";
import { isAuthenticated } from "../auth";
import {
	getHotelDetails,
	gettingDateReport,
	gettingDayOverDayInventory,
	hotelAccount,
} from "./apiAdmin";
import PasscodeModal from "./HotelManagement/PasscodeModal";
import TopNavbar from "./AdminNavbar/TopNavbar";

const MainHotelDashboard = () => {
	// eslint-disable-next-line
	const history = useHistory();

	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [modalVisiblePasscode, setModalVisiblePasscode] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	// eslint-disable-next-line
	const [hotelDetails, setHotelDetails] = useState("");
	// eslint-disable-next-line
	const [reservationsToday, setReservationsToday] = useState("");
	// eslint-disable-next-line
	const [reservationsYesterday, setReservationsYesterday] = useState("");
	const { chosenLanguage } = useCartContext();
	// eslint-disable-next-line
	const [dayOverDayInventory, setDayOverDayInventory] = useState([]);
	// eslint-disable-next-line
	const [selectedDates, setSelectedDates] = useState([]);

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}

		// eslint-disable-next-line
	}, []);

	// Helper function to format a date object into yyyy-mm-dd
	function formatDate(date) {
		const d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
	}

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

							// Format today's date
							const today = new Date();
							const formattedToday = formatDate(today);

							// Get yesterday's date
							const yesterday = new Date(today);
							yesterday.setDate(yesterday.getDate() - 1);
							const formattedYesterday = formatDate(yesterday);

							// Get today's report
							gettingDateReport(formattedToday, data2[0]._id, data._id).then(
								(data3) => {
									if (data3 && data3.error) {
										console.log(data3.error);
									} else {
										setReservationsToday(
											data3.filter(
												(i) => !i.reservation_status.includes("cancelled")
											)
										);
									}
								}
							);

							// Get yesterday's report
							gettingDateReport(
								formattedYesterday,
								data2[0]._id,
								data._id
							).then((data4) => {
								if (data4 && data4.error) {
									console.log(data4.error);
								} else {
									setReservationsYesterday(
										data4.filter(
											(i) => !i.reservation_status.includes("cancelled")
										)
									);
								}
							});
						}

						gettingDayOverDayInventory(data._id, data2[0]._id).then((data5) => {
							if (data5 && data5.error) {
								console.log("Data not received");
							} else {
								setDayOverDayInventory(data5);
							}
						});
					}
				});
			}
		});
	};

	useEffect(() => {
		gettingHotelData();
		// eslint-disable-next-line
	}, [selectedDates]);

	return (
		<MainHotelDashboardWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
			isArabic={chosenLanguage === "Arabic"}
		>
			<PasscodeModal
				setModalVisiblePasscode={setModalVisiblePasscode}
				modalVisiblePasscode={modalVisiblePasscode}
			/>
			<div className='grid-container-main'>
				<div className='navcontent'>
					<TopNavbar
						fromPage='AdminDasboard'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
						chosenLanguage={chosenLanguage}
					/>
				</div>

				<div className='otherContentWrapper'>
					<div>Hello There Yaba From Hotel Main Dashboard</div>

					{/* <WorldClocks /> */}
				</div>
			</div>
		</MainHotelDashboardWrapper>
	);
};

export default MainHotelDashboard;

const MainHotelDashboardWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 70px;
	min-height: 715px;
	text-align: ${(props) => (props.isArabic ? "right" : "")};

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 90%" : "15% 84%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	.tab-grid {
		display: flex;
		/* Additional styling for grid layout */
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
