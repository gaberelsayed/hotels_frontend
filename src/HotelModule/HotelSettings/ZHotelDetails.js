import React from "react";
import styled from "styled-components";
// eslint-disable-next-line
import ZHotelDetailsForm from "./ZHotelDetailsForm";
// eslint-disable-next-line
import RoomPhotosUpload from "./RoomPhotosUpload";
import ZHotelDetailsForm2 from "./ZHotelDetailsForm2";

const ZHotelDetails = ({
	values,
	hotelDetails,
	setHotelDetails,
	submittingHotelDetails,
	chosenLanguage,
	hotelPhotos,
	setHotelPhotos,
	roomTypes,
	amenitiesList,
	currentStep,
	setCurrentStep,
	setSelectedRoomType,
	selectedRoomType,
	roomTypeSelected,
	setRoomTypeSelected,
	fromPage,
}) => {
	return (
		<ZAddHotelSettingsWrapper>
			<div>
				<ZHotelDetailsForm2
					hotelDetails={hotelDetails}
					setHotelDetails={setHotelDetails}
					chosenLanguage={chosenLanguage}
					roomTypes={roomTypes}
					amenitiesList={amenitiesList}
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
					setSelectedRoomType={setSelectedRoomType}
					selectedRoomType={selectedRoomType}
					roomTypeSelected={roomTypeSelected}
					setRoomTypeSelected={setRoomTypeSelected}
					submittingHotelDetails={submittingHotelDetails}
					fromPage={fromPage}
				/>

				<div className='mx-auto text-center mt-4'>
					<button
						onClick={() => {
							submittingHotelDetails(fromPage);
						}}
						className='btn btn-primary'
					>
						Update Hotel Details
					</button>
				</div>
			</div>
		</ZAddHotelSettingsWrapper>
	);
};

export default ZHotelDetails;

const ZAddHotelSettingsWrapper = styled.div`
	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
	}
`;
