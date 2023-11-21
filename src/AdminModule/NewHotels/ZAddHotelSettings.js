import React from "react";
import styled from "styled-components";
import ZHotelDetailsForm from "./ZHotelDetailsForm";

const ZAddHotelSettings = ({
	values,
	hotelDetails,
	setHotelDetails,
	submittingHotelDetails,
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

	// Usage
	const totalRooms = getRoomCountTotal(hotelDetails.roomCountDetails);
	console.log(totalRooms, "totalRooms");

	return (
		<ZAddHotelSettingsWrapper>
			<h3>2- Build Hotel ({values && values.hotelName})</h3>{" "}
			<div>
				<ZHotelDetailsForm
					hotelDetails={hotelDetails}
					setHotelDetails={setHotelDetails}
				/>
				<button
					onClick={() => {
						submittingHotelDetails();
					}}
					className='btn btn-primary'
				>
					Show Hotel Layout
				</button>
			</div>
		</ZAddHotelSettingsWrapper>
	);
};

export default ZAddHotelSettings;

const ZAddHotelSettingsWrapper = styled.div`
	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
	}
`;
