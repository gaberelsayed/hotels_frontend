import React from "react";
import styled from "styled-components";
import TableViewReportPending from "./TableViewReportPending";

const PendingReservationPayments = ({
	allReservations,
	setCurrentPage,
	currentPage,
	totalRecords,
	chosenLanguage,
	hotelDetails,
	recordsPerPage,
	scoreCardObject,
	data,
	buy,
}) => {
	return (
		<PendingReservationPaymentsWrapper>
			<TableViewReportPending
				allReservations={allReservations}
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				totalRecords={totalRecords}
				chosenLanguage={chosenLanguage}
				hotelDetails={hotelDetails}
				recordsPerPage={recordsPerPage}
				scoreCardObject={scoreCardObject}
				data={data}
				buy={buy}
			/>
		</PendingReservationPaymentsWrapper>
	);
};

export default PendingReservationPayments;

const PendingReservationPaymentsWrapper = styled.div``;
