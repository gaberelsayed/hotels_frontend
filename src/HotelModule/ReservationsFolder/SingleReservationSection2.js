import React, { useState } from "react";
import styled from "styled-components";

const SingleReservationSection2 = () => {
	const [activeTab, setActiveTab] = useState("general");

	return (
		<SingleReservationSection2Wrapper>
			<h3>Reservation Details</h3>
			<div className='my-2 tab-grid'>
				<Tab
					isActive={activeTab === "general"}
					onClick={() => setActiveTab("general")}
				>
					General Info
				</Tab>
				<Tab
					isActive={activeTab === "roomRates"}
					onClick={() => setActiveTab("roomRates")}
				>
					Room Rates
				</Tab>
				<Tab
					isActive={activeTab === "edit"}
					onClick={() => setActiveTab("edit")}
				>
					Edit
				</Tab>
			</div>
		</SingleReservationSection2Wrapper>
	);
};

export default SingleReservationSection2;

const SingleReservationSection2Wrapper = styled.div`
	.tab-grid {
		display: flex;
		/* Additional styling for grid layout */
	}
`;

const Tab = styled.div`
	cursor: pointer;
	margin: 0 3px; /* 3px margin between tabs */
	padding: 5px; /* Adjust padding as needed */
	font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
	background-color: ${(props) =>
		props.isActive
			? "transparent"
			: "#f2f2f2"}; /* Light grey for unselected tabs */
	box-shadow: ${(props) =>
		props.isActive ? "inset 0px 0px 10px rgba(0, 0, 0, 0.2)" : "none"};
	transition: all 0.3s ease; /* Smooth transition for changes */
	min-width: 25px; /* Minimum width of the tab */
	width: 100%; /* Full width within the container */
	text-align: center; /* Center the text inside the tab */
	/* Additional styling for tabs */
`;
