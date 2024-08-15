import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import ZUpdateHotelDetailsForm2 from "./ZUpdateHotelDetailsForm2";

const ZUpdateRoomCount = ({
	values,
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
	roomTypes,
	amenitiesList,
	currentStep,
	setCurrentStep,
	setSelectedRoomType,
	selectedRoomType,
	submittingHotelDetails,
	roomTypeSelected,
	setRoomTypeSelected,
	fromPage,
}) => {
	const [roomDetails, setRoomDetails] = useState(null); // Local state to hold room details
	const [photos, setPhotos] = useState([]); // Move photos state here

	// Memoize roomCountDetails to avoid recalculating it on every render
	const roomCountDetails = useMemo(
		() => hotelDetails.roomCountDetails || [],
		[hotelDetails.roomCountDetails]
	);

	// Handle when a room is clicked
	const handleRoomClick = (roomId) => {
		setSelectedRoomType(roomId);
		setCurrentStep(1); // Start from step 1 when a room is clicked
	};

	// Update roomDetails whenever selectedRoomType changes
	useEffect(() => {
		const selectedRoom = roomCountDetails.find(
			(room) => room._id === selectedRoomType
		);

		// Update room details and photos state when a new room is selected
		setRoomDetails(selectedRoom);
		setPhotos(selectedRoom ? selectedRoom.photos : []);
	}, [selectedRoomType, roomCountDetails]);

	return (
		<ZUpdateRoomCountWrapper dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
			<RoomsListWrapper isArabic={chosenLanguage === "Arabic"}>
				{roomCountDetails.map((room) => (
					<RoomItem
						key={room._id} // Use _id as the unique key
						onClick={() => handleRoomClick(room._id)}
						isActive={room._id === selectedRoomType}
					>
						{room.displayName
							? room.displayName
							: room.roomType
							  ? room.roomType.replace(/([A-Z])/g, " $1").trim()
							  : "Unknown Room Type"}
					</RoomItem>
				))}
			</RoomsListWrapper>
			<RoomDetailsWrapper isArabic={chosenLanguage === "Arabic"}>
				<div className='details-content'>
					{roomDetails ? (
						<ZUpdateHotelDetailsForm2
							existingRoomDetails={roomDetails}
							hotelDetails={hotelDetails}
							setHotelDetails={setHotelDetails}
							chosenLanguage={chosenLanguage}
							roomTypes={roomTypes}
							amenitiesList={amenitiesList}
							currentStep={currentStep}
							setCurrentStep={setCurrentStep}
							selectedRoomType={selectedRoomType}
							setSelectedRoomType={setSelectedRoomType}
							roomTypeSelected={roomTypeSelected}
							setRoomTypeSelected={setRoomTypeSelected}
							submittingHotelDetails={submittingHotelDetails}
							fromPage={fromPage}
							photos={photos} // Pass photos state
							setPhotos={setPhotos} // Pass setPhotos function
						/>
					) : (
						<p
							style={{
								textAlign: chosenLanguage === "Arabic" ? "right" : "",
								fontWeight: "bold",
								fontSize: "18px",
							}}
						>
							{chosenLanguage === "Arabic"
								? "الرجاء اختيار غرفة للتحديث"
								: "Choose a room to update"}
						</p>
					)}
				</div>
				{selectedRoomType && roomDetails ? (
					<div className='update-button'>
						<button
							onClick={() => {
								submittingHotelDetails(fromPage);
							}}
							className='btn btn-primary'
						>
							{chosenLanguage === "Arabic"
								? "تحديث تفاصيل الفندق"
								: "Update Hotel Details"}
						</button>
					</div>
				) : null}
			</RoomDetailsWrapper>
		</ZUpdateRoomCountWrapper>
	);
};

export default ZUpdateRoomCount;

const ZUpdateRoomCountWrapper = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`;

const RoomsListWrapper = styled.div`
	width: 14%;
	border-right: ${({ isArabic }) => (isArabic ? "none" : "1px solid #ccc")};
	border-left: ${({ isArabic }) => (isArabic ? "1px solid #ccc" : "none")};
	padding: 12px;
	overflow-y: auto;
	font-size: 13.5px;
	text-transform: capitalize;
`;

const RoomItem = styled.div`
	padding: 10px;
	margin: 10px 0;
	background-color: ${({ isActive }) => (isActive ? "#333" : "#f8f8f8")};
	color: ${({ isActive }) => (isActive ? "#fff" : "#000")};
	border: 1px solid #ccc;
	cursor: pointer;
	text-align: center;
	font-weight: bold;
	transition: 0.5s;

	&:hover {
		background-color: #e0e0e0;
		transition: 0.5s;
		color: black;
	}
`;

const RoomDetailsWrapper = styled.div`
	width: 86%;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.details-content {
		flex-grow: 1;
	}

	.update-button {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
`;
