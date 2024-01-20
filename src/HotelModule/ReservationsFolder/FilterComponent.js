import React from "react";
import styled from "styled-components";

const FiltersContainer = styled.div`
	display: flex;
	justify-content: space-around;
	background: #f8f8f8;
	padding: 10px;
	border-bottom: 2px solid #e1e1e1;
`;

const FilterGroup = styled.div`
	display: flex;
	gap: 10px;
	align-items: center;
`;

const FilterButton = styled.button`
	background: ${({ active }) => (active ? "lightgrey" : "white")};
	border: 1px solid #ccc;
	padding: 5px 10px;
	cursor: pointer;
	font-weight: ${({ active }) => (active ? "bold" : "normal")};
	font-size: 0.8rem;
	transition:
		background-color 0.3s,
		font-weight 0.3s; // Smooth transition for background-color and font-weight

	&:hover {
		background: #e9e9e9;
		transition: 0.3s;
		font-weight: bold;
	}
`;

const FilterComponent = ({
	selectedFilter,
	setSelectedFilter,
	chosenLanguage,
}) => {
	const handleFilterClick = (filterName) => {
		setSelectedFilter((prevFilter) =>
			prevFilter === filterName ? "" : filterName
		); // Toggle selection
	};

	// Define filter labels in both English and Arabic
	const filterLabels = {
		"New Reservation": "حجز جديد",
		Cancelations: "الإلغاءات",
		"Today's Arrivals": "وصول اليوم",
		"Today's Departures": "مغادرة اليوم",
		"In House": "في المنزل",
		"Incomplete reservations": "الحجوزات الغير مكتملة",
	};

	// Define the filter buttons based on chosenLanguage
	const filterButtons = [
		{ key: "New Reservation", label: filterLabels["New Reservation"] },
		{ key: "Cancelations", label: filterLabels["Cancelations"] },
		{ key: "Today's Arrivals", label: filterLabels["Today's Arrivals"] },
		{ key: "Today's Departures", label: filterLabels["Today's Departures"] },
		{ key: "In House", label: filterLabels["In House"] },
		{
			key: "Incomplete reservations",
			label: filterLabels["Incomplete reservations"],
		},
	];

	return (
		<FiltersContainer>
			<FilterGroup>
				{filterButtons.map(({ key, label }) => (
					<FilterButton
						key={key}
						active={selectedFilter === key}
						onClick={() => handleFilterClick(key)}
					>
						{chosenLanguage === "Arabic" ? label : key}
					</FilterButton>
				))}
			</FilterGroup>
		</FiltersContainer>
	);
};

export default FilterComponent;
