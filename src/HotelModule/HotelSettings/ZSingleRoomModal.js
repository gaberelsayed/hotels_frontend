/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../auth";
import { updateSingleRoom } from "../apiAdmin";
import {
	roomTypeColors,
	BedSizes,
	Views,
} from "../../AdminModule/NewHotels/Assets";

const ZSingleRoomModal = ({
	modalVisible,
	setModalVisible,
	clickedRoom,
	setClickedRoom,
	clickedFloor,
	rooms,
	setRooms,
	hotelDetails,
	setHelperRender,
	helperRender,
}) => {
	const { user, token } = isAuthenticated();
	const [bedCount, setBedCount] = useState(clickedRoom.bedsNumber?.length || 0);

	useEffect(() => {
		if (clickedRoom.room_type === "individualBed" && clickedRoom.bedsNumber) {
			setBedCount(clickedRoom.bedsNumber.length);
		}
	}, [clickedRoom]);

	const roomTypes = Object.keys(hotelDetails.roomCountDetails || {}).filter(
		(type) =>
			!type.endsWith("Price") && hotelDetails.roomCountDetails[type].count > 0
	);

	const updatingSingleRoom = () => {
		// Update the bedsNumber array and individualBeds flag if the room type is individualBed
		if (clickedRoom.room_type === "individualBed") {
			const bedsNumber = Array.from(
				{ length: bedCount },
				(_, i) => `${clickedRoom.room_number}${String.fromCharCode(97 + i)}`
			);
			clickedRoom.bedsNumber = bedsNumber;
			clickedRoom.individualBeds = true;
		}

		console.log("Updating Room:", clickedRoom);

		updateSingleRoom(clickedRoom._id, user._id, token, clickedRoom)
			.then((data) => {
				if (data && data.error) {
					console.error(data.error, "Error Updating A Room");
				} else {
					toast.success(
						`Room #${clickedRoom.room_number} Was Successfully Updated`
					);
					setTimeout(() => {
						setModalVisible(false);
					}, 1000);
					setTimeout(() => {
						window.location.reload(false);
					}, 1500);
				}
			})
			.catch((error) => {
				console.error("Error occurred:", error);
			});
	};

	const updateRoomState = () => {
		// Close the modal
		setModalVisible(false);

		// Check if clickedRoom has an _id, if not use the combination of room_number and floor
		const roomIdentifier = clickedRoom._id
			? clickedRoom._id
			: `${clickedRoom.floor}-${clickedRoom.room_number}`;

		// Map over the rooms and update the state for the matching room
		const updatedRooms = rooms.map((room) => {
			const currentRoomIdentifier = room._id
				? room._id
				: `${room.floor}-${room.room_number}`;
			if (currentRoomIdentifier === roomIdentifier) {
				return { ...room, ...clickedRoom }; // Spread the existing room and overwrite with clickedRoom
			}
			return room; // Return the room unchanged if it doesn't match
		});

		// Update the rooms state with the new array
		setRooms(updatedRooms);

		setClickedRoom("");

		// Optionally, if you need to trigger some re-render or additional effects
		// after updating the rooms, you can call setHelperRender or other state setters here.
	};

	const handleBedCountChange = (e) => {
		const count = parseInt(e.target.value, 10);
		setBedCount(count);
		const bedsNumber = Array.from(
			{ length: count },
			(_, i) => `${clickedRoom.room_number}${String.fromCharCode(97 + i)}`
		);
		setClickedRoom({
			...clickedRoom,
			bedsNumber,
			individualBeds: true,
		});
		console.log("Updated Room for Bed Count Change:", {
			...clickedRoom,
			bedsNumber,
			individualBeds: true,
		});
	};

	const mainForm = () => {
		return (
			<InputFieldStylingWrapper className='mx-auto text-center'>
				<h3
					style={{
						fontSize: "1.1rem",
						textDecoration: "underline",
						textAlign: "left",
						fontWeight: "bold",
					}}
				>
					Edit Room #{clickedRoom.room_number} Floor #{clickedFloor}
				</h3>

				<div className='row'>
					<div className=' col-md-2 form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "11px",
								textAlign: "center",
							}}
						>
							Room Type
						</label>
						<select
							style={{ textTransform: "capitalize" }}
							value={clickedRoom.room_type}
							onChange={(e) => {
								const newRoomType = e.target.value;
								const newColorCode =
									hotelDetails.roomCountDetails[newRoomType]?.roomColor ||
									roomTypeColors[newRoomType] ||
									"#000";
								setClickedRoom({
									...clickedRoom,
									room_type: newRoomType,
									roomColorCode: newColorCode,
								});
							}}
						>
							<option value=''>Please Select</option>
							{roomTypes.map((type, i) => (
								<option key={i} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>

					{clickedRoom && clickedRoom.room_type === "individualBed" && (
						<div className=' col-md-2 form-group' style={{ marginTop: "10px" }}>
							<label
								htmlFor='bedsNumber'
								style={{
									fontWeight: "bold",
									fontSize: "11px",
									textAlign: "center",
								}}
							>
								How many beds?
							</label>
							<input
								type='number'
								min='1'
								value={bedCount}
								onChange={handleBedCountChange}
							/>
						</div>
					)}

					<div className=' col-md-2 form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='bedSize'
							style={{
								fontWeight: "bold",
								fontSize: "11px",
								textAlign: "center",
							}}
						>
							Bed Size
						</label>
						<select
							style={{ textTransform: "capitalize" }}
							value={
								clickedRoom.room_features &&
								clickedRoom.room_features[0] &&
								clickedRoom.room_features[0].bedSize
							}
							onChange={(e) => {
								setClickedRoom({
									...clickedRoom,
									room_features: Array.isArray(clickedRoom.room_features)
										? clickedRoom.room_features.map((feature, index) =>
												index === 0
													? { ...feature, bedSize: e.target.value }
													: feature
										  )
										: [{ bedSize: e.target.value }], // If it's not an array, create a new array with the bedSize
								});
							}}
						>
							<option value=''>Please Select</option>
							{BedSizes.map((b, i) => (
								<option key={i} value={b}>
									{b}
								</option>
							))}
						</select>
					</div>

					<div className=' col-md-2 form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='view'
							style={{
								fontWeight: "bold",
								fontSize: "11px",
								textAlign: "center",
							}}
						>
							Bed View
						</label>
						<select
							style={{ textTransform: "capitalize" }}
							value={
								clickedRoom.room_features &&
								clickedRoom.room_features[0] &&
								clickedRoom.room_features[0].view
							}
							onChange={(e) => {
								setClickedRoom({
									...clickedRoom,
									room_features: clickedRoom.room_features.map(
										(feature, index) =>
											index === 0
												? { ...feature, view: e.target.value }
												: feature
									),
								});
							}}
						>
							<option value=''>Please Select</option>
							{Views.map((b, i) => (
								<option key={i} value={b}>
									{b}
								</option>
							))}
						</select>
					</div>

					<div className=' col-md-2 form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='smoking'
							style={{
								fontWeight: "bold",
								fontSize: "11px",
								textAlign: "center",
							}}
						>
							Smoking
						</label>
						<select
							style={{ textTransform: "capitalize" }}
							value={
								clickedRoom.room_features &&
								clickedRoom.room_features[0] &&
								clickedRoom.room_features[0].smoking
									? "For Smokers"
									: "No Smoking"
							}
							onChange={(e) => {
								const smokingValue = e.target.value === "For Smokers";
								setClickedRoom({
									...clickedRoom,
									room_features: clickedRoom.room_features.map(
										(feature, index) =>
											index === 0
												? { ...feature, smoking: smokingValue }
												: feature
									),
								});
							}}
						>
							<option value=''>Please Select</option>
							<option value={false}>No Smoking</option>
							<option value={true}>For Smokers</option>
						</select>
					</div>
				</div>

				{clickedRoom && clickedRoom._id && (
					<div>
						<button
							className='btn btn-outline-success'
							onClick={updatingSingleRoom}
						>
							Update Room #{clickedRoom.room_number}
						</button>
					</div>
				)}
			</InputFieldStylingWrapper>
		);
	};

	return (
		<ZSingleRoomModalWrapper>
			<Modal
				width='70%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}
					>{`Edit Room #${clickedRoom.room_number}`}</div>
				}
				open={modalVisible}
				onOk={updateRoomState}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible(false);
				}}
			>
				{!clickedRoom && !clickedRoom._id ? setModalVisible(false) : mainForm()}
			</Modal>
		</ZSingleRoomModalWrapper>
	);
};

export default ZSingleRoomModal;

const ZSingleRoomModalWrapper = styled.div`
	z-index: 18000 !important;
`;

const InputFieldStylingWrapper = styled.div`
	input[type="text"],
	input[type="email"],
	input[type="password"],
	input[type="date"],
	input[type="number"],
	select,
	textarea {
		display: block;
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
	}
	input[type="text"]:focus,
	input[type="email"]:focus,
	input[type="password"]:focus,
	input[type="number"]:focus,
	input[type="date"]:focus,
	select:focus,
	textarea:focus,
	label:focus {
		outline: none;
		border: 1px solid var(--primaryColor);

		box-shadow: 5px 8px 3px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		font-weight: bold;
	}
`;
