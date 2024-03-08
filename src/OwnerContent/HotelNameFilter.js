import React from "react";
import styled from "styled-components";
import { Button } from "antd";

const HotelNameFilter = ({
	selectedHotelName,
	setSelectedHotelName,
	distinctHotelNames,
}) => {
	return (
		<HotelNameFilterWrapper>
			<HotelNameButton
				selected={!selectedHotelName} // Highlight when no hotel is selected
				onClick={() => setSelectedHotelName("")}
			>
				Select All
			</HotelNameButton>
			{distinctHotelNames.map((hotelName, index) => (
				<HotelNameButton
					key={index}
					selected={hotelName === selectedHotelName}
					onClick={() => setSelectedHotelName(hotelName)}
					style={{ textTransform: "capitalize" }}
				>
					{hotelName}
				</HotelNameButton>
			))}
		</HotelNameFilterWrapper>
	);
};

export default HotelNameFilter;

const HotelNameFilterWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 10px;
	margin-bottom: 20px;
`;

const HotelNameButton = styled(Button)`
	background-color: ${({ selected }) => (selected ? "#b37400" : "transparent")};
	color: ${({ selected }) => (selected ? "#fff" : "#000")};
	border: ${({ selected }) => (selected ? "none" : "1px solid #b37400")};
	&:hover {
		color: white !important;
		background-color: orange;
		border: 1px solid #b37400 !important;
	}
`;
