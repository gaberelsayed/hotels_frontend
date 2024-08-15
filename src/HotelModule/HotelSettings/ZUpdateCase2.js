import React, { useEffect } from "react";
import styled from "styled-components";
import ImageCardUpdate from "./ImageCardUpdate";

const ZUpdateCase2 = ({
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
	photos,
	setPhotos,
	existingRoomDetails,
	roomTypeSelected,
}) => {
	// Guard against undefined existingRoomDetails
	const roomId = existingRoomDetails?._id;

	// Prepopulate photos based on the selected room's _id
	useEffect(() => {
		if (existingRoomDetails && existingRoomDetails.photos) {
			setPhotos(existingRoomDetails.photos);
		} else {
			setPhotos([]); // Ensure the photos array is empty if there are no photos
		}
	}, [existingRoomDetails, setPhotos, roomTypeSelected]);

	return (
		<ZCase2Wrapper
			isArabic={chosenLanguage === "Arabic"}
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
		>
			{existingRoomDetails ? (
				<div className='my-3'>
					<ImageCardUpdate
						roomId={roomId} // Pass the unique room ID
						setHotelDetails={setHotelDetails}
						chosenLanguage={chosenLanguage}
						hotelDetails={hotelDetails}
						photos={photos}
						setPhotos={setPhotos}
					/>
				</div>
			) : (
				<p>
					{chosenLanguage === "Arabic"
						? "تفاصيل الغرفة غير متوفرة"
						: "Room details are not available"}
				</p>
			)}
		</ZCase2Wrapper>
	);
};

export default ZUpdateCase2;

const ZCase2Wrapper = styled.div``;
