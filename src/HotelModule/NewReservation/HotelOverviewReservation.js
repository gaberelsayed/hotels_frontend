import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { InputNumber, Modal, Table, Tooltip } from "antd";
import moment from "moment";
import { toast } from "react-toastify";

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
	const floors = Array.from(
		{ length: hotelFloors },
		(_, index) => hotelFloors - index
	);

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
			setTotal_Amount((prevTotal) => prevTotal - Number(priceToRemove));
		}

		setPickedRoomPricing(
			pickedRoomPricing.filter((pricing) => pricing.roomId !== roomId)
		);
	};

	const isRoomBooked = (roomId, roomType, bedsNumber) => {
		if (!start_date_Map || !end_date_Map) return false;

		const startDate = moment(start_date_Map);
		const endDate = moment(end_date_Map);

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

	const handleSelectAllClick = () => {
		setPickedHotelRooms(hotelRooms.map((room) => room._id));
	};

	const handleRoomTypeClick = (roomType) => {
		setPickedHotelRooms(
			hotelRooms
				.filter((room) => room.room_type === roomType)
				.map((room) => room._id)
		);
	};

	const filteredRooms = hotelRooms;

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

	return (
		<HotelOverviewWrapper fixIt={fixIt}>
			<div className='canvas-grid'>
				<div>
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
												const roomIsBooked = isRoomBooked(
													room._id,
													room.room_type,
													room.bedsNumber
												);
												return (
													<Tooltip
														title={
															<span style={{ textTransform: "capitalize" }}>
																{room.room_type}
															</span>
														}
														key={idx}
													>
														<RoomSquare
															key={idx}
															color={
																roomIsBooked
																	? "#e7e7e7" // Grey color for booked rooms
																	: pickedHotelRooms.includes(room._id)
																	  ? "darkgreen" // Dark green for selected rooms
																	  : room.roomColorCode // Default room color
															}
															onClick={() => {
																if (!roomIsBooked) {
																	handleRoomClick(room._id, true, room);
																}
															}}
															picked={pickedHotelRooms.includes(room._id)}
															reserved={roomIsBooked}
															style={{
																cursor: roomIsBooked
																	? "not-allowed"
																	: "pointer",
																opacity: roomIsBooked ? 0.5 : 1, // Reduce opacity for booked rooms
																textDecoration: roomIsBooked
																	? "line-through"
																	: "none", // Line-through for booked rooms
															}}
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
											  pricingByDay.length
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
											? pricingByDay.reduce((acc, day) => acc + day.price, 0)
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
	padding: 50px;
	background-color: lightblue;
	border: 1px solid #ccc;
	width: 90%;
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
