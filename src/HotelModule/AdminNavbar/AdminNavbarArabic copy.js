import React, { useState } from "react";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";
import {
	SearchOutlined,
	HomeOutlined,
	CalendarOutlined,
	UserOutlined,
	MedicineBoxOutlined,
	FileOutlined,
	AccountBookOutlined,
	FileTextOutlined,
	SettingOutlined,
	QuestionCircleOutlined,
	MenuUnfoldOutlined,
	MenuFoldOutlined,
} from "@ant-design/icons";
import { Button, Menu, Input } from "antd";
import { useCartContext } from "../../cart_context";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { signout } from "../../auth";
import TopNavbar from "./TopNavbar";

const getItem = (label, key, icon, children, type, className) => ({
	key,
	icon,
	children,
	label,
	type,
	className,
});

const handleSignout = (history) => {
	signout(() => {
		history.push("/");
	});
};

const items = [
	{ type: "group", label: "العمليات اليومية" },
	getItem(
		<Link to='/hotel-management/dashboard'>الاستقبال</Link>,
		"front-desk",
		<HomeOutlined />
	),
	getItem(
		<Link to='/hotel-management/new-reservation'>الحجوزات</Link>,
		"reservations",
		<CalendarOutlined />
	),
	getItem(
		<Link to='/hotel-management/new-reservation?list'>النزلاء</Link>,
		"guests",
		<UserOutlined />
	),
	getItem(
		<Link to='/hotel-management/housekeeping'>التدبير المنزلي</Link>,
		"housekeeping",
		<MedicineBoxOutlined />
	),
	getItem(
		<Link to='/hotel-management/tasks'>المهام</Link>,
		"tasks",
		<FileOutlined />
	),
	{ type: "group", label: "المستندات" },
	getItem(
		<Link to='/hotel-management/documents'>المستندات</Link>,
		"documents",
		<FileTextOutlined />
	),
	getItem(
		<Link to='/hotel-management-payment'>المدفوعات</Link>,
		"accounting",
		<AccountBookOutlined />
	),
	getItem(
		<Link to='/hotel-management/reports'>التقارير</Link>,
		"reports",
		<FileTextOutlined />
	),
	{ type: "group", label: "أخرى" },
	getItem(
		<Link to='/hotel-management/settings'>الإعدادات</Link>,
		"settings",
		<SettingOutlined />
	),
	getItem(
		<Link to='/hotel-management/help'>المساعدة</Link>,
		"help",
		<QuestionCircleOutlined />
	),
];

const AdminNavbarArabic = ({
	fromPage,
	setAdminMenuStatus,
	collapsed,
	setCollapsed,
}) => {
	const [clickedOn, setClickedOn] = useState(false);
	const { chosenLanguage } = useCartContext();
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
		setAdminMenuStatus(!collapsed);
	};
	const history = useHistory();

	return (
		<>
			<TopNavbar />
			<AdminNavbarWrapper
				show={collapsed}
				show2={clickedOn}
				collapsed={collapsed} // Add this line
				style={{
					width: collapsed ? 80 : 285,
				}}
				dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			>
				<Button
					type='primary'
					onClick={toggleCollapsed}
					style={{
						marginBottom: 8,
						textAlign: "center",
						marginLeft: chosenLanguage === "Arabic" ? 200 : 5,
						marginTop: chosenLanguage === "Arabic" ? 10 : 10,
						top: collapsed ? "40px" : "",
						right: collapsed ? "10px" : "",
						zIndex: collapsed ? "1000" : "",
					}}
				>
					{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
				</Button>
				{!collapsed && ( // Hide the search input when collapsed
					<SearchWrapper>
						<StyledInput placeholder='بحث' prefix={<SearchOutlined />} />
					</SearchWrapper>
				)}
				<Menu
					dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
					defaultSelectedKeys={
						fromPage === "AdminDasboard"
							? "dashboard"
							: fromPage === "FrontDesk"
							  ? "front-desk"
							  : fromPage === "Reservations"
							    ? "reservations"
							    : fromPage === "Guests"
							      ? "guests"
							      : fromPage === "Housekeeping"
							        ? "housekeeping"
							        : fromPage === "Tasks"
							          ? "tasks"
							          : fromPage === "Documents"
							            ? "documents"
							            : fromPage === "Accounting"
							              ? "accounting"
							              : fromPage === "CashBooks"
							                ? "cash-books"
							                : fromPage === "Reports"
							                  ? "reports"
							                  : fromPage === "HotelSettings"
							                    ? "settings"
							                    : fromPage === "Help"
							                      ? "help"
							                      : "dashboard"
					}
					defaultOpenKeys={["dashboard"]}
					mode='inline'
					theme='dark'
					inlineCollapsed={collapsed}
					items={items}
					onClick={(e) => {
						if (e.key === "signout") {
							handleSignout(history);
						}
						if (e.key === "StoreLogo") {
							setClickedOn(true);
						} else {
							setClickedOn(false);
						}
						return <Redirect to={e.key} />;
					}}
				/>
			</AdminNavbarWrapper>
		</>
	);
};

