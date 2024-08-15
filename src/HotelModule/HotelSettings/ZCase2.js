import React from "react";
import styled from "styled-components";
import ImageCard from "./ImageCard";

const ZCase2 = ({
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
	form,
	photos,
	setPhotos,
}) => {
	const roomType =
		form.getFieldValue("roomType") === "other"
			? form.getFieldValue("customRoomType")
			: form.getFieldValue("roomType");

	// We assume this is always adding new, so photos start empty
	return (
		<ZCase2Wrapper
			isArabic={chosenLanguage === "Arabic"}
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
		>
			<div className='my-3'>
				<ImageCard
					roomType={roomType}
					displayName={form.getFieldValue("displayName")}
					setHotelDetails={setHotelDetails}
					chosenLanguage={chosenLanguage}
					hotelDetails={hotelDetails}
					photos={photos}
					setPhotos={setPhotos}
				/>
			</div>
		</ZCase2Wrapper>
	);
};

export default ZCase2;

const ZCase2Wrapper = styled.div``;
