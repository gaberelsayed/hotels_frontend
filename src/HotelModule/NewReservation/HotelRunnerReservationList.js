import React, { useState, useEffect } from "react";
import {
	getPaginatedListHotelRunner,
	prereservationList,
	prereservationTotalRecords,
	prerservationAuto,
} from "../apiAdmin";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import PreReservationTable from "../ReservationsFolder/PreReservationTable";
import { Spin } from "antd";

const HotelRunnerReservationList = ({ chosenLanguage, hotelDetails }) => {
	const [allPreReservations, setAllPreReservations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1); // New state for current page
	const [recordsPerPage] = useState(50); // You can adjust this as needed
	const [selectedFilter, setSelectedFilter] = useState(""); // New state for selected filter
	const [totalRecords, setTotalRecords] = useState(0);

	const [q, setQ] = useState("");
	const [searchClicked, setSearchClicked] = useState(false);
	const [decrement, setDecrement] = useState(0);

	// eslint-disable-next-line
	const { user } = isAuthenticated();

	const getAllPreReservation = () => {
		setLoading(true); // Set loading to true when fetching data
		prereservationList(
			currentPage,
			recordsPerPage,
			JSON.stringify({ selectedFilter }),
			hotelDetails._id
		)
			.then((data) => {
				if (data && data.error) {
					console.log(data.error);
				} else {
					setAllPreReservations(data && data.length > 0 ? data : []);
				}
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false)); // Set loading to false after fetching
	};

	useEffect(() => {
		// Fetch total records
		prereservationTotalRecords(hotelDetails._id).then((data) => {
			if (data && data.error) {
				console.log(data.error);
			} else {
				setTotalRecords(data.total); // Set total records
			}
		});
		if (!searchClicked || !q) {
			getAllPreReservation();
		}
		// eslint-disable-next-line
	}, [currentPage, selectedFilter, searchClicked]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleFilterChange = (newFilter) => {
		setSelectedFilter(newFilter);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	const addPreReservations = () => {
		const isConfirmed = window.confirm(
			chosenLanguage === "Arabic"
				? "قد تستغرق هذه العملية بضع دقائق، هل تريد المتابعة؟"
				: "This may take a few minutes, Do you want to proceed?"
		);
		if (!isConfirmed) return;

		setLoading(true);
		getPaginatedListHotelRunner(1, 15).then((data0) => {
			if (data0 && data0.error) {
				console.log(data0.error);
			} else {
				prerservationAuto(
					data0.pages - decrement,
					hotelDetails._id,
					hotelDetails.belongsTo._id
				).then((data) => {
					if (data) {
						console.log(data, "data from prereservation");
					}
					setDecrement(decrement + 3);
					setLoading(false);
				});
			}
		});
	};

	return (
		<HotelRunnerReservationListWrapper>
			{loading ? (
				<>
					<div className='text-center my-5'>
						<Spin size='large' />
						<p>
							{" "}
							{chosenLanguage === "Arabic" ? "" : ""} Loading Reservations...
						</p>
					</div>
				</>
			) : (
				<>
					<div
						className='mx-auto mb-5 mt-4 text-center'
						onClick={() => {
							addPreReservations();
						}}
					>
						<button className='btn btn-success' style={{ fontWeight: "bold" }}>
							{chosenLanguage === "Arabic"
								? "تنزيل جميع الحجوزات من Booking.com وExpedia وTrivago؟"
								: "Get All Reservations from Booking.com, Expedia & Trivago?"}
						</button>
					</div>
					<div>
						<PreReservationTable
							allPreReservations={allPreReservations}
							setQ={setQ}
							q={q}
							chosenLanguage={chosenLanguage}
							handlePageChange={handlePageChange}
							handleFilterChange={handleFilterChange}
							currentPage={currentPage}
							recordsPerPage={recordsPerPage}
							selectedFilter={selectedFilter}
							setSelectedFilter={setSelectedFilter}
							totalRecords={totalRecords}
							setAllPreReservations={setAllPreReservations}
							setSearchClicked={setSearchClicked}
							searchClicked={searchClicked}
							getAllPreReservation={getAllPreReservation}
						/>
					</div>
				</>
			)}
		</HotelRunnerReservationListWrapper>
	);
};

export default HotelRunnerReservationList;

const HotelRunnerReservationListWrapper = styled.div`
	margin-top: 50px;
	margin-bottom: 50px;
	margin-right: 20px;
`;
