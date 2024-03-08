import React from "react";
import { Table } from "antd";
import styled from "styled-components";

const formatNumber = (num) => {
	// Ensure we are dealing with a type Number to avoid formatting issues
	const parsedNum = typeof num === "number" ? num : parseFloat(num);
	return new Intl.NumberFormat("en-US").format(parsedNum);
};

const BookingSourceTable = ({ aggregateByBookingSource, chosenLanguage }) => {
	// Define initial totals
	let totalBookings = 0;
	let totalAmount = 0;
	let totalAmountHoused = 0;
	let totalNights = 0;

	const isArabic = chosenLanguage === "Arabic";
	const currency = isArabic ? "ريال" : "SAR";

	// Convert aggregateByBookingSource to array and map over it
	const dataSource = Object.entries(aggregateByBookingSource).map(
		([source, values], index) => {
			// Convert and validate the values to ensure they're numbers
			const safeTotalBookings = Number(values.totalBookings) || 0;
			const safeTotalAmount = Number(values.total_amount) || 0;
			const safeTotalAmountHoused = Number(values.total_amountHoused) || 0;
			const safeTotalNights = Number(values.totalNights) || 0;

			// Accumulate the totals
			totalBookings += safeTotalBookings;
			totalAmount += safeTotalAmount;
			totalAmountHoused += safeTotalAmountHoused;
			totalNights += safeTotalNights;

			// Return the formatted data
			return {
				key: index,
				booking_source: source,
				totalBookings: formatNumber(safeTotalBookings),
				total_amount: formatNumber(safeTotalAmount) + ` ${currency}`,
				total_amountHoused:
					formatNumber(safeTotalAmountHoused) + ` ${currency}`,
				totalNights: formatNumber(safeTotalNights),
			};
		}
	);

	// Push the totals row to dataSource
	dataSource.push({
		key: "totals",
		booking_source: isArabic ? "الإجماليات" : "Totals",
		totalBookings: formatNumber(totalBookings),
		total_amount: formatNumber(totalAmount) + ` ${currency}`,
		total_amountHoused: formatNumber(totalAmountHoused) + ` ${currency}`,
		totalNights: formatNumber(totalNights),
	});

	const columns = [
		{
			title: isArabic ? "مصدر الحجز" : "Booking Source",
			dataIndex: "booking_source",
			key: "booking_source",
			render: (text) => {
				return text
					.split(" ")
					.map(
						(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
					)
					.join(" ");
			},
		},
		{
			title: isArabic ? "إجمالي الحجوزات" : "Total Bookings",
			dataIndex: "totalBookings",
			key: "totalBookings",
			render: (text, record) => {
				// For all other rows, return the value directly
				return text;
			},
		},
		{
			title: isArabic ? "المبلغ الإجمالي" : "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
			render: (text) => text, // The values are already formatted with comma separators and currency
		},
		{
			title: isArabic ? "المبلغ الإجمالي المسكون" : "Total Amount Housed",
			dataIndex: "total_amountHoused",
			key: "total_amountHoused",
			render: (text) => text, // The values are already formatted with comma separators and currency
		},
		{
			title: isArabic ? "الليالي الإجمالية" : "Total Nights",
			dataIndex: "totalNights",
			key: "totalNights",
		},
	];

	// Define row class to style the total row
	const rowClassName = (record) => {
		return record.key === "totals" ? "totals-row" : "";
	};

	return (
		<BookingSourceTableWrapper>
			<Table
				dataSource={dataSource}
				columns={columns}
				rowClassName={rowClassName}
				pagination={false}
			/>
		</BookingSourceTableWrapper>
	);
};

export default BookingSourceTable;

const BookingSourceTableWrapper = styled.div`
	.ant-table-thead,
	td {
		padding: 10px !important; /* Adjust the padding as needed to control the height */
		font-size: 14px !important; /* Adjust the font size as needed */
	}

	.ant-table-row {
		height: auto; /* Adjust the height as needed */
		line-height: normal; /* Adjust the line height as needed */
	}

	.totals-row td {
		background-color: #717171;
		color: white;
		font-weight: bold;
		font-size: 15px;
		padding: 10px !important; /* Adjust the padding as needed to control the height */
	}

	.totals-row td:hover {
		background-color: #383737 !important;
		color: white;
		font-weight: bold;
		font-size: 14px;
	}
`;
