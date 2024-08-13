import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Button, Modal, Card, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useCartContext } from "../cart_context";
import { isAuthenticated } from "../auth";
import { hotelAccount, updateHotelDetails } from "./apiAdmin";
import TopNavbar from "./AdminNavbar/TopNavbar";
import AddHotelForm from "./AddHotelForm";
import EditHotelForm from "./EditHotelForm";

const MainHotelDashboard = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const { chosenLanguage } = useCartContext();
	const [userData, setUserData] = useState("");
	const [addHotelModalVisible, setAddHotelModalVisible] = useState(false);
	const [editHotelModalVisible, setEditHotelModalVisible] = useState(false);
	const [currentHotel, setCurrentHotel] = useState(null);

	const { user, token } = isAuthenticated();

	const gettingHotelData = useCallback(() => {
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				setUserData(data);
			}
		});
	}, [user._id, token]);

	useEffect(() => {
		gettingHotelData();
	}, [gettingHotelData]);

	const openAddHotelModal = () => {
		setAddHotelModalVisible(true);
	};

	const closeAddHotelModal = () => {
		setAddHotelModalVisible(false);
	};

	const openEditHotelModal = (hotel) => {
		setCurrentHotel(hotel);
		setEditHotelModalVisible(true);
	};

	const closeEditHotelModal = () => {
		setEditHotelModalVisible(false);
		setCurrentHotel(null);
	};

	const handleHotelClick = (hotel) => {
		if (!userData.activeUser) {
			message.error(
				"Your Account was deactivated, please reach out to XHotel's Administration"
			);
			return;
		}

		// Store the selected hotel details in local storage
		localStorage.setItem("selectedHotel", JSON.stringify(hotel));

		// Redirect to the dashboard
		window.location.href = `/hotel-management/dashboard/${user._id}/${hotel._id}`;
	};

	const renderHotelStatus = (hotel) => {
		const roomCountDetailsAdded =
			hotel.roomCountDetails && hotel.roomCountDetails.length > 0;
		const locationAdded =
			hotel.location &&
			hotel.location.coordinates &&
			!(
				hotel.location.coordinates[0] === 0 &&
				hotel.location.coordinates[1] === 0
			);
		const hotelPhotosAdded = hotel.hotelPhotos && hotel.hotelPhotos.length > 0;

		const redirectToSettings = () => {
			window.location.href = `/hotel-management/settings/${user._id}/${hotel._id}`;
		};

		return (
			<StatusWrapper>
				{!roomCountDetailsAdded ? (
					<StatusItem onClick={redirectToSettings}>
						<CloseOutlined style={{ color: "red", marginRight: "5px" }} />
						<p style={{ color: "red", fontWeight: "bold" }}>
							Please Add Rooms/Pricing
						</p>
					</StatusItem>
				) : (
					<StatusItem>
						<CheckOutlined style={{ color: "green", marginRight: "5px" }} />
						<p style={{ color: "green", fontWeight: "bold" }}>Rooms Added</p>
					</StatusItem>
				)}

				{!locationAdded ? (
					<StatusItem onClick={redirectToSettings}>
						<CloseOutlined style={{ color: "red", marginRight: "5px" }} />
						<p style={{ color: "red", fontWeight: "bold" }}>
							Please Add Exact Location
						</p>
					</StatusItem>
				) : (
					<StatusItem>
						<CheckOutlined style={{ color: "green", marginRight: "5px" }} />
						<p style={{ color: "green", fontWeight: "bold" }}>
							Exact Location Added
						</p>
					</StatusItem>
				)}

				{!hotelPhotosAdded ? (
					<StatusItem onClick={redirectToSettings}>
						<CloseOutlined style={{ color: "red", marginRight: "5px" }} />
						<p style={{ color: "red", fontWeight: "bold" }}>
							Please Add Hotel Photos
						</p>
					</StatusItem>
				) : (
					<StatusItem>
						<CheckOutlined style={{ color: "green", marginRight: "5px" }} />
						<p style={{ color: "green", fontWeight: "bold" }}>
							Hotel Photos Added
						</p>
					</StatusItem>
				)}
			</StatusWrapper>
		);
	};

	return (
		<MainHotelDashboardWrapper isArabic={chosenLanguage === "Arabic"}>
			<TopNavbar
				fromPage='AdminDasboard'
				AdminMenuStatus={AdminMenuStatus}
				setAdminMenuStatus={setAdminMenuStatus}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
				chosenLanguage={chosenLanguage}
			/>

			<ContentWrapper className='container'>
				{userData &&
				userData.hotelIdsOwner &&
				userData.hotelIdsOwner.length > 0 ? (
					userData.hotelIdsOwner.map((hotel, index) => (
						<StyledCard
							key={index}
							title={
								<HotelTitle onClick={() => handleHotelClick(hotel)}>
									<div>{hotel.hotelName}</div>
									<EditIcon
										onClick={(e) => {
											e.stopPropagation();
											openEditHotelModal(hotel);
										}}
									/>
								</HotelTitle>
							}
						>
							<DetailsWrapper>
								<DetailsColumn onClick={() => handleHotelClick(hotel)}>
									{hotel.hotelCountry && <p>Country: {hotel.hotelCountry}</p>}
									{hotel.hotelState && <p>State: {hotel.hotelState}</p>}
									{hotel.hotelCity && <p>City: {hotel.hotelCity}</p>}
									{hotel.phone && <p>Phone: {hotel.phone}</p>}
									{hotel.hotelAddress && <p>Address: {hotel.hotelAddress}</p>}
									{hotel.hotelFloors !== undefined && (
										<p>Floors: {hotel.hotelFloors}</p>
									)}
								</DetailsColumn>
								{renderHotelStatus(hotel)}
							</DetailsWrapper>
						</StyledCard>
					))
				) : (
					<p>No hotels found.</p>
				)}
				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={openAddHotelModal}
					style={{
						backgroundColor: "var(--button-bg-primary)",
						borderColor: "var(--button-bg-primary)",
						color: "var(--button-font-color)",
						width: "50%",
						textAlign: "center",
						margin: "auto",
					}}
				>
					Add Another Property
				</Button>
			</ContentWrapper>

			<Modal
				title='Add New Property'
				open={addHotelModalVisible}
				onCancel={closeAddHotelModal}
				footer={null}
			>
				<AddHotelForm closeAddHotelModal={closeAddHotelModal} />
			</Modal>

			<Modal
				title='Edit Property'
				open={editHotelModalVisible}
				onCancel={closeEditHotelModal}
				footer={null}
			>
				<EditHotelForm
					closeEditHotelModal={closeEditHotelModal}
					hotelData={currentHotel}
					updateHotelDetails={updateHotelDetails}
					token={token}
					userId={user._id}
				/>
			</Modal>
		</MainHotelDashboardWrapper>
	);
};

