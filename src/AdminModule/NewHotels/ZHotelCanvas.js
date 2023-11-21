import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import FloorsModal from "./FloorsModal";
import ZSingleRoomModal from "./ZSingleRoomModal";
import { Spin } from "antd";
import { roomTypeColors } from "./Assets";

const ZHotelCanvas = ({
	floorDetails,
	setFloorDetails,
	hotelDetails,
	rooms,
	setRooms,
	values,
	addRooms,
	currentAddingRoom,
	modalVisible2,
	setModalVisible2,
	helperRender,
	setHelperRender,
}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [clickedFloor, setClickedFloor] = useState("");
	const [clickedRoom, setClickedRoom] = useState("");
	const { hotelFloors, parkingLot, hotelName } = hotelDetails;
	const floors = Array.from(
		{ length: hotelFloors },
		(_, index) => hotelFloors - index
	);

	const generalRoomFeatures = [
		{
			bedSize: "Double",
			view: "city view",
			bathroom: ["bathtub", "jacuzzi"],
			airConditiong: "climate control features",
			television: "Smart TV",
			internet: ["WiFi", "Ethernet Connection"],
			Minibar: ["Refrigerator with drinks & snacks"],
			smoking: false,
		},
	];

	// console.log(rooms, "rooms canvas");

	return (
		<ZHotelCanvasWrapper>
			<FloorsModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				clickedFloor={clickedFloor}
				rooms={rooms}
				setRooms={setRooms}
				floorDetails={floorDetails}
				setFloorDetails={setFloorDetails}
				generalRoomFeatures={generalRoomFeatures}
				hotelDetails={hotelDetails}
				values={values}
			/>

			<ZSingleRoomModal
				modalVisible={modalVisible2}
				setModalVisible={setModalVisible2}
				clickedFloor={clickedFloor}
				clickedRoom={clickedRoom}
				setClickedRoom={setClickedRoom}
				rooms={rooms}
				setRooms={setRooms}
				setHelperRender={setHelperRender}
				helperRender={helperRender}
			/>

			<h3 style={{ textTransform: "capitalize" }}>
				Hotel Layout Builder ({hotelName})
			</h3>

			<div className='colors-grid mt-3'>
				{Object.entries(roomTypeColors).map(([roomType, color], i) => (
					<div className='' key={i} style={{ textAlign: "center" }}>
						<div
							style={{
								width: "20px",
								height: "20px",
								backgroundColor: color,
								margin: "0 auto",
								marginBottom: "5px",
							}}
						></div>
						<span style={{ textTransform: "capitalize", fontSize: "13px" }}>
							{roomType.replace(/([A-Z])/g, " $1").trim()}
						</span>
					</div>
				))}
			</div>
			<FloorsContainer>
				{floors.map((floor, index) => {
					const roomsOnFloor = rooms.filter(
						(room) => room.floor === floor && !room._id
					);
					// Determine the floor number from the current adding room
					let currentAddingFloor = null;
					if (currentAddingRoom) {
						currentAddingFloor =
							currentAddingRoom.length === 4
								? parseInt(currentAddingRoom.substring(0, 2))
								: parseInt(currentAddingRoom.charAt(0));
					}

					return (
						<Floor key={index} delay={index * 0.3}>
							Floor {floor}{" "}
							<div style={{ display: "flex", flexWrap: "wrap" }}>
								{rooms
									.filter((room) => room.floor === floor)
									.map((room, idx) => (
										<RoomSquare
											key={idx}
											color={room.roomColorCode}
											onClick={() => {
												setClickedRoom(room);
												setClickedFloor(floor);
												if (room && room._id) {
													setModalVisible2(true);
												}
											}}
										>
											{room.room_number}
										</RoomSquare>
									))}
							</div>
							<span
								className='mx-2'
								style={{ fontSize: "13px", textDecoration: "underline" }}
								onClick={() => {
									setClickedFloor(floor);
									setModalVisible(true);
								}}
							>
								(Please Click Here To Update The Rooms)
							</span>
							{/* Check if the current floor has any rooms */}
							{roomsOnFloor.length > 0 && (
								<>
									<div className='mt-3'>
										<button className='btn btn-success' onClick={addRooms}>
											Add Rooms...
										</button>

										{Number(currentAddingFloor) === Number(floor) && (
											<div style={{ textAlign: "center", margin: "20px" }}>
												<Spin />
												<p>Adding room #{currentAddingRoom}...</p>
											</div>
										)}
									</div>
								</>
							)}
						</Floor>
					);
				})}
				{parkingLot && <ParkingLot>Parking Lot</ParkingLot>}
			</FloorsContainer>
		</ZHotelCanvasWrapper>
	);
};

export default ZHotelCanvas;

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ZHotelCanvasWrapper = styled.div`
	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
	}

	.colors-grid {
		display: grid;
		grid-template-columns: repeat(
			13,
			1fr
		); /* Creates four columns of equal width */
		gap: 2px; /* Optional: Adds some space between grid items */
	}
`;

const FloorsContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Floor = styled.div`
	margin: 10px;
	padding: 50px;
	background-color: lightblue;
	border: 1px solid #ccc;
	width: 85%;
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
	width: 70%;
	text-align: center;
	font-weight: bold;
`;

const RoomSquare = styled.div`
	width: 35px;
	height: 35px;
	background-color: ${({ color }) =>
		color || "#ddd"}; // Default to a light grey if no color is provided
	border: 1px solid #000;
	color: white;
	margin: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.7rem;
`;
