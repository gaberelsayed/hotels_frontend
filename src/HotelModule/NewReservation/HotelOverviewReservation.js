import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { InputNumber, Modal, Table, Tooltip } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import HotelMapFilters from "./HotelMapFilters"; // Ensure this path is correct

const HotelOverviewReservation = ({
	hotelRooms,
	hotelDetails,
	pickedHotelRooms,
	setPickedHotelRooms,
	total_amount,
	setTotal_Amount,
	setPickedRoomPricing,
	pickedRoomPricing,
	start_date,
	end_date,
	allReservations,
	chosenLanguage,
	searchedReservation,
	start_date_Map,
	end_date_Map,
	bedNumber,
	setBedNumber,
	currentRoom,
	setCurrentRoom,
	pricingByDay,
	setPricingByDay,
}) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isBedModalVisible, setIsBedModalVisible] = useState(false);
	const [fixIt, setFixIt] = useState(false);
	const [inheritedPrice, setInheritedPrice] = useState("");
	const [selectedBeds, setSelectedBeds] = useState([]);
	const [bookedBeds, setBookedBeds] = useState([]);
	const [totalAmountPerBed, setTotalAmountPerBed] = useState(0);
	const [overallTotal, setOverallTotal] = useState(0);
	const [selectedRoomType, setSelectedRoomType] = useState(null);
	const [selectedAvailability, setSelectedAvailability] = useState(null);
	const [selectedFloor, setSelectedFloor] = useState(null);
	const [selectedRoomStatus, setSelectedRoomStatus] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			const currentPosition = window.scrollY;
			setFixIt(currentPosition > 900);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {
		if (currentRoom && currentRoom.room_type === "individualBed") {
			const bookedBedsTemp = [];

			allReservations.forEach((reservation) => {
				const startDate = moment(start_date_Map);
				const endDate = moment(end_date_Map);
				const reservationStart = moment(reservation.checkin_date);
				const reservationEnd = moment(reservation.checkout_date);

				const overlap =
					startDate.isBefore(reservationEnd) &&
					endDate.isAfter(reservationStart);

				if (overlap) {
					const bookedBeds = reservation.bedNumber || [];
					bookedBedsTemp.push(...bookedBeds);
				}
			});

			setBookedBeds(bookedBedsTemp);
		}
	}, [currentRoom, start_date_Map, end_date_Map, allReservations]);

	const { hotelFloors, parkingLot } = hotelDetails;
	const floors = Array.from({ length: hotelFloors }, (_, index) => index + 1);
	const floorsDesc = [...floors].reverse(); // Descending order for display on the canvas

	const handleRoomClick = (roomId, show, room) => {
		if (!roomId || !room) return;

		if (isRoomBooked(roomId, room.room_type, room.bedsNumber)) {
			toast.error("Room is booked. Cannot select.");
			return;
		}

		if (pickedHotelRooms.includes(roomId)) {
			handleRoomDeselection(roomId);
		} else {
			setPickedHotelRooms([...pickedHotelRooms, roomId]);
			setCurrentRoom(room);
			showModal(room);
		}
	};

	const handleRoomDeselection = (roomId) => {
		setPickedHotelRooms(pickedHotelRooms.filter((id) => id !== roomId));

		const priceToRemove = pickedRoomPricing.find(
			(pricing) => pricing.roomId === roomId
		)?.chosenPrice;

		if (priceToRemove) {
			setTotal_Amount((prevTotal) =>
				Math.max(prevTotal - Number(priceToRemove), 0)
			);
		}

		setPickedRoomPricing(
			pickedRoomPricing.filter((pricing) => pricing.roomId !== roomId)
		);
	};

	const isRoomBooked = (roomId, roomType, bedsNumber) => {
		if (!start_date_Map || !end_date_Map) return false;

		const startDate = moment(start_date_Map);
		const endDate = moment(end_date_Map);

		if (searchedReservation && searchedReservation.roomId.includes(roomId)) {
			// Allow clicking on the room if it matches the searched reservation
			return false;
		}

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

			return isBooked;
		} else {
			return allReservations.some((reservation) => {
				const reservationStart = moment(reservation.checkin_date);
				const reservationEnd = moment(reservation.checkout_date);

				return (
					startDate.isBefore(reservationEnd) &&
					endDate.isAfter(reservationStart) &&
					reservation.roomId.some((room) => room._id === roomId)
				);
			});
		}
	};

	const showModal = (room) => {
		if (!room) return;
		setCurrentRoom(room);

		if (searchedReservation && searchedReservation.pickedRoomsType) {
			const roomType = searchedReservation.pickedRoomsType.find(
				(r) => r.room_type === room.room_type
			);

			if (
				roomType &&
				roomType.pricingByDay &&
				roomType.pricingByDay.length > 0
			) {
				setPricingByDay(roomType.pricingByDay);
			} else {
				generatePricingTable(room.room_type, start_date, end_date);
			}
		} else {
			generatePricingTable(room.room_type, start_date, end_date);
		}

		setIsModalVisible(true);
	};

	const generatePricingTable = useCallback(
		(roomType, startDate, endDate) => {
			const roomDetails = hotelDetails.roomCountDetails[roomType];
			const pricingRate = roomDetails?.pricingRate || [];
			const basePrice = roomDetails?.price?.basePrice || 0;

			const daysArray = [];
			const currentDate = moment(startDate);

			while (currentDate.isBefore(endDate)) {
				const dateString = currentDate.format("YYYY-MM-DD");
				const pricing = pricingRate.find(
					(price) => price.calendarDate === dateString
				);
				const price = pricing
					? parseFloat(pricing.price)
					: parseFloat(basePrice);
				daysArray.push({ date: dateString, price });
				currentDate.add(1, "day");
			}

			setPricingByDay(daysArray);
		},
		[hotelDetails.roomCountDetails, setPricingByDay]
	);

	const handleInheritPrices = () => {
		if (inheritedPrice) {
			setPricingByDay((prev) =>
				prev.map((day) => ({ ...day, price: parseFloat(inheritedPrice) }))
			);
		}
	};

	const handleOk = () => {
		if (
			currentRoom.room_type === "individualBed" &&
			selectedBeds.length === 0
		) {
			toast.error("Please select at least one bed.");
			return;
		}

		const chosenPrice =
			pricingByDay.reduce((acc, day) => acc + day.price, 0) /
			pricingByDay.length;

		const finalChosenPrice =
			currentRoom.room_type === "individualBed"
				? chosenPrice * selectedBeds.length
				: chosenPrice;

		setPickedRoomPricing([
			...pickedRoomPricing,
			{
				roomId: currentRoom._id,
				chosenPrice: finalChosenPrice,
				pricingByDay,
			},
		]);

		setTotal_Amount((prevTotal) => prevTotal + finalChosenPrice);
		resetState();
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		if (currentRoom && pickedHotelRooms.includes(currentRoom._id)) {
			handleRoomDeselection(currentRoom._id);
		}
		resetState();
		setIsModalVisible(false);
	};

	const handleOkBeds = () => {
		setBedNumber(selectedBeds);
		setOverallTotal(totalAmountPerBed * selectedBeds.length);
		setIsBedModalVisible(false);
	};

	const resetState = () => {
		setCurrentRoom(null);
		setPricingByDay([]);
		setInheritedPrice("");
		setSelectedBeds([]);
		setBookedBeds([]);
		setTotalAmountPerBed(0);
		setOverallTotal(0);
	};

	const handleBedSelection = (bed) => {
		if (bookedBeds.includes(bed)) {
			toast.error("Bed is already booked. Cannot select.");
			return;
		}
		if (selectedBeds.includes(bed)) {
			setSelectedBeds(selectedBeds.filter((b) => b !== bed));
		} else {
			setSelectedBeds([...selectedBeds, bed]);
		}
	};

	useEffect(() => {
		const totalAmount = pricingByDay.reduce((acc, day) => acc + day.price, 0);
		setTotalAmountPerBed(totalAmount);
		setOverallTotal(totalAmount * selectedBeds.length);
	}, [pricingByDay, selectedBeds]);

	const columns = [
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (text, record, index) => (
				<InputNumber
					min={0}
					value={record.price}
					onChange={(value) => {
						const updatedPricingByDay = [...pricingByDay];
						updatedPricingByDay[index].price = value;
						setPricingByDay(updatedPricingByDay);
					}}
				/>
			),
		},
	];

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

	const filteredRooms = hotelRooms.filter((room) => {
		const isAvailabilityMatch =
			selectedAvailability === null ||
			(selectedAvailability === "occupied" &&
				isRoomBooked(room._id, room.room_type, room.bedsNumber)) ||
			(selectedAvailability === "vacant" &&
				!isRoomBooked(room._id, room.room_type, room.bedsNumber));
		const isRoomTypeMatch =
			selectedRoomType === null || room.room_type === selectedRoomType;
		const isFloorMatch = selectedFloor === null || room.floor === selectedFloor;
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

	const getRoomImage = (roomType) => {
		const room = hotelDetails.roomCountDetails[roomType];
		if (room && room.photos && room.photos.length > 0) {
			return room.photos[0].url;
		}
		return null;
	};

	return (
		<HotelOverviewWrapper fixIt={fixIt}>
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
				fromComponent='Taskeen'
			/>
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
																	picked={pickedHotelRooms.includes(room._id)}
																	reserved={isBooked}
																	style={{
																		cursor: isBooked
																			? "not-allowed"
																			: "pointer",
																		opacity: isBooked ? 0.5 : 1,
																		textDecoration: isBooked
																			? "line-through"
																			: "none",
																	}}
																	onClick={() =>
																		handleRoomClick(room._id, true, room)
																	}
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
												style={{
													fontWeight: "bold",
													fontSize: "1.5rem",
													color: "#4a4a4a",
												}}
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
																		picked={pickedHotelRooms.includes(room._id)}
																		reserved={isBooked}
																		style={{
																			cursor: isBooked
																				? "not-allowed"
																				: "pointer",
																			opacity: isBooked ? 0.5 : 1,
																			textDecoration: isBooked
																				? "line-through"
																				: "none",
																		}}
																		onClick={() =>
																			handleRoomClick(room._id, true, room)
																		}
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

					<Modal
						title={
							<span>
								{chosenLanguage === "Arabic"
									? "اختر تسعير الغرفة"
									: "Select Room Pricing"}{" "}
								(
								<span
									style={{
										fontWeight: "bolder",
										textTransform: "capitalize",
										color: "#00003d",
									}}
								>
									{currentRoom?.room_type}
								</span>
								)
							</span>
						}
						open={isModalVisible}
						onOk={handleOk}
						onCancel={handleCancel}
					>
						<InputNumber
							value={inheritedPrice}
							onChange={(value) => setInheritedPrice(value)}
							placeholder='Enter new price to inherit'
							style={{ width: "100%", marginBottom: "10px" }}
						/>
						<div>
							<button
								onClick={handleInheritPrices}
								className='btn btn-success my-2 p-1 w-50'
							>
								Inherit New Prices
							</button>
						</div>

						{currentRoom?.room_type === "individualBed" && (
							<button
								onClick={() => setIsBedModalVisible(true)}
								className='btn btn-secondary my-2 p-1 w-50'
							>
								{chosenLanguage === "Arabic" ? "اختر السرير" : "Select Bed"}
							</button>
						)}

						{selectedBeds && selectedBeds.length > 0 && (
							<div
								style={{ marginBottom: "10px", fontWeight: "bold" }}
								dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
							>
								{chosenLanguage === "Arabic"
									? "الأسرة المختارة"
									: "Selected Beds"}
								: {selectedBeds.join(", ")}
							</div>
						)}

						<Table
							dataSource={pricingByDay}
							columns={columns}
							rowKey='date'
							pagination={false}
						/>

						{currentRoom?.room_type === "individualBed" ? (
							<>
								<div
									style={{ marginTop: "20px" }}
									dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
								>
									<strong>
										{chosenLanguage === "Arabic"
											? "المجموع الكلي لكل سرير"
											: "Total Amount Per Bed"}
										: {totalAmountPerBed} SAR
									</strong>
								</div>
								<div
									style={{ marginTop: "10px", fontWeight: "bold" }}
									dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
								>
									<strong>
										{chosenLanguage === "Arabic"
											? "المجموع الكلي"
											: "Overall Total"}
										: {overallTotal} SAR
									</strong>
								</div>
							</>
						) : (
							<>
								<div
									style={{ marginTop: "20px" }}
									dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
								>
									<strong>
										{chosenLanguage === "Arabic"
											? "المبلغ الإجمالي لكل ليلة"
											: "Total Amount Per Night"}
										:{" "}
										{pricingByDay.length > 0
											? pricingByDay.reduce((acc, day) => acc + day.price, 0) /
													pricingByDay.length &&
											  Number(
													pricingByDay.reduce(
														(acc, day) => acc + day.price,
														0
													) / pricingByDay.length
											  ).toFixed(2)
											: 0}{" "}
										SAR
									</strong>
								</div>
								<div
									style={{ marginTop: "10px", fontWeight: "bold" }}
									dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
								>
									<strong>
										{chosenLanguage === "Arabic"
											? "المبلغ الإجمالي"
											: "Overall Total"}
										:{" "}
										{pricingByDay.length > 0
											? pricingByDay.reduce((acc, day) => acc + day.price, 0) &&
											  pricingByDay
													.reduce((acc, day) => acc + day.price, 0)
													.toFixed(2)
											: 0}{" "}
										SAR
									</strong>
								</div>
							</>
						)}
					</Modal>
					<Modal
						title={
							<span>
								{chosenLanguage === "Arabic" ? "اختر السرير" : "Select Bed"} (
								<span
									style={{
										fontWeight: "bolder",
										textTransform: "capitalize",
										color: "#00003d",
									}}
								>
									{currentRoom?.room_number}
								</span>
								)
							</span>
						}
						open={isBedModalVisible}
						onOk={handleOkBeds}
						onCancel={() => setIsBedModalVisible(false)}
					>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
							{currentRoom?.bedsNumber.map((bed, index) => (
								<BedSquare
									key={index}
									onClick={() => handleBedSelection(bed)}
									selected={selectedBeds.includes(bed)}
									booked={bookedBeds.includes(bed)}
								>
									{bed}
								</BedSquare>
							))}
						</div>
					</Modal>
				</div>
			</div>
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

	.canvas-grid {
		display: grid;
		grid-template-columns: 1fr;
	}

	.colors-grid {
		display: none;
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
	background-color: ${({ selected, booked }) =>
		selected ? "darkgreen" : booked ? "#e7e7e7" : "#f0f0f0"};
	border: 1px solid #000;
	color: ${({ selected, booked }) =>
		selected ? "white" : booked ? "black" : "black"};
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
		background-color: ${({ selected, booked }) =>
			selected ? "darkgreen" : booked ? "#e7e7e7" : "#dcdcdc"};
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
