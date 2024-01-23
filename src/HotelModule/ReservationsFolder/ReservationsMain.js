import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import AdminNavbarArabic from "../AdminNavbar/AdminNavbarArabic";
import styled from "styled-components";
import { useCartContext } from "../../cart_context";
import {
	getHotelDetails,
	getHotelReservations,
	getHotelReservations2,
	hotelAccount,
	prereservationList,
	prereservationTotalRecords,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import PreReservationTable from "./PreReservationTable";
import { Link } from "react-router-dom";

const isActive = (history, path) => {
	if (history === path) {
		return {
			background: "#0f377e",
			fontWeight: "bold",
			borderRadius: "5px",
			fontSize: "1.1rem",
			textAlign: "center",
			padding: "10px",
			color: "white",
			transition: "var(--mainTransition)",

			// textDecoration: "underline",
		};
	} else {
		return {
			backgroundColor: "grey",
			padding: "10px",
			borderRadius: "5px",
			fontSize: "1rem",
			fontWeight: "bold",
			textAlign: "center",
			cursor: "pointer",
			transition: "var(--mainTransition)",
			color: "white",
		};
	}
};

const ReservationsMain = () => {
	const [websiteMenu, setWebsiteMenu] = useState("Pre-Reservation");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	// eslint-disable-next-line
	const [allReservations, setAllReservations] = useState([]);
	const [allPreReservations, setAllPreReservations] = useState([]);
	const [hotelDetails, setHotelDetails] = useState([]);
	// eslint-disable-next-line
	const [q, setQ] = useState("");
	const [q2, setQ2] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1); // New state for current page
	const [recordsPerPage] = useState(50); // You can adjust this as needed
	const [selectedFilter, setSelectedFilter] = useState(""); // New state for selected filter
	const [totalRecords, setTotalRecords] = useState(0);
	const [searchClicked, setSearchClicked] = useState(false);

	const { languageToggle, chosenLanguage } = useCartContext();

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}
		// eslint-disable-next-line
	}, []);

	const getAllReservations = () => {
		setLoading(true);
		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						setHotelDetails(data2[0]);
						if (
							data &&
							data.name &&
							data._id &&
							data2 &&
							data2.length > 0 &&
							data2[0] &&
							data2[0]._id
						) {
							getHotelReservations(data2[0]._id).then((data3) => {
								if (data3 && data3.error) {
									console.log(data3.error);
								} else {
									getHotelReservations2(data2[0]._id).then((data3) => {
										if (data3 && data3.error) {
											console.log(data3.error);
										} else {
											setAllReservations(
												data3 && data3.length > 0 ? data3 : []
											);
										}
									});

									prereservationTotalRecords(data2[0]._id).then((data3) => {
										if (data && data.error) {
											console.log(data.error);
										} else {
											setTotalRecords(data3.total); // Set total records
										}
									});

									prereservationList(
										currentPage,
										recordsPerPage,
										JSON.stringify({ selectedFilter }),
										data2[0]._id
									)
										.then((data3) => {
											if (data3 && data3.error) {
												console.log(data3.error);
											} else {
												setAllPreReservations(
													data3 && data3.length > 0 ? data3 : []
												);
											}
										})
										.catch((err) => console.log(err))
										.finally(() => setLoading(false)); // Set loading to false after fetching
								}
							});
						}
					}
				});
			}
		});
	};

	useEffect(() => {
		getAllReservations();
		// eslint-disable-next-line
	}, [currentPage, recordsPerPage, searchClicked]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleFilterChange = (newFilter) => {
		setSelectedFilter(newFilter);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	// console.log(allPreReservations, "allPre");

	return (
		<ReservationsMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					{chosenLanguage === "Arabic" ? (
						<AdminNavbarArabic
							fromPage='Reservations'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					) : (
						<AdminNavbar
							fromPage='Reservations'
							AdminMenuStatus={AdminMenuStatus}
							setAdminMenuStatus={setAdminMenuStatus}
							collapsed={collapsed}
							setCollapsed={setCollapsed}
							chosenLanguage={chosenLanguage}
						/>
					)}
				</div>

				<div className='otherContentWrapper'>
					<div
						style={{
							textAlign: chosenLanguage === "Arabic" ? "left" : "right",
							fontWeight: "bold",
							textDecoration: "underline",
							cursor: "pointer",
						}}
						onClick={() => {
							if (chosenLanguage === "English") {
								languageToggle("Arabic");
							} else {
								languageToggle("English");
							}
						}}
					>
						{chosenLanguage === "English" ? "ARABIC" : "English"}
					</div>

					<div className='container-wrapper'>
						<div
							className='row text-center'
							style={{
								justifyContent: "center",
							}}
						>
							<div
								style={isActive(websiteMenu, "Pre-Reservation")}
								className='menuItems col-md-4 col-5 my-3'
								onClick={() => setWebsiteMenu("Pre-Reservation")}
							>
								<Link
									style={{
										color:
											websiteMenu === "Pre-Reservation" ? "white" : "white",
									}}
									onClick={() => setWebsiteMenu("Pre-Reservation")}
									to='#'
								>
									<i className='fa fa-edit mx-1'></i>
									{chosenLanguage === "Arabic"
										? "Pre-Reservation"
										: "Pre-Reservation"}
								</Link>
							</div>
						</div>

						<div>
							<PreReservationTable
								allPreReservations={allPreReservations}
								setQ={setQ2}
								q={q2}
								chosenLanguage={chosenLanguage}
								handlePageChange={handlePageChange}
								handleFilterChange={handleFilterChange}
								currentPage={currentPage}
								recordsPerPage={recordsPerPage}
								selectedFilter={selectedFilter}
								setSelectedFilter={setSelectedFilter}
								totalRecords={totalRecords}
								loading={loading}
								setLoading={setLoading}
								hotelDetails={hotelDetails}
								setAllPreReservations={setAllPreReservations}
								searchClicked={searchClicked}
								setSearchClicked={setSearchClicked}
							/>
						</div>
					</div>
				</div>
			</div>
		</ReservationsMainWrapper>
	);
};

export default ReservationsMain;

const ReservationsMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 90%" : "15% 84%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;

		table {
			width: 100%; // Ensures the table uses the full width

			th,
			td {
				vertical-align: middle; // Centers content vertically in each cell
				text-align: center; // Centers content horizontally
				padding: 8px; // Adds some padding for better readability
			}
		}
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