export default AdminNavbarArabic;

const AdminNavbarWrapper = styled.div`
	margin-bottom: 15px;
	background: ${(props) => (props.show ? "" : "#262639")};
	top: 69px !important;
	top: ${(props) => (props.show ? "20px" : "69px")} !important;
	z-index: 20000;
	overflow: auto;
	position: absolute;
	padding: 0px !important;
	position: fixed;
	top: 0;
	right: 0;
	height: 100vh;

	.logoClass {
		display: ${(props) => (props.show ? "none " : "block")} !important;
	}

	img {
		margin-right: 50px;
	}

	li {
		font-size: 0.9rem;
		margin-bottom: ${(props) =>
			props.show ? "30px " : "10px"}; /* Reduced margin between items */
		text-align: right;
	}

	hr {
		color: white !important;
		background: white !important;
	}

	.ant-menu.ant-menu-inline-collapsed {
		min-height: 850px;
	}

	.ant-menu.ant-menu-dark,
	.ant-menu.ant-menu-dark {
		color: rgba(255, 255, 255, 0.65);
		background: #262639;
	}

	.ant-menu-dark .ant-menu-item,
	.ant-menu-dark .ant-menu-item-group-title {
		color: white;
		font-weight: bolder !important;
	}

	.ant-menu-dark .ant-menu-item:hover,
	.ant-menu-dark .ant-menu-item-active,
	.ant-menu-dark .ant-menu-item-selected {
		color: #fff;
		background-color: #1890ff;
	}

	.ant-menu-item {
		display: flex;
		align-items: center;
		svg {
			font-size: ${(props) =>
				props.collapsed
					? "24px"
					: "18px"} !important; /* Increase the size of the icons when collapsed */
			color: #69c0ff; /* Light blue color */
		}
	}

	.ant-menu-item-group-title {
		font-weight: bold;
		color: #fff;
		padding-left: 24px;
		font-size: 16px;
		cursor: default;
		pointer-events: none;
		text-decoration: underline;
		margin-bottom: 0; /* Remove bottom margin to close the gap */
		display: ${(props) =>
			props.collapsed ? "none" : "block"}; /* Hide when collapsed */
	}

	.ant-menu-item-selected {
		background: black !important;
	}

	/* Custom scrollbar */
	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: #1e1e2d;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #2d2d3d;
		border-radius: 10px;
	}

	@media (max-width: 1650px) {
		background: ${(props) => (props.show ? "" : "transparent")};
		ul {
			width: 250px;
			padding: 0px !important;
			margin: 0px !important;
		}
		ul > li {
			font-size: 0.8rem !important;
		}
	}

	@media (max-width: 1200px) {
		width: ${(props) => (props.show ? "20%" : "60%")} !important;
		ul {
			display: ${(props) => (props.show ? "none" : "")};
			margin-top: 0px !important;
			top: 0px !important;
		}
		.ant-menu.ant-menu-dark {
		}
		button {
			margin-top: 5px !important;
		}
	}
`;

const SearchWrapper = styled.div`
	display: flex;
	align-items: center;
	padding: 10px;
	background: #262639;
`;

const StyledInput = styled(Input)`
	background: #262639;
	border-color: #262639;
	color: #fff;
	border-radius: 4px;

	.ant-input {
		background: #262639;
		border: none;
		color: #fff;
		padding-right: 30px;
	}

	.ant-input::placeholder {
		color: #aaa;
		padding-right: 10px; /* Add margin to the right of the placeholder */
	}

	.ant-input-prefix {
		margin-right: 10px;
	}
`;
