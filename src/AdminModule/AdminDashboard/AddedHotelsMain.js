import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { gettingHotelDetailsForAdmin } from "../apiAdmin";
import { isAuthenticated } from "../../auth";

const AddedHotelsMain = ({ chosenLanguage }) => {
	const [allHotelDetailsAdmin, setAllHotelDetailsAdmin] = useState("");

	const { user, token } = isAuthenticated();
	const adminAllHotelDetails = () => {
		gettingHotelDetailsForAdmin(user._id, token).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error getting all hotel details");
			} else {
				setAllHotelDetailsAdmin(data);
			}
		});
	};

	useEffect(() => {
		adminAllHotelDetails();
		// eslint-disable-next-line
	}, []);

	const handleHotelClick = (hotel) => {
		localStorage.setItem("hotel", JSON.stringify(hotel)); // Store the hotel object in local storage
		window.open(
			`/admin-management/dashboard/${hotel._id}/${hotel.belongsTo._id}`
		); // Open the dashboard in a new tab
	};

	return (
		<AddedHotelsMainWrapper dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
			<h3 className='mb-3'>All Added Hotels</h3>
			<div className='row'>
				{allHotelDetailsAdmin &&
					allHotelDetailsAdmin.map((hotel, i) => {
						return (
							<div
								className='col-md-4 mx-auto'
								key={i}
								onClick={() => handleHotelClick(hotel)}
							>
								<div
									style={{
										fontWeight: "bold",
										textTransform: "capitalize",
										textDecoration: "underline",
										cursor: "pointer",
									}}
								>
									{hotel.hotelName} | {hotel.belongsTo.hotelAddress}
								</div>
							</div>
						);
					})}
			</div>
		</AddedHotelsMainWrapper>
	);
};

export default AddedHotelsMain;

const AddedHotelsMainWrapper = styled.div``;
