import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
// eslint-disable-next-line
import { roomTypeColors } from "../../AdminModule/NewHotels/Assets";
import { InputNumber, Modal, Select } from "antd";
import moment from "moment";
const { Option } = Select;

const HotelOverviewReservation = ({
	hotelRooms,
	hotelDetails,
	pickedHotelRooms,
	setPickedHotelRooms,
	total_amount,
	setTotal_Amount,
	setPickedRoomPricing,
	pickedRoomPricing,
	pickedRoomsType,
	setPickedRoomsType,
	start_date,
	end_date,
	allReservations,
	chosenLanguage,
}) => {
	const [selectedRoomType, setSelectedRoomType] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentRoom, setCurrentRoom] = useState(null);
	const [customPrice, setCustomPrice] = useState(null);
	const [selectedPrice, setSelectedPrice] = useState("");

	const { hotelFloors, parkingLot } = hotelDetails;
	const floors = Array.from(
		{ length: hotelFloors },
		(_, index) => hotelFloors - index
	);

	const handleRoomClick = (roomId, show, room) => {
		// eslint-disable-next-line
		let priceToAdd;
		if (pickedHotelRooms.includes(roomId)) {
			setPickedHotelRooms(pickedHotelRooms.filter((id) => id !== roomId));
			// eslint-disable-next-line
			priceToAdd = currentRoom?.room_pricing[selectedPrice];

			var newAmount =
				pickedRoomPricing.filter((room) => room.roomId !== roomId) &&
				pickedRoomPricing
					.filter((room) => room.roomId !== roomId)
					.map((ii) => ii.chosenPrice);

			setTotal_Amount(
				newAmount.reduce(
					(accumulator, currentValue) => accumulator + Number(currentValue),
					0
				)
			);

			setPickedRoomPricing(
				pickedRoomPricing.filter((room) => room.roomId !== roomId)
			);
			updatePickedRoomsType(room, false);
		} else {
			setPickedHotelRooms([...pickedHotelRooms, roomId]);
			setCurrentRoom(room);
			showModal(room); // Open the modal for room pricing
		}
	};

	const handleRoomTypeClick = (roomType) => {
		setSelectedRoomType(roomType);
	};

	const handleSelectAllClick = () => {
		setSelectedRoomType(null); // Reset room type filter
	};

	const filteredRooms = selectedRoomType
		? hotelRooms.filter((room) => room.room_type === selectedRoomType)
		: hotelRooms;

	const showModal = (room) => {
		setCurrentRoom(room);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		let priceToAdd = null;
		if (selectedPrice === "custom" && customPrice) {
			priceToAdd = customPrice;
		} else if (selectedPrice) {
			priceToAdd = currentRoom?.room_pricing[selectedPrice];
		}

		if (priceToAdd !== null) {
			setPickedRoomPricing([
				...pickedRoomPricing,
				{ roomId: currentRoom._id, chosenPrice: priceToAdd },
			]);
			setTotal_Amount((prevTotal) => prevTotal + Number(priceToAdd));
			updatePickedRoomsType(currentRoom, priceToAdd, true); // Pass the correct price
		} else {
			handleRoomDeselection();
		}

		setIsModalVisible(false);
	};

	const handlePriceChange = (value) => {
		setSelectedPrice(value);
		if (value !== "custom") {
			setCustomPrice(null); // Reset custom price if a preset price is selected
		}
	};

	const handleCancel = () => {
		handleRoomDeselection();
		setIsModalVisible(false);
		setCustomPrice(null); // Reset custom price
	};

	const handleRoomDeselection = () => {
		if (currentRoom) {
			// Deselect the room by removing it from pickedHotelRooms
			setPickedHotelRooms(
				pickedHotelRooms.filter((id) => id !== currentRoom._id)
			);

			// Update total amount by subtracting the price of the deselected room
			const priceToRemove = pickedRoomPricing.find(
				(pricing) => pricing.roomId === currentRoom._id
			)?.chosenPrice;
			if (priceToRemove) {
				setTotal_Amount((prevTotal) => prevTotal - Number(priceToRemove));
			}

			// Remove the room's pricing information from pickedRoomPricing
			setPickedRoomPricing(
				pickedRoomPricing.filter(
					(pricing) => pricing.roomId !== currentRoom._id
				)
			);

			updatePickedRoomsType(currentRoom, false);
		}
	};

	const isRoomBooked = (roomId) => {
		if (!start_date || !end_date) return false;

		const startDate = moment(start_date);
		const endDate = moment(end_date);

		return allReservations.some((reservation) => {
			const reservationStart = moment(reservation.checkin_date);
			const reservationEnd = moment(reservation.checkout_date);

			return (
				reservation.roomId.includes(roomId) &&
				startDate.isBefore(reservationEnd) &&
				endDate.isAfter(reservationStart)
			);
		});
	};

	const distinctRoomTypesWithColors =
		hotelRooms &&
		hotelRooms.reduce((accumulator, room) => {
			// Check if this room_type is already processed
			if (!accumulator.some((item) => item.room_type === room.room_type)) {
				accumulator.push({
					room_type: room.room_type,
					roomColorCode: room.roomColorCode,
				});
			}
			return accumulator;
		}, []);

	const updatePickedRoomsType = (room, chosenPrice, isAdding) => {
		setPickedRoomsType((prev) => {
			const existingTypeIndex = prev.findIndex(
				(type) => type.room_type === room.room_type
			);

			if (existingTypeIndex >= 0) {
				const updatedTypes = [...prev];
				if (isAdding) {
					updatedTypes[existingTypeIndex].count += 1;
				} else {
					updatedTypes[existingTypeIndex].count -= 1;
					if (updatedTypes[existingTypeIndex].count === 0) {
						updatedTypes.splice(existingTypeIndex, 1);
					}
				}
				return updatedTypes;
			} else if (isAdding) {
				return [
					...prev,
					{
						room_type: room.room_type,
						chosenPrice: chosenPrice,
						count: 1,
					},
				];
			} else {
				return prev;
			}
		});
	};

	// console.log(pickedRoomsType, "pickedRoomsTypepickedRoomsTypepickedRoomsType");
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
						{chosenLanguage === "Arabic" ? "اختر الكل" : "Select All"}
					</span>
				</div>
				{distinctRoomTypesWithColors &&
					distinctRoomTypesWithColors.map((room, i) => (
						<div
							key={i}
							style={{
								textAlign: "center",
								cursor: "pointer",
							}}
							onClick={() => handleRoomTypeClick(room.room_type)}
						>
							<div
								style={{
									width: "20px",
									height: "20px",
									backgroundColor: room.roomColorCode,
									margin: "0 auto",
									marginBottom: "5px",
								}}
							></div>
							<span style={{ textTransform: "capitalize", fontSize: "13px" }}>
								{room.room_type.replace(/([A-Z])/g, " $1").trim()}
							</span>
						</div>
					))}
			</div>
			<FloorsContainer>
				{floors.map((floor, index) => (
					<Floor key={index} delay={index * 0.3}>
						<h2 className='mb-4'>
							{chosenLanguage === "Arabic" ? "الطابق" : "Floor"} {floor}
						</h2>
						<div style={{ display: "flex", flexWrap: "wrap" }}>
							{filteredRooms &&
								filteredRooms
									.filter((room) => room.floor === floor)
									.map((room, idx) => {
										const roomIsBooked = isRoomBooked(room._id);
										return (
											<RoomSquare
												key={idx}
												color={
													roomIsBooked
														? "#e7e7e7"
														: pickedHotelRooms.includes(room._id)
														  ? "darkgreen"
														  : room.roomColorCode
												}
												onClick={() => {
													if (!roomIsBooked) {
														handleRoomClick(room._id, true, room);
													}
												}}
												picked={pickedHotelRooms.includes(room._id)}
												reserved={roomIsBooked}
												style={{
													pointerEvents: roomIsBooked ? "none" : "auto",
												}}
											>
												{room.room_number}
											</RoomSquare>
										);
									})}
						</div>
					</Floor>
				))}
				{parkingLot && <ParkingLot>Parking Lot</ParkingLot>}
			</FloorsContainer>

			<Modal
				title='Select Room Pricing'
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Select
					defaultValue=''
					style={{ width: "100%" }}
					onChange={handlePriceChange}
				>
					<Option value=''>Please Select</Option>
					<Option value='basePrice'>
						Base Price: {currentRoom?.room_pricing.basePrice}
					</Option>
					<Option value='seasonPrice'>
						Season Price: {currentRoom?.room_pricing.seasonPrice}
					</Option>
					<Option value='weekendPrice'>
						Weekend Price: {currentRoom?.room_pricing.weekendPrice}
					</Option>
					<Option value='lastMinuteDealPrice'>
						Last Minute Deal Price:{" "}
						{currentRoom?.room_pricing.lastMinuteDealPrice}
					</Option>
					<Option value='custom'>
						{chosenLanguage === "Arabic" ? "" : ""}Custom Price
					</Option>
				</Select>
				{selectedPrice === "custom" && (
					<InputNumber
						value={customPrice}
						onChange={setCustomPrice}
						style={{ width: "100%", marginTop: "10px" }}
						min={0} // Set minimum value if needed
					/>
				)}
			</Modal>
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
			auto-fit,
			minmax(20px, 1fr)
		); // Adjust 'minmax' as needed
		gap: 2px;
		justify-content: center; // Horizontally center grid items
		align-items: center; // Vertically center grid items
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
`;
