import React from "react";
import * as XLSX from "xlsx";
import moment from "moment";

const DownloadExcel = ({ data, columns, currentPage, recordsPerPage }) => {
	const downloadExcelDocument = () => {
		// Create a new workbook
		const workbook = XLSX.utils.book_new();

		// Generate the index on the fly and format the data for Excel
		const formattedData = data.map((row, index) => {
			const rowIndex = (currentPage - 1) * recordsPerPage + index + 1;
			const formattedRow = {};

			columns.forEach((col) => {
				let cellValue = row[col.dataIndex];

				if (col.key === "index") {
					cellValue = rowIndex;
				} else if (col.key === "roomDetails" && row.roomDetails) {
					cellValue = row.roomDetails
						.map((room) => room.room_number || "No Room")
						.join(", ");
				} else if (col.key === "details") {
					cellValue = "Details"; // Since we cannot include buttons in Excel, replace with text
				} else if (col.render && typeof cellValue !== "undefined") {
					// For dates and other fields that use render functions in your table
					cellValue = col.render(cellValue, row);
				}

				// Format date fields directly without using render functions
				if (
					col.dataIndex === "booked_at" ||
					col.dataIndex === "checkin_date" ||
					col.dataIndex === "checkout_date"
				) {
					cellValue = moment(cellValue).format("YYYY-MM-DD");
				}

				// Ensure "Total Amount" is formatted as a number
				if (col.dataIndex === "total_amount") {
					cellValue = parseFloat(cellValue);
				}

				formattedRow[col.title] = cellValue;
			});

			return formattedRow;
		});

		// Convert formatted data to worksheet format
		const worksheet = XLSX.utils.json_to_sheet(formattedData);

		// Add the worksheet to the workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

		// Write the workbook and trigger the download
		XLSX.writeFile(workbook, "Reservations.xlsx");
	};

	return (
		<button onClick={downloadExcelDocument} className='btn btn-info float-left'>
			Download Report To Excel
		</button>
	);
};

export default DownloadExcel;