export default MainHotelDashboard;

const MainHotelDashboardWrapper = styled.div`
	overflow-x: hidden;
	margin-top: 70px;
	min-height: 100vh;
	padding: 24px;
	background-color: var(--background-light);
`;

const ContentWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;
`;

const StyledCard = styled(Card)`
	margin-bottom: 10px;
	padding: 10px;
	cursor: pointer;
	transition: transform 0.2s;
	font-size: 14px; /* Smaller font size */
	color: var(--text-color-secondary);
	box-shadow: var(--box-shadow-light);
	&:hover {
		transform: scale(1.02);
	}

	.ant-card-head-title {
		font-size: 24px;
		color: var(--primary-color-blue);
		text-transform: capitalize;
	}

	.ant-card-body {
		padding: 5px !important;
	}

	p {
		margin: 1px 0;
		font-size: 14px; /* Adjusted font size */
		color: var(--text-color-secondary);
		font-weight: bold;
		text-transform: capitalize;
	}
`;

const HotelTitle = styled.div`
	display: flex;
	align-items: center;
`;

const EditIcon = styled(EditOutlined)`
	margin-left: 20px;
	color: var(--primary-color-dark-blue);
	cursor: pointer;
`;

const StatusWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const StatusItem = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	margin-top: 8px;
	&:hover {
		text-decoration: underline;
	}
`;

const DetailsWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

const DetailsColumn = styled.div`
	display: flex;
	flex-direction: column;
`;
