import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../../cart_context";
import {
	createRooms,
	getHotelDetails,
	getHotelReservations,
	getHotelRooms,
	hotelAccount,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import HotelOverview from "./HotelOverview";
import { toast } from "react-toastify";
import { defaultHotelDetails } from "../../AdminModule/NewHotels/Assets";
import HotelHeatMap from "./HotelHeatMap";
import moment from "moment";
import GeneralOverview from "./GeneralOverview";

const isActive = (history, path) => {
	if (history === path) {
		return {
			background: "#0f377e",
			fontWeight: "bold",
			borderRadius: "5px",
			fontSize: "1rem",
			padding: "10px",
			color: "white",
			transition: "var(--mainTransition)",
		};
	} else {
		return {
			backgroundColor: "lightgrey",
			padding: "10px",
			borderRadius: "5px",
			fontSize: "1.2rem",
			fontWeight: "bold",
			cursor: "pointer",
			transition: "var(--mainTransition)",
			color: "black",
		};
	}
};

const HotelManagerDashboard = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [websiteMenu, setWebsiteMenu] = useState("Operations");
	const [hotelRooms, setHotelRooms] = useState("");
	// eslint-disable-next-line
	const [alreadyAddedRooms, setAlreadyAddedRooms] = useState("");
	const [hotelDetails, setHotelDetails] = useState("");
	const [currentAddingRoom, setCurrentAddingRoom] = useState("");
	const [values, setValues] = useState("");
	const [floorDetails, setFloorDetails] = useState(defaultHotelDetails);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [clickedFloor, setClickedFloor] = useState("");
	const [clickedRoom, setClickedRoom] = useState("");
	const [allReservations, setAllReservations] = useState([]);
	const { languageToggle, chosenLanguage } = useCartContext();
	const { user, token } = isAuthenticated();

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}
		// eslint-disable-next-line
	}, []);

	const processRoomsData = (rooms, selectedFloor) => {
		const roomCountDetails = {
			standardRooms: 0,
			singleRooms: 0,
			doubleRooms: 0,
			twinRooms: 0,
			queenRooms: 0,
			kingRooms: 0,
			tripleRooms: 0,
			quadRooms: 0,
			studioRooms: 0,
			suite: 0,
			masterSuite: 0,
			familyRooms: 0,
			// Initialize other room types here...
		};

		rooms.forEach((room) => {
			if (
				room.floor === selectedFloor &&
				room.room_type &&
				roomCountDetails.hasOwnProperty(room.room_type)
			) {
				roomCountDetails[room.room_type]++;
			}
		});

		return roomCountDetails;
	};

	const gettingHotelData = () => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				setValues(data);
				const formattedStartDate = moment()
					.subtract(2, "days")
					.format("YYYY-MM-DD");
				const formattedEndDate = moment().add(30, "days").format("YYYY-MM-DD");
				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						if (data && data.name && data._id && data2 && data2.length > 0) {
							getHotelReservations(
								user._id,
								data2[0]._id,
								formattedStartDate,
								formattedEndDate
							).then((data3) => {
								if (data3 && data3.error) {
									console.log(data3.error);
								} else {
									setAllReservations(data3 && data3.length > 0 ? data3 : []);
								}
							});

							setHotelDetails(data2[0]);

							getHotelRooms(data2[0]._id, user._id).then((data4) => {
								if (data4 && data4.error) {
									console.log(data4.error);
								} else {
									setHotelRooms(data4);
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

	const addRooms = () => {
		if (!hotelRooms || hotelRooms.length === 0) {
			return toast.error("Please Add Rooms");
		}

		// Remove duplicate rooms based on room_number
		const uniqueRooms = Array.from(
			new Map(hotelRooms.map((room) => [room["room_number"], room])).values()
		);

		getHotelRooms(user._id, hotelDetails._id).then((existingRoomsData) => {
			if (existingRoomsData && existingRoomsData.error) {
				console.error(existingRoomsData.error, "Error rendering");
			} else {
				// Filter out rooms that have already been added
				const roomsToAdd = uniqueRooms.filter(
					(newRoom) =>
						!existingRoomsData.some(
							(existingRoom) => existingRoom.room_number === newRoom.room_number
						)
				);

				roomsToAdd.forEach((room, index) => {
					setTimeout(() => {
						setCurrentAddingRoom(room.room_number);
						createRooms(user._id, token, room).then((data) => {
							if (data && data.error) {
								console.error(data.error);
							} else {
								if (index === roomsToAdd.length - 1) {
									// Reset after the last room addition
									setCurrentAddingRoom(null);
									window.location.reload(false);
								}
							}
						});
					}, 2500 * index); // Delay each creation by 2.5 seconds
				});
			}
		});
	};

	useEffect(() => {
		if (modalVisible && clickedFloor) {
			const updatedRoomCountDetails = processRoomsData(
				hotelRooms,
				clickedFloor
			);

			setFloorDetails((prevDetails) => ({
				...prevDetails,
				roomCountDetails: {
					...prevDetails.roomCountDetails,
					...updatedRoomCountDetails,
				},
			}));
		}
	}, [modalVisible, hotelRooms, clickedFloor]);

	return (
		<HotelManagerDashboardWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
			isArabic={chosenLanguage === "Arabic"}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='AdminDasboard'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='AdminDasboard'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					)}
				</div>

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

					<div
						className='row text-center'
						style={{
							justifyContent: "center",
						}}
					>
						<div
							style={isActive(websiteMenu, "Overview")}
							className='menuItems col-md-4 col-5 my-3'
							onClick={() => setWebsiteMenu("Overview")}
						>
							<Link
								onClick={() => setWebsiteMenu("Overview")}
								style={{
									color: websiteMenu === "Overview" ? "white" : "",
								}}
								to='#'
							>
								<i className='fa fa-plus mx-1'></i>
								{chosenLanguage === "Arabic" ? "ملخص" : "HOTEL OVERVIEW"}
							</Link>
						</div>

						<div
							style={isActive(websiteMenu, "Operations")}
							className='menuItems col-md-4 col-5 my-3'
							onClick={() => setWebsiteMenu("Operations")}
						>
							<Link
								style={{
									color: websiteMenu === "Operations" ? "white" : "",
								}}
								onClick={() => setWebsiteMenu("Operations")}
								to='#'
							>
								<i className='fa fa-edit mx-1'></i>
								{chosenLanguage === "Arabic"
									? "HOTEL HEAT MAP"
									: "HOTEL HEAT MAP"}
							</Link>
						</div>

						<div
							style={isActive(websiteMenu, "general")}
							className='menuItems col-md-4 col-5 my-3'
							onClick={() => setWebsiteMenu("general")}
						>
							<Link
								style={{
									color: websiteMenu === "general" ? "white" : "",
								}}
								onClick={() => setWebsiteMenu("general")}
								to='#'
							>
								<i className='fa-solid fa-house-medical mx-1'></i>
								{chosenLanguage === "Arabic"
									? "GENERAL OVERVIEW"
									: "GENERAL OVERVIEW"}
							</Link>
						</div>
					</div>

					<div className='container-wrapper'>
						{websiteMenu === "Overview" ? (
							<HotelOverview
								hotelRooms={hotelRooms}
								setHotelRooms={setHotelRooms}
								hotelDetails={hotelDetails}
								values={values}
								addRooms={addRooms}
								currentAddingRoom={currentAddingRoom}
								alreadyAddedRooms={alreadyAddedRooms}
								floorDetails={floorDetails}
								setFloorDetails={setFloorDetails}
								modalVisible={modalVisible}
								setModalVisible={setModalVisible}
								modalVisible2={modalVisible2}
								setModalVisible2={setModalVisible2}
								clickedFloor={clickedFloor}
								setClickedFloor={setClickedFloor}
								clickedRoom={clickedRoom}
								setClickedRoom={setClickedRoom}
							/>
						) : websiteMenu === "Operations" && hotelRooms.length > 0 ? (
							<HotelHeatMap
								hotelRooms={hotelRooms}
								hotelDetails={hotelDetails}
								start_date={moment().subtract(1, "days").format("YYYY-MM-DD")}
								end_date={moment().add(15, "days").format("YYYY-MM-DD")}
								allReservations={allReservations}
							/>
						) : websiteMenu === "general" ? (
							<GeneralOverview
								chosenLanguage={chosenLanguage}
								hotelDetails={hotelDetails}
							/>
						) : null}
					</div>
				</div>
			</div>
		</HotelManagerDashboardWrapper>
	);
};

export default HotelManagerDashboard;

const HotelManagerDashboardWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 75%" : "17% 75%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	tr {
		text-align: ${(props) => (props.isArabic ? "right" : "")};
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
