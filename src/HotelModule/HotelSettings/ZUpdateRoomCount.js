import React from "react";
import styled from "styled-components";
import ZHotelDetailsForm2 from "./ZHotelDetailsForm2";

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
}) => {
	const roomCountDetails = hotelDetails.roomCountDetails;
	const addedRooms = Object.entries(roomCountDetails).filter(
		([key, value]) => value.count > 0
	);

	const handleRoomClick = (roomType) => {
		setSelectedRoomType(roomType);
		setCurrentStep(1); // Start from step 1 when a room is clicked
	};

	const renderRoomDetails = () => {
		if (!selectedRoomType) return null;

		const roomDetails = roomCountDetails[selectedRoomType];
		return (
			<ZHotelDetailsForm2
				roomDetails={roomDetails}
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
			/>
		);
	};

	return (
		<>
			<ZUpdateRoomCountWrapper
				dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			>
				<RoomsListWrapper isArabic={chosenLanguage === "Arabic"}>
					{addedRooms.map(([roomType, details]) => (
						<RoomItem
							key={roomType}
							onClick={() => handleRoomClick(roomType)}
							isActive={roomType === selectedRoomType}
						>
							{roomType.replace(/([A-Z])/g, " $1").trim()}
						</RoomItem>
					))}
				</RoomsListWrapper>
				<RoomDetailsWrapper isArabic={chosenLanguage === "Arabic"}>
					<div className='details-content'>{renderRoomDetails()}</div>
					{selectedRoomType ? (
						<div className='update-button'>
							<button
								onClick={() => {
									submittingHotelDetails();
								}}
								className='btn btn-primary'
							>
								Update Hotel Details
							</button>
						</div>
					) : null}
				</RoomDetailsWrapper>
			</ZUpdateRoomCountWrapper>
		</>
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
