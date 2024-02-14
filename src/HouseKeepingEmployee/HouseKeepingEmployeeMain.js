import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useCartContext } from "../cart_context";
import { isAuthenticated, signout } from "../auth";
import { getEmployeeWorkLoad } from "../HotelModule/apiAdmin";
import HouseKeepingEmployeeTable from "./HouseKeepingEmployeeTable";

const handleSignout = (history) => {
	signout(() => {
		history.push("/");
	});
};

const HouseKeepingEmployeeMain = () => {
	const [activeTab, setActiveTab] = useState("overAllTasks");
	const [employeeWork, setEmployeeWork] = useState([]);
	const history = useHistory(); // Initialize the history object
	const { user } = isAuthenticated();

	const { languageToggle, chosenLanguage } = useCartContext();
	const history2 = useHistory(); // Initialize the history object

	useEffect(() => {
		if (window.location.search.includes("overAllTasks")) {
			setActiveTab("overAllTasks");
		} else if (window.location.search.includes("createNewTask")) {
			setActiveTab("createNewTask");
		} else if (window.location.search.includes("reports")) {
			setActiveTab("reports");
		} else {
			setActiveTab("overAllTasks");
		}
		// eslint-disable-next-line
	}, [activeTab]);

	const gettingOverallEmployeeWorkLoad = () => {
		getEmployeeWorkLoad(user._id).then((data) => {
			if (data && data.error) {
				console.log("Error getting work load");
			} else {
				setEmployeeWork(data);
			}
		});
	};

	useEffect(() => {
		gettingOverallEmployeeWorkLoad();
		// eslint-disable-next-line
	}, []);

	console.log(employeeWork, "employeeWork");
	return (
		<HouseKeepingEmployeeMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			isArabic={chosenLanguage === "Arabic"}
		>
			<div className='mx-2 mb-2'>
				<button
					className='signout-button'
					onClick={() => handleSignout(history2)}
					style={{
						color: "red",
						fontWeight: "bold",
						textDecoration: "underline",
						cursor: "pointer",
						border: "none",
						background: "transparent",
					}}
				>
					Signout
				</button>
			</div>
			<div className='my-2 text-center'>
				<h4>Hello {user && user.name}</h4>
			</div>
			<div className='grid-container-main'>
				<div className='navcontent'></div>

				<div className='otherContentWrapper'>
					<div
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

					<div style={{ background: "#8a8a8a", padding: "1px" }}>
						<div className='my-2 tab-grid col-md-8'>
							<Tab
								isActive={activeTab === "overAllTasks"}
								onClick={() => {
									setActiveTab("overAllTasks");
									history.push(
										"/house-keeping-employee/house-keeping?overAllTasks"
									); // Programmatically navigate
								}}
							>
								{chosenLanguage === "Arabic"
									? "مهام عملك الغير مكتملة"
									: "Overall Tasks"}
							</Tab>
						</div>
					</div>

					<div className='container-wrapper'>
						{employeeWork && employeeWork.length > 0 ? (
							<HouseKeepingEmployeeTable
								employeeWork={employeeWork}
								chosenLanguage={chosenLanguage}
							/>
						) : (
							<div>
								{chosenLanguage === "Arabic" ? (
									<h3
										style={{
											textAlign: "center",
											padding: "20px 10px",
											color: "darkgreen",
											fontWeight: "bold",
										}}
									>
										تهانينا، لقد انتهيت الآن من جميع مهامك، ويمكنك الحصول على
										قسط من الراحة الآن!
									</h3>
								) : (
									<h3
										style={{
											textAlign: "center",
											padding: "20px 10px",
											color: "darkgreen",
											fontWeight: "bold",
										}}
									>
										Congratulations, Now you finished all your assignments, You
										can have a rest for now!
									</h3>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</HouseKeepingEmployeeMainWrapper>
	);
};

export default HouseKeepingEmployeeMain;

const HouseKeepingEmployeeMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;
	text-align: ${(props) => (props.isArabic ? "right" : "")};

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 90%" : "5% 90%")};
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
