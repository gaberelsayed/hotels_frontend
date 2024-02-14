import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useCartContext } from "../cart_context";
import {
	getAllHouseKeepingTasks,
	getAllHouseKeepingTotalRecords,
	getHotelDetails,
	getHotelRooms,
	getHouseKeepingStaff,
	hotelAccount,
} from "../HotelModule/apiAdmin";
import { isAuthenticated, signout } from "../auth";
import HouseKeepingTable from "./HouseKeepingTable";
import CreateNewTask from "./CreateNewTask";

const handleSignout = (history) => {
	signout(() => {
		history.push("/");
	});
};

const HouseKeepingMain = () => {
	const [houseKeepingTasks, setHouseKeepingTasks] = useState([]);
	const [totalTasksCount, setTotalTasksCount] = useState([]);
	const [hotelDetails, setHotelDetails] = useState([]);
	const [hotelRooms, setHotelRooms] = useState([]);
	const [houseKeepingStaff, setHouseKeepingStaff] = useState([]);
	const [currentPage, setCurrentPage] = useState(1); // New state for current page
	const [recordsPerPage] = useState(50); // You can adjust this as needed
	const [activeTab, setActiveTab] = useState("overAllTasks");
	const history = useHistory(); // Initialize the history object

	const { languageToggle, chosenLanguage } = useCartContext();
	const { user, token } = isAuthenticated();
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

	const gettingOverallHouseKeepingTasks = () => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log("This is erroring");
				console.log(data.error, "Error rendering");
			} else {
				console.log(data.belongsToId, "data.hotelIdWork");
				getHotelDetails(data.belongsToId).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						if (
							data &&
							data.name &&
							data.hotelIdWork &&
							data2 &&
							data2.length > 0
						) {
							setHotelDetails(data2[0]);

							getAllHouseKeepingTasks(
								currentPage,
								recordsPerPage,
								data2[0]._id
							).then((data4) => {
								if (data4 && data4.error) {
									console.log(data4.error);
								} else {
									setHouseKeepingTasks(data4.data);
								}
							});

							// Fetch total records
							getAllHouseKeepingTotalRecords(data2[0]._id).then((data5) => {
								if (data5 && data5.error) {
									console.log(data5.error);
								} else {
									setTotalTasksCount(data5.totalDocuments); // Set total records
								}
							});

							if (!hotelRooms || hotelRooms.length === 0) {
								getHotelRooms(data2[0]._id, data.belongsToId).then((data3) => {
									if (data3 && data3.error) {
										console.log(data3.error);
									} else {
										setHotelRooms(data3);
									}
								});
							}

							getHouseKeepingStaff(data2[0]._id).then((data6) => {
								if (data6 && data6.error) {
									console.log(data6.error);
								} else {
									setHouseKeepingStaff(data6); // Set total records
								}
							});
						}
					}
				});
			}
		});
	};

	useEffect(() => {
		gettingOverallHouseKeepingTasks();
		// eslint-disable-next-line
	}, [currentPage]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	return (
		<HouseKeepingMainWrapper dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
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
										"/house-keeping-management/house-keeping?overAllTasks"
									); // Programmatically navigate
								}}
							>
								{chosenLanguage === "Arabic" ? "نظرة عامة" : "Overall Tasks"}
							</Tab>

							<Tab
								isActive={activeTab === "createNewTask"}
								onClick={() => {
									setActiveTab("createNewTask");
									history.push(
										"/house-keeping-management/house-keeping?createNewTask"
									); // Programmatically navigate
								}}
							>
								{chosenLanguage === "Arabic"
									? "إنشاء مهمة جديدة لموظف"
									: "Create New Task"}
							</Tab>

							<Tab
								isActive={activeTab === "reports"}
								onClick={() => {
									setActiveTab("reports");
									history.push(
										"/house-keeping-management/house-keeping?reports"
									); // Programmatically navigate
								}}
							>
								{chosenLanguage === "Arabic"
									? "التقارير"
									: "House Keeping Reports"}
							</Tab>
						</div>
					</div>

					<div className='container-wrapper'>
						{activeTab === "overAllTasks" &&
						hotelRooms &&
						hotelRooms.length > 0 ? (
							<>
								<HouseKeepingTable
									houseKeepingTasks={houseKeepingTasks}
									totalTasksCount={totalTasksCount}
									handlePageChange={handlePageChange}
									chosenLanguage={chosenLanguage}
									currentPage={currentPage}
									recordsPerPage={recordsPerPage}
									houseKeepingStaff={houseKeepingStaff}
									hotelRooms={hotelRooms}
								/>
							</>
						) : null}

						{activeTab === "createNewTask" &&
						hotelRooms &&
						hotelRooms.length > 0 &&
						hotelDetails &&
						hotelDetails._id ? (
							<>
								<CreateNewTask
									hotelRooms={hotelRooms}
									hotelDetails={hotelDetails}
									chosenLanguage={chosenLanguage}
									houseKeepingStaff={houseKeepingStaff}
								/>
							</>
						) : null}
					</div>
				</div>
			</div>
		</HouseKeepingMainWrapper>
	);
};

export default HouseKeepingMain;

const HouseKeepingMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

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
