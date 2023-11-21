import React from "react";
import styled, { keyframes } from "styled-components";
import { roomTypeColors } from "../../AdminModule/NewHotels/Assets";

const HotelOverviewReservation = ({ hotelRooms, hotelDetails }) => {
	const { hotelFloors, parkingLot } = hotelDetails;
	const floors = Array.from(
		{ length: hotelFloors },
		(_, index) => hotelFloors - index
	);

	return (
		<HotelOverviewWrapper>
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
					return (
						<Floor key={index} delay={index * 0.3}>
							Floor {floor}{" "}
							<div style={{ display: "flex", flexWrap: "wrap" }}>
								{hotelRooms &&
									hotelRooms
										.filter((room) => room.floor === floor)
										.map((room, idx) => (
											<RoomSquare key={idx} color={room.roomColorCode}>
												{room.room_number}
											</RoomSquare>
										))}
							</div>
							{/* Check if the current floor has any rooms */}
						</Floor>
					);
				})}
				{parkingLot && <ParkingLot>Parking Lot</ParkingLot>}
			</FloorsContainer>
		</HotelOverviewWrapper>
	);
};

export default HotelOverviewReservation;

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HotelOverviewWrapper = styled.div`
	margin-top: 30px;

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
