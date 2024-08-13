import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Tooltip, Modal } from "antd";
import moment from "moment";
import HotelMapCards from "./HotelMapCards";
import HotelMapFilters from "./HotelMapFilters";

const HotelHeatMap = ({
	hotelRooms,
	hotelDetails,
	start_date,
	end_date,
	allReservations,
	chosenLanguage,
}) => {
	const [selectedRoomType, setSelectedRoomType] = useState(null);
	const [selectedAvailability, setSelectedAvailability] = useState(null);
	const [selectedFloor, setSelectedFloor] = useState(null);
	const [fixIt, setFixIt] = useState(false);
	const [isBedModalVisible, setIsBedModalVisible] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [bookedBeds, setBookedBeds] = useState([]);
	const [selectedRoomStatus, setSelectedRoomStatus] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			const currentPosition = window.scrollY;
			setFixIt(currentPosition > 100);
		};

		// Add event listener
		window.addEventListener("scroll", handleScroll);

		// Clean up
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const isRoomBooked = (roomId, roomType, bedsNumber) => {
		if (!start_date || !end_date) return false;

		const startDate = moment(start_date);
		const endDate = moment(end_date);

		if (roomType === "individualBed") {
			const bookedBedsTemp = [];
			const isBooked = allReservations.some((reservation) => {
				const reservationStart = moment(reservation.checkin_date);
				const reservationEnd = moment(reservation.checkout_date);

				const overlap =
					startDate.isBefore(reservationEnd) &&
					endDate.isAfter(reservationStart);

				if (overlap) {
					const bookedBeds = reservation.bedNumber || [];
					bookedBedsTemp.push(...bookedBeds);
					const allBedsBooked = bedsNumber.every((bed) =>
						bookedBeds.includes(bed)
					);
					return allBedsBooked;
				}

				return false;
			});
			return { isBooked, bookedBedsTemp };
		} else {
			const isBooked = allReservations.some((reservation) => {
				const reservationStart = moment(reservation.checkin_date);
				const reservationEnd = moment(reservation.checkout_date);

				return (
					startDate.isBefore(reservationEnd) &&
					endDate.isAfter(reservationStart) &&
					reservation.roomId.some((room) => room._id === roomId)
				);
			});
			return { isBooked, bookedBedsTemp: [] };
		}
	};

	const { hotelFloors, parkingLot } = hotelDetails;
	const floors = Array.from({ length: hotelFloors }, (_, index) => index + 1); // Ascending order
	const floorsDesc = [...floors].reverse(); // Descending order for display on the canvas

	const filteredRooms =
		hotelRooms &&
		hotelRooms.filter((room) => {
			const isAvailabilityMatch =
				selectedAvailability === null ||
				(selectedAvailability === "occupied" &&
					isRoomBooked(room._id, room.room_type, room.bedsNumber).isBooked) ||
				(selectedAvailability === "vacant" &&
					!isRoomBooked(room._id, room.room_type, room.bedsNumber).isBooked);
			const isRoomTypeMatch =
				selectedRoomType === null || room.room_type === selectedRoomType;
			const isFloorMatch =
				selectedFloor === null || room.floor === selectedFloor;
			const isRoomStatusMatch =
				selectedRoomStatus === null ||
				(selectedRoomStatus === "clean" && room.cleanRoom) ||
				(selectedRoomStatus === "dirty" && !room.cleanRoom);
			return (
				isAvailabilityMatch &&
				isRoomTypeMatch &&
				isFloorMatch &&
				isRoomStatusMatch
			);
		});

	const distinctRoomTypesWithColors =
		hotelRooms &&
		hotelRooms.reduce((accumulator, room) => {
			if (!accumulator.some((item) => item.room_type === room.room_type)) {
				accumulator.push({
					room_type: room.room_type,
					roomColorCode: room.roomColorCode,
				});
			}
			return accumulator;
		}, []);

	const handleRoomClick = (room) => {
		const { isBooked, bookedBedsTemp } = isRoomBooked(
			room._id,
			room.room_type,
			room.bedsNumber
		);

		if (room.room_type === "individualBed" && !isBooked) {
			setBookedBeds(bookedBedsTemp);
			setSelectedRoom(room);
			setIsBedModalVisible(true);
		}
	};

	const handleFilterChange = (filterType, value) => {
		if (filterType === "availability") {
			setSelectedAvailability(value);
		} else if (filterType === "roomType") {
			setSelectedRoomType(value);
		} else if (filterType === "floor") {
			setSelectedFloor(value);
		} else if (filterType === "roomStatus") {
			setSelectedRoomStatus(value);
		}
	};

	const handleResetFilters = () => {
		setSelectedAvailability(null);
		setSelectedRoomType(null);
		setSelectedFloor(null);
		setSelectedRoomStatus(null);
	};

	const getRoomImage = (roomType) => {
		const room = hotelDetails.roomCountDetails[roomType];
		if (room && room.photos && room.photos.length > 0) {
			return room.photos[0].url;
		}
		return null;
	};

	return (
		<HotelOverviewWrapper fixIt={fixIt}>
			<div dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
				<HotelMapCards chosenLanguage={chosenLanguage} />
			</div>
			<div dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
				<HotelMapFilters
					chosenLanguage={chosenLanguage}
					distinctRoomTypesWithColors={distinctRoomTypesWithColors}
					floors={floors}
					handleFilterChange={handleFilterChange}
					handleResetFilters={handleResetFilters}
					selectedAvailability={selectedAvailability}
					selectedRoomType={selectedRoomType}
					selectedFloor={selectedFloor}
					selectedRoomStatus={selectedRoomStatus}
				/>
			</div>
			<div className='canvas-grid'>
				<div>
					<FloorsContainer>
						{selectedFloor === null
							? floorsDesc.map((floor, index) => (
									<Floor key={index} delay={index * 0.3}>
										<h2
											className='mb-4'
											style={{
												fontWeight: "bold",
												fontSize: "1.5rem",
												color: "#4a4a4a",
											}}
										>
											{chosenLanguage === "Arabic" ? "الطابق" : "Floor"} {floor}
										</h2>
										<div style={{ display: "flex", flexWrap: "wrap" }}>
											{filteredRooms &&
												filteredRooms
													.filter((room) => room.floor === floor)
													.map((room, idx) => {
														const { isBooked } = isRoomBooked(
															room._id,
															room.room_type,
															room.bedsNumber
														);
														const roomImage = getRoomImage(room.room_type);
														return (
															<Tooltip
																title={
																	<div
																		style={{
																			textAlign: "center",
																			color: "darkgrey",
																		}}
																	>
																		{roomImage && (
																			<img
																				src={roomImage}
																				alt={room.room_type}
																				style={{
																					width: "100%",
																					marginBottom: "5px",
																				}}
																			/>
																		)}
																		<div>Room #: {room.room_number}</div>
																		<div
																			style={{ textTransform: "capitalize" }}
																		>
																			Room Type: {room.room_type}
																		</div>
																		<div>
																			Occupied: {isBooked ? "Yes" : "No"}
																		</div>
																		<div>
																			Clean: {room.cleanRoom ? "Yes" : "No"}
																		</div>
																	</div>
																}
																key={idx}
																overlayStyle={{ zIndex: 100000000 }}
																color='white'
															>
																<RoomSquare
																	key={idx}
																	color={room.roomColorCode}
																	picked={""}
																	reserved={isBooked}
																	style={{
																		cursor: isBooked
																			? "not-allowed"
																			: room.room_type === "individualBed"
																			  ? "pointer"
																			  : "default",
																		opacity: isBooked ? 0.5 : 1,
																		textDecoration: isBooked
																			? "line-through"
																			: "none",
																	}}
																	onClick={() => handleRoomClick(room)}
																>
																	{room.room_number}
																</RoomSquare>
															</Tooltip>
														);
													})}
										</div>
									</Floor>
							  ))
							: floorsDesc
									.filter((floor) => floor === selectedFloor)
									.map((floor, index) => (
										<Floor key={index} delay={index * 0.3}>
											<h2
												className='mb-4'
												style={{ fontWeight: "bolder", fontSize: "1.3rem" }}
											>
												{chosenLanguage === "Arabic" ? "الطابق" : "Floor"}{" "}
												{floor}
											</h2>
											<div style={{ display: "flex", flexWrap: "wrap" }}>
												{filteredRooms &&
													filteredRooms
														.filter((room) => room.floor === floor)
														.map((room, idx) => {
															const { isBooked } = isRoomBooked(
																room._id,
																room.room_type,
																room.bedsNumber
															);
															const roomImage = getRoomImage(room.room_type);
															return (
																<Tooltip
																	title={
																		<div style={{ textAlign: "center" }}>
																			{roomImage && (
																				<img
																					src={roomImage}
																					alt={room.room_type}
																					style={{
																						width: "100px",
																						marginBottom: "5px",
																					}}
																				/>
																			)}
																			<div>Room #: {room.room_number}</div>
																			<div>Room Type: {room.room_type}</div>
																			<div>
																				Occupied: {isBooked ? "Yes" : "No"}
																			</div>
																			<div>
																				Clean: {room.cleanRoom ? "Yes" : "No"}
																			</div>
																		</div>
																	}
																	key={idx}
																>
																	<RoomSquare
																		key={idx}
																		color={room.roomColorCode}
																		picked={""}
																		reserved={isBooked}
																		style={{
																			cursor: isBooked
																				? "not-allowed"
																				: room.room_type === "individualBed"
																				  ? "pointer"
																				  : "default",
																			opacity: isBooked ? 0.5 : 1,
																			textDecoration: isBooked
																				? "line-through"
																				: "none",
																		}}
																		onClick={() => handleRoomClick(room)}
																	>
																		{room.room_number}
																	</RoomSquare>
																</Tooltip>
															);
														})}
											</div>
										</Floor>
									))}
						{parkingLot && <ParkingLot>Parking Lot</ParkingLot>}
					</FloorsContainer>
				</div>
			</div>

			<Modal
				title={
					<span>
						(
						<span
							style={{
								fontWeight: "bolder",
								textTransform: "capitalize",
								color: "#00003d",
							}}
						>
							{selectedRoom?.room_number}
						</span>
						)
					</span>
				}
				open={isBedModalVisible}
				onOk={() => setIsBedModalVisible(false)}
				onCancel={() => setIsBedModalVisible(false)}
			>
				<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
					{selectedRoom?.bedsNumber.map((bed, index) => (
						<BedSquare key={index} booked={bookedBeds.includes(bed)}>
							{bed}
						</BedSquare>
					))}
				</div>
			</Modal>
		</HotelOverviewWrapper>
	);
};

