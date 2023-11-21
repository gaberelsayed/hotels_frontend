import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
import { gettingHotelDetailsForAdmin } from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import { Link } from "react-router-dom";

const AddedHotelsMain = ({ chosenLanguage }) => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
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
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}
		adminAllHotelDetails();
		// eslint-disable-next-line
	}, []);

	console.log(allHotelDetailsAdmin, "allHotelDetailsAdmin");
	return (
		<AddedHotelsMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='AddedHotels'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='AddedHotels'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					)}
				</div>

				<div className='otherContentWrapper'>
					<div className='container-wrapper'>
						<h3 className='mb-3'>All Added Hotels</h3>
						<div className='row'>
							{allHotelDetailsAdmin &&
								allHotelDetailsAdmin.map((hotel, i) => {
									return (
										<div className='col-md-3 mx-auto' key={i}>
											<Link
												to={`/admin/new-hotel?${hotel.belongsTo._id}`}
												style={{
													fontWeight: "bold",
													textTransform: "capitalize",
													textDecoration: "underline",
												}}
											>
												{hotel.hotelName} | {hotel.belongsTo.hotelAddress}
											</Link>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</AddedHotelsMainWrapper>
	);
};

export default AddedHotelsMain;

const AddedHotelsMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 75%" : "17% 75%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	h3 {
		font-weight: bold;
		font-size: 1.5rem;
		text-align: center;
		color: #006ad1;
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
