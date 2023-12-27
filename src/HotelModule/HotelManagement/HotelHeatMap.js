import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { roomTypeColors } from "../../AdminModule/NewHotels/Assets";
import moment from "moment";

const HotelHeatMap = ({
	hotelRooms,
	hotelDetails,
	start_date,
	end_date,
	allReservations,
}) => {
	const [selectedRoomType, setSelectedRoomType] = useState(null);

	const { hotelFloors, parkingLot } = hotelDetails;
	const floors = Array.from(
		{ length: hotelFloors },
		(_, index) => hotelFloors - index
	);

	const filteredRooms = selectedRoomType
		? hotelRooms.filter((room) => room.room_type === selectedRoomType)
		: hotelRooms;

	const handleRoomTypeClick = (roomType) => {
		setSelectedRoomType(roomType);
	};

	const handleSelectAllClick = () => {
		setSelectedRoomType(null); // Reset room type filter
	};

	const isRoomBooked = (roomId) => {
		if (!start_date || !end_date) return false;

		const startDate = moment(start_date);
		const endDate = moment(end_date);

		return allReservations.some((reservation) => {
			const reservationStart = moment(reservation.start_date);
			const reservationEnd = moment(reservation.end_date);

			return (
				reservation.roomId.includes(roomId) &&
				startDate.isBefore(reservationEnd) &&
				endDate.isAfter(reservationStart)
			);
		});
	};

	return (
		<HotelOverviewWrapper>
			<div className='colors-grid mt-3'>
				<div
					style={{ textAlign: "center", cursor: "pointer" }}
					onClick={handleSelectAllClick}
				>
					<div
						style={{
							width: "20px",
							height: "20px",
							backgroundColor: "grey",
							margin: "0 auto",
							marginBottom: "5px",
						}}
					></div>
					<span style={{ textTransform: "capitalize", fontSize: "13px" }}>
						Select All
					</span>
				</div>
				{Object.entries(roomTypeColors).map(([roomType, color], i) => (
					<div
						key={i}
						style={{ textAlign: "center", cursor: "pointer" }}
						onClick={() => handleRoomTypeClick(roomType)}
					>
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
				{floors.map((floor, index) => (
					<Floor key={index} delay={index * 0.3}>
						Floor {floor}
						<div style={{ display: "flex", flexWrap: "wrap" }}>
							{filteredRooms &&
								filteredRooms
									.filter((room) => room.floor === floor)
									.map((room, idx) => {
										const roomIsBooked = isRoomBooked(room._id);
										return (
											<RoomSquare
												key={idx}
												color={roomIsBooked ? "#e7e7e7" : room.roomColorCode}
												picked={false}
												reserved={roomIsBooked}
												style={{
													pointerEvents: roomIsBooked ? "none" : "auto",
												}}
											>
												<div className='room-info'>
													{roomIsBooked && (
														<div className='reservation-indicator'>Res.</div>
													)}
													<div className='room-number'>{room.room_number}</div>
												</div>
											</RoomSquare>
										);
									})}
						</div>
					</Floor>
				))}
				{parkingLot && <ParkingLot>Parking Lot</ParkingLot>}
			</FloorsContainer>
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

	.room-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.reservation-indicator {
		font-size: 0.7rem;
		color: red;
		position: absolute;
		top: -3px; // Adjust as needed
		left: 50%;
		transform: translateX(-50%);
		z-index: 1; // Ensure it's above the room number
	}

	.room-number {
		z-index: 0;
	}
`;