export default HotelHeatMap;

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HotelOverviewWrapper = styled.div`
	margin-top: 30px;
	.ant-tooltip-content {
		z-index: 10000000 !important;
	}

	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
	}

	.canvas-grid {
		display: grid;
		grid-template-columns: 95% 5%;
	}

	.colors-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr); // Two columns layout
		gap: 10px;
		margin-left: 20px; // Adjust based on your layout
		position: sticky;
		top: 0;
		align-self: start;
		position: ${(props) => (props.fixIt ? "fixed" : "")};
		top: ${(props) => (props.fixIt ? "20%" : "")};
		left: ${(props) => (props.fixIt ? "2%" : "")};
	}
`;

const FloorsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Floor = styled.div`
	margin: 10px;
	padding: 30px;
	background-color: rgba(237, 237, 237, 0.3);
	border: 1px solid rgba(237, 237, 237, 1);
	width: 100%;
	text-align: center;
	font-weight: bold;
	cursor: pointer;
	animation: ${fadeIn} 0.5s ease forwards;
	animation-delay: ${({ delay }) => delay}s;
	opacity: 0;
	font-size: 1.1rem;
`;

const ParkingLot = styled.div`
	margin: 10px;
	padding: 40px;
	background-color: lightgreen;
	border: 1px solid #ccc;
	width: 75%;
	text-align: center;
	font-weight: bold;
`;

