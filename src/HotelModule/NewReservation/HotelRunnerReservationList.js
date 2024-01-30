import React, { useState, useEffect } from "react";
import {
	agodaData,
	bookingData,
	expediaData,
	reservationsList,
	reservationsTotalRecords,
} from "../apiAdmin";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import PreReservationTable from "../ReservationsFolder/PreReservationTable";
import { Spin } from "antd";
import { toast } from "react-toastify";

const HotelRunnerReservationList = ({ chosenLanguage, hotelDetails }) => {
	const [allPreReservations, setAllPreReservations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1); // New state for current page
	const [recordsPerPage] = useState(50); // You can adjust this as needed
	const [selectedFilter, setSelectedFilter] = useState(""); // New state for selected filter
	const [totalRecords, setTotalRecords] = useState(0);

	const [q, setQ] = useState("");
	const [searchClicked, setSearchClicked] = useState(false);

	// eslint-disable-next-line
	const { user } = isAuthenticated();

	const formatDate = (date) => {
		const d = new Date(date);
		let month = "" + (d.getMonth() + 1);
		let day = "" + d.getDate();
		const year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	};

	const getAllPreReservation = () => {
		setLoading(true); // Set loading to true when fetching data
		const today = formatDate(new Date()); // Format today's date

		reservationsList(
			currentPage,
			recordsPerPage,
			JSON.stringify({ selectedFilter }),
			hotelDetails._id,
			today // Pass the formatted date
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
		const today = formatDate(new Date()); // Format today's date

		// Fetch total records
		reservationsTotalRecords(
			currentPage,
			recordsPerPage,
			JSON.stringify({ selectedFilter }),
			hotelDetails._id,
			today // Pass the formatted date
		).then((data) => {
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

	const handleFileUpload = (uploadFunction) => {
		// Ask the user if the upload is from the US
		const isFromUS = window.confirm(
			"Is this upload from the US? Click OK for Yes, Cancel for No."
		);

		// Determine the country parameter based on user response
		const country = isFromUS ? "US" : "NotUS";

		const accountId = hotelDetails._id; // Get the account ID
		const belongsTo = user._id;
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept =
			".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"; // Accept Excel and CSV files
		fileInput.onchange = (e) => {
			setLoading(true);
			const file = e.target.files[0];
			uploadFunction(accountId, belongsTo, file, country).then((data) => {
				setLoading(false);
				if (data.error) {
					console.log(data.error);
					toast.error("Error uploading data");
				} else {
					toast.success("Data uploaded successfully!");
				}
			});
		};
		fileInput.click(); // Simulate a click on the file input
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
					<div className='mx-auto mb-5 mt-4 text-center'>
						<button
							className='btn btn-primary mx-2'
							style={{ fontWeight: "bold" }}
							onClick={() => handleFileUpload(agodaData)}
						>
							{chosenLanguage === "Arabic"
								? "رفع بيانات أجودا"
								: "Agoda Upload"}
						</button>
						<button
							className='btn btn-primary mx-2'
							style={{ fontWeight: "bold" }}
							onClick={() => handleFileUpload(expediaData)}
						>
							{chosenLanguage === "Arabic"
								? "رفع بيانات إكسبيديا"
								: "Expedia Upload"}
						</button>
						<button
							className='btn btn-primary mx-2'
							style={{ fontWeight: "bold" }}
							onClick={() => handleFileUpload(bookingData)}
						>
							{chosenLanguage === "Arabic"
								? "رفع بيانات بوكينج"
								: "Booking Upload"}
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
							hotelDetails={hotelDetails}
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
