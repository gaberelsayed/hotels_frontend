import React from "react";
import ApexCharts from "react-apexcharts";

const BarChartComponent = ({
	aggregateByHotelName,
	chosenLanguage,
	selectedMonth,
}) => {
	const isArabic = chosenLanguage === "Arabic";
	const currency = isArabic ? "ريال" : "SAR";
	const totalAmountText = isArabic ? "المبلغ الإجمالي" : "Total Amount";
	const totalAmountHousedText = isArabic
		? "المبلغ الإجمالي المسكون"
		: "Total Amount Housed";

	const data = Object.entries(aggregateByHotelName).map(
		([hotelName, values]) => {
			return {
				x: hotelName,
				y: [values.total_amount, values.total_amountHoused],
			};
		}
	);

	const options = {
		chart: {
			type: "bar",
			height: 350,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "45%",
				dataLabels: {
					position: "top", // top of the bars
				},
			},
		},
		colors: ["#FFA600", "#717171"], // orange and darkgrey
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return (
					new Intl.NumberFormat(isArabic ? "en-US" : "en-US").format(val) +
					" " +
					currency
				);
			},
			offsetY: -28,
			style: {
				fontSize: "13px",
				colors: ["#304758"],
				fontWeight: "bold",
			},
		},
		xaxis: {
			categories: data.map((datum) => datum.x),
			labels: {
				style: {
					fontSize: "12px",
					fontWeight: 500,
					cssClass: "apexcharts-xaxis-label",
				},
				formatter: (value) => value.charAt(0).toUpperCase() + value.slice(1), // Capitalize hotel names
			},
		},
		yaxis: {
			title: {
				text: "Amounts",
			},
			labels: {
				formatter: function (val) {
					return (
						new Intl.NumberFormat(isArabic ? "en-US" : "en-US").format(val) +
						" " +
						currency
					);
				},
			},
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return (
						new Intl.NumberFormat(isArabic ? "en-US" : "en-US").format(val) +
						" " +
						currency
					);
				},
			},
		},
		title: {
			text: isArabic
				? ` مقارنة إيرادات الفنادق ${selectedMonth}`
				: `Hotel Revenue Comparison (${selectedMonth})`, // Replace with the correct Arabic translation if needed
			align: "center",
			margin: 20,
			offsetY: 20,
			style: {
				fontSize: "24px",
			},
		},
	};

	const series = [
		{
			name: totalAmountText,
			data: data.map((datum) => datum.y[0]),
		},
		{
			name: totalAmountHousedText,
			data: data.map((datum) => datum.y[1]),
		},
	];

	return (
		<ApexCharts options={options} series={series} type='bar' height={350} />
	);
};

export default BarChartComponent;