const RoomSquare = styled.div`
	position: relative;
	width: ${({ picked }) => (picked ? "40px" : "35px")};
	height: ${({ picked }) => (picked ? "40px" : "35px")};
	background-color: ${({ color, picked }) => (picked ? "#000" : color)};
	border: 1px solid #000;
	color: ${({ picked, reserved }) =>
		picked ? "lightgrey" : reserved ? "black" : "white"};
	margin: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${({ picked }) => (picked ? "0.9rem" : "0.7rem")};
	cursor: ${({ reserved }) => (reserved ? "not-allowed" : "pointer")};
	transition:
		width 1s,
		height 1s,
		background-color 1s,
		color 1s;

	${({ reserved }) =>
		reserved &&
		`
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(173, 173, 173, 0.5) 10px,
        rgba(173, 173, 173, 0.5) 20px
      );
      pointer-events: none; // Disable interactions
    }
  `}
`;

const BedSquare = styled.div`
	width: 70px;
	height: 100px;
	background-color: ${({ booked }) => (booked ? "#e7e7e7" : "#f0f0f0")};
	border: 1px solid #000;
	color: ${({ booked }) => (booked ? "black" : "black")};
	margin: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.9rem;
	cursor: ${({ booked }) => (booked ? "not-allowed" : "pointer")};
	transition: all 0.3s;
	margin: auto;
	position: relative;

	&:hover {
		background-color: ${({ booked }) => (booked ? "#e7e7e7" : "#dcdcdc")};
	}

	${({ booked }) =>
		booked &&
		`
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            border-top: 1px solid black;
            transform: translateY(-50%);
            width: 100%;
        }
    `}
`;
