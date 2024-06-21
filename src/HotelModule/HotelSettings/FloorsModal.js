import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import ZInputFieldRoomsPFloor from "./ZInputFieldRoomsPFloor";
import { roomTypeColors } from "../../AdminModule/NewHotels/Assets";
import { toast } from "react-toastify";

const FloorsModal = ({
	modalVisible,
	setModalVisible,
	clickedFloor,
	floorDetails,
	setFloorDetails,
	hotelDetails,
	rooms,
	setRooms,
	values,
}) => {
	const getRoomCountTotal = (roomCountDetails) => {
		return Object.values(roomCountDetails).reduce((total, count) => {
			// Convert count to a number and validate it
			const numericCount = Number(count);
			if (isNaN(numericCount)) {
				console.warn(`Invalid count value: ${count}`);
				return total;
			}
			return total + numericCount;
		}, 0);
	};

	const totalRooms = getRoomCountTotal(floorDetails.roomCountDetails);

	const handleRoomCountChange = (roomType, value) => {
		const newRoomCount = Number(value);
		const maxRoomCount = hotelDetails.roomCountDetails[roomType];

		if (newRoomCount > maxRoomCount) {
			toast.error(
				`Cannot add more than ${maxRoomCount} rooms for ${roomType}.`
			);
			return;
		}

		const newFloorDetails = {
			...floorDetails,
			roomCountDetails: {
				...floorDetails.roomCountDetails,
				[roomType]: newRoomCount,
			},
		};

		// Automatically update pricing if room count is changed
		if (newRoomCount > 0 && hotelDetails.roomCountDetails[`${roomType}Price`]) {
			newFloorDetails.roomCountDetails[`${roomType}Price`] =
				hotelDetails.roomCountDetails[`${roomType}Price`];
		}

		setFloorDetails(newFloorDetails);
	};

	const populateAllRooms = () => {
		const newRoomsForCurrentFloor = [];
		const roomTypes = Object.keys(floorDetails.roomCountDetails);

		let currentRoomNumber = 1;

		roomTypes.forEach((type) => {
			if (type.endsWith("Price")) return;

			const count = floorDetails.roomCountDetails[type];
			const priceObject = floorDetails.roomCountDetails[`${type}Price`];
			const roomColor =
				hotelDetails.roomCountDetails[type]?.roomColor ||
				roomTypeColors[type] ||
				"#000";

			for (let i = 0; i < count; i++) {
				const roomNumber = `${clickedFloor}${String(currentRoomNumber).padStart(
					2,
					"0"
				)}`;
				newRoomsForCurrentFloor.push({
					room_number: roomNumber,
					room_type: type,
					room_pricing: priceObject,
					roomColorCode: roomColor, // Use roomColor from hotelDetails or fall back to roomTypeColors
					floor: clickedFloor,
					hotelId: hotelDetails._id,
					belongsTo: values._id,
				});
				currentRoomNumber++;
			}
		});

		// Remove old rooms for the current floor
		const updatedRooms = rooms.filter((room) => room.floor !== clickedFloor);

		// Add new rooms for the current floor
		setRooms([...updatedRooms, ...newRoomsForCurrentFloor]);
	};

	const mainForm = () => {
		const roomTypesCount = Object.entries(hotelDetails.roomCountDetails).filter(
			([, details]) => details.count > 0
		).length;

		return (
			<div className='mx-auto text-center'>
				<h3 className='form-title'>
					Room Types & Count In Floor #{clickedFloor}
				</h3>
				<div className={`row ${roomTypesCount <= 6 ? "centered-grid" : ""}`}>
					{Object.entries(hotelDetails.roomCountDetails)
						.filter(([roomType, details]) => details.count > 0)
						.map(([roomType, details], i) => (
							<ZInputFieldRoomsPFloor
								key={i}
								Title={roomType.replace(/([A-Z])/g, " $1").trim()}
								value={floorDetails.roomCountDetails[roomType]}
								handleFloorRoomsCount={handleRoomCountChange}
								roomType={roomType}
								numRoomTypes={roomTypesCount}
							/>
						))}
					<div className='col-md-2 my-auto total-rooms'>
						<h5>
							Total: {totalRooms ? totalRooms : 0} Rooms In Floor #
							{clickedFloor}
						</h5>
					</div>
				</div>
				<div className='generate-button'>
					<button className='btn btn-primary' onClick={populateAllRooms}>
						Generate Floor #{clickedFloor} Rooms
					</button>
				</div>
			</div>
		);
	};

	return (
		<FloorsModalWrapper>
			<Modal
				width='70%'
				title={
					<div className='modal-title'>
						{`Floor ${clickedFloor} Rooms Builder`}
					</div>
				}
				open={modalVisible}
				onOk={() => {
					setModalVisible(false);
				}}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible(false);
				}}
			>
				{mainForm()}
			</Modal>
		</FloorsModalWrapper>
	);
};

export default FloorsModal;

// Styled components for FloorsModal
const FloorsModalWrapper = styled.div`
	z-index: 18000 !important;
	.form-container {
		margin: 0 auto;
		text-align: center;
	}
	.form-title {
		font-size: 1.3rem;
		text-decoration: underline;
		font-weight: bold;
		margin-bottom: 20px;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20px;
	}
	/* Center the input fields if there are fewer than or equal to 6 room types */
	.centered-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 20px;
	}
	.total-rooms {
		font-weight: bold;
		font-size: 1.2rem;
		margin-top: 10px;
	}
	.generate-button {
		margin-top: 20px;
	}
`;
