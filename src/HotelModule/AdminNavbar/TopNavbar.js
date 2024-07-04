import React, { useState } from "react";
import styled from "styled-components";
import { Menu, Dropdown } from "antd";
import {
	UserOutlined,
	LogoutOutlined,
	MailOutlined,
	BellOutlined,
	MessageOutlined,
	SettingOutlined,
	GlobalOutlined, // Import the global icon
} from "@ant-design/icons";
import { useCartContext } from "../../cart_context";
import DigitalClock from "./DigitalClock"; // Import the DigitalClock component

const TopNavbar = ({ onProfileClick, collapsed }) => {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const { languageToggle, chosenLanguage } = useCartContext();

	const handleMenuClick = ({ key }) => {
		if (key === "logout") {
			// Handle logout action
		}
		setDropdownVisible(false);
	};

	const menu = (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key='profile' icon={<UserOutlined />}>
				Profile
			</Menu.Item>
			<Menu.Item key='inbox' icon={<MailOutlined />}>
				Inbox
			</Menu.Item>
			<Menu.Item key='logout' icon={<LogoutOutlined />}>
				Logout
			</Menu.Item>
		</Menu>
	);

	return (
		<NavbarWrapper isArabic={chosenLanguage === "Arabic"}>
			<LeftSection>
				<Logo show={collapsed} isArabic2={chosenLanguage === "Arabic"}>
					<img
						src='https://res.cloudinary.com/infiniteapps/image/upload/v1719970937/janat/1719970937849.png'
						alt='jannatbooking'
						style={{ width: "200px" }}
					/>
				</Logo>
				<DigitalClockWrapper>
					<DigitalClock />
				</DigitalClockWrapper>
			</LeftSection>
			<RightSection>
				<Icons>
					<IconWrapper
						style={{ width: "25%" }}
						onClick={() =>
							languageToggle(
								chosenLanguage === "English" ? "Arabic" : "English"
							)
						}
					>
						<GlobalOutlined className='mx-2' />
						<LanguageText>
							{chosenLanguage === "English" ? "عربي" : "En"}
						</LanguageText>
					</IconWrapper>
					<IconWrapper>
						<SettingOutlined />
					</IconWrapper>
					<IconWrapper
						className='w-25'
						style={{ color: "white", fontWeight: "bold" }}
					>
						شُموس
						<NotificationDot2 />
					</IconWrapper>
					<IconWrapper>
						<BellOutlined />
						<NotificationDot />
					</IconWrapper>
					<IconWrapper>
						<MessageOutlined />
						<NotificationDot />
					</IconWrapper>
				</Icons>
				<ProfileMenu>
					<Dropdown
						overlay={menu}
						trigger={["click"]}
						visible={dropdownVisible}
						onVisibleChange={(flag) => setDropdownVisible(flag)}
					>
						<Profile onClick={onProfileClick}>
							<img src='https://via.placeholder.com/40' alt='Profile' />
							<div>
								<span>Ya modeer</span>
								<small>Superadmin</small>
							</div>
						</Profile>
					</Dropdown>
				</ProfileMenu>
			</RightSection>
		</NavbarWrapper>
	);
};

export default TopNavbar;

const NavbarWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 70px;
	background-color: #1e1e2d;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	direction: ${(props) => (props.isArabic ? "rtl" : "")} !important;
`;

const LeftSection = styled.div`
	display: flex;
	align-items: center;
`;

const Logo = styled.div`
	display: flex;
	align-items: center;
	margin-right: ${(props) =>
		props.show && props.isArabic2 ? "50px" : ""} !important;
`;

const DigitalClockWrapper = styled.div`
	margin-left: 20px;
`;

const RightSection = styled.div`
	display: flex;
	align-items: center;
`;

const Icons = styled.div`
	display: flex;
	align-items: center;
	margin-left: ${(props) => (props.isArabic ? "40px" : "40px")} !important;
	margin-right: ${(props) => (props.isArabic ? "" : "40px")} !important;

	svg {
		font-size: 25px; /* Icon font size */
		color: #fff;
		cursor: pointer;
	}
`;

const IconWrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background-color: #161621;
	border-radius: 5px;
	margin-left: ${(props) => (props.isArabic ? "20px" : "")} !important;
	margin-right: ${(props) => (props.isArabic ? "" : "20px")} !important;
	cursor: pointer;
`;

const LanguageText = styled.span`
	color: #fff;
	margin-left: 5px;
	font-size: 14px;
`;

const NotificationDot = styled.div`
	position: absolute;
	top: 5px;
	right: 5px;
	width: 8px;
	height: 8px;
	background-color: orange;
	border-radius: 50%;
`;

const NotificationDot2 = styled.div`
	position: absolute;
	top: 3px;
	right: 1px;
	width: 8px;
	height: 8px;
	background-color: lightgreen;
	border-radius: 50%;
	animation: blink 3.5s infinite;

	@keyframes blink {
		0%,
		50%,
		100% {
			opacity: 1;
		}
		25%,
		75% {
			opacity: 0;
		}
	}
`;

const ProfileMenu = styled.div`
	display: flex;
	align-items: center;
`;

const Profile = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	img {
		border-radius: 50%;
	}
	span {
		font-weight: bold;
		color: #fff;
		margin-left: ${(props) => (props.isArabic ? "20px" : "30px")} !important;
		margin-right: ${(props) => (props.isArabic ? "" : "10px")} !important;
	}
	small {
		display: block;
		color: #bbb;
		font-size: 12px;
	}
`;
