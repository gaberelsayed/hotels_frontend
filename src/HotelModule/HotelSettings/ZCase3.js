import React, { useRef, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ZCustomInput from "./ZCustomInput";

const ZCase3 = ({
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
	selectedRoomType,
	customRoomType,
	selectedDateRange,
	setSelectedDateRange,
	pricingRate,
	setPricingRate,
	priceError,
	setPriceError,
	getColorForPrice,
	form,
	getRoomColor,
	fromPage,
}) => {
	const calendarRef = useRef(null);
	const priceInputRef = useRef(null);

	useEffect(() => {
		if (
			selectedDateRange[0] &&
			selectedDateRange[1] &&
			fromPage === "Updating"
		) {
			const calendarApi = calendarRef.current.getApi();
			const tempEvent = {
				title: "Selected",
				start: selectedDateRange[0].toISOString().split("T")[0],
				end: selectedDateRange[1].toISOString().split("T")[0],
				allDay: true,
				backgroundColor: "lightgrey",
			};
			calendarApi.addEvent(tempEvent);
		}
	}, [selectedDateRange, fromPage]);

	const generateDateRangeArray = (startDate, endDate) => {
		const dateArray = [];
		let currentDate = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			startDate.getDate()
		);
		const end = new Date(
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate()
		);

		while (currentDate <= end) {
			const date = new Date(currentDate);
			date.setHours(0, 0, 0, 0);
			dateArray.push(date);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dateArray;
	};

	const handleDatePickerChange = (dates) => {
		const [start, end] = dates;
		setSelectedDateRange([start, end]);

		if (start && end) {
			const adjustedEnd = new Date(end);
			adjustedEnd.setDate(adjustedEnd.getDate() + 1);

			const calendarApi = calendarRef.current.getApi();

			const existingSelectedEvents = calendarApi
				.getEvents()
				.filter((event) => event.title === "Selected");
			existingSelectedEvents.forEach((event) => event.remove());

			const tempEvent = {
				title: "Selected",
				start: start.toISOString().split("T")[0],
				end: adjustedEnd.toISOString().split("T")[0],
				allDay: true,
				backgroundColor: "lightgrey",
			};

			calendarApi.addEvent(tempEvent);
		}
	};

	const pricingEvents =
		selectedRoomType && hotelDetails.roomCountDetails
			? hotelDetails.roomCountDetails
					.find(
						(room) =>
							room.roomType ===
							(selectedRoomType === "other" ? customRoomType : selectedRoomType)
					)
					?.pricingRate?.map((rate) => ({
						title: `${
							(form.getFieldValue("displayName").length > 8
								? form.getFieldValue("displayName").slice(0, 8) + "..."
								: form.getFieldValue("displayName")) || selectedRoomType
						}: ${rate.price} SAR`,
						start: rate.calendarDate,
						end: rate.calendarDate,
						allDay: true,
						backgroundColor: rate.color || getColorForPrice(rate.price),
					})) || [] // Default to an empty array if no pricingRate is available
			: [];

	const handleCalendarSelect = (info) => {
		const selectedStart = new Date(
			info.start.getFullYear(),
			info.start.getMonth(),
			info.start.getDate(),
			0,
			0,
			0
		);

		const selectedEnd = new Date(
			info.end.getFullYear(),
			info.end.getMonth(),
			info.end.getDate() - 1,
			23,
			59,
			59
		);

		setSelectedDateRange([selectedStart, selectedEnd]);

		const dates = [moment(selectedStart), moment(selectedEnd)];
		form.setFieldsValue({
			dateRange: dates,
		});
	};

	const handleDateRangeSubmit = () => {
		if (!pricingRate) {
			setPriceError(true);
			return;
		}

		const roomType =
			selectedRoomType === "other" ? customRoomType : selectedRoomType;
		const fullDisplayName = form.getFieldValue("displayName");

		const truncatedDisplayName =
			fullDisplayName.length > 8
				? fullDisplayName.slice(0, 8) + "..."
				: fullDisplayName;

		const roomIndex = hotelDetails.roomCountDetails.findIndex(
			(room) =>
				room.roomType === roomType && room.displayName === fullDisplayName
		);

		const newPricingRates = generateDateRangeArray(
			selectedDateRange[0],
			selectedDateRange[1]
		).map((date) => ({
			calendarDate: date.toISOString().split("T")[0],
			room_type: roomType,
			price: pricingRate,
			color: getColorForPrice(pricingRate, selectedDateRange.join("-")),
		}));

		const updatedRoomCountDetails = [...hotelDetails.roomCountDetails];

		if (roomIndex > -1) {
			let existingRates = updatedRoomCountDetails[roomIndex].pricingRate || [];

			existingRates = existingRates.filter(
				(rate) =>
					!newPricingRates.some(
						(newRate) => newRate.calendarDate === rate.calendarDate
					)
			);

			updatedRoomCountDetails[roomIndex].pricingRate = [
				...existingRates,
				...newPricingRates,
			];
		} else {
			updatedRoomCountDetails.push({
				roomType,
				displayName: fullDisplayName,
				pricingRate: newPricingRates,
			});
		}

		setHotelDetails((prevDetails) => ({
			...prevDetails,
			roomCountDetails: updatedRoomCountDetails,
		}));

		const calendarApi = calendarRef.current.getApi();
		newPricingRates.forEach((rate) => {
			const existingEvents = calendarApi
				.getEvents()
				.filter(
					(event) =>
						event.startStr === rate.calendarDate &&
						event.title.includes(truncatedDisplayName)
				);
			existingEvents.forEach((event) => event.remove());

			calendarApi.addEvent({
				title: `${truncatedDisplayName}: ${rate.price} SAR`,
				start: rate.calendarDate,
				end: rate.calendarDate,
				allDay: true,
				backgroundColor: rate.color,
			});
		});

		handleCancelSelection();

		message.success("Date range added successfully!");
	};

	const handleCancelSelection = () => {
		setSelectedDateRange([null, null]);
		setPricingRate("");
		setPriceError(false);

		const calendarApi = calendarRef.current.getApi();
		const existingSelectedEvents = calendarApi
			.getEvents()
			.filter((event) => event.title === "Selected");
		existingSelectedEvents.forEach((event) => event.remove());
	};

	return (
		<ZCase3Wrapper
			isArabic={chosenLanguage === "Arabic"}
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
		>
			<div className='row'>
				<div className='col-md-9'>
					<FullCalendar
						ref={calendarRef}
						plugins={[dayGridPlugin, interactionPlugin]}
						initialView='dayGridMonth'
						events={pricingEvents}
						selectable={true}
						headerToolbar={{
							left: "prev,next today",
							center: "title",
							right: "dayGridMonth",
						}}
						select={handleCalendarSelect}
						selectAllow={() => true}
					/>
				</div>
				<div className='col-md-3'>
					<h4 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
						{chosenLanguage === "Arabic"
							? `تسعير الغرفة: ${form.getFieldValue("displayName")}`
							: `Pricing for room: ${form.getFieldValue("displayName")}`}
					</h4>
					<label>
						{chosenLanguage === "Arabic" ? "نطاق التاريخ" : "Date Range"}
					</label>
					<Form.Item
						dir='ltr'
						className='w-100'
						name='dateRange'
						rules={[{ required: true, message: "Please select a date range" }]}
					>
						<DatePicker
							selected={selectedDateRange[0]}
							onChange={handleDatePickerChange}
							startDate={selectedDateRange[0]}
							endDate={selectedDateRange[1]}
							className='w-100'
							selectsRange
							customInput={<ZCustomInput />}
						/>
					</Form.Item>
					{selectedDateRange[0] && selectedDateRange[1] ? (
						<>
							<h4 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
								{chosenLanguage === "Arabic"
									? `النطاق الزمني المحدد هو من ${selectedDateRange[0].toLocaleDateString(
											"ar-EG"
									  )} إلى ${selectedDateRange[1].toLocaleDateString(
											"ar-EG"
									  )}, هل ترغب في الإلغاء؟`
									: `The selected date range is from ${selectedDateRange[0].toLocaleDateString()} to ${selectedDateRange[1].toLocaleDateString()}, would you like to cancel?`}
								<label className='mx-3' style={{ color: "darkred" }}>
									<input
										type='radio'
										name='cancel'
										onClick={handleCancelSelection}
									/>
									{chosenLanguage === "Arabic" ? "نعم" : "Yes"}
								</label>
							</h4>
							<div>
								<label>
									{chosenLanguage === "Arabic" ? "سعر النطاق:" : "Price Range:"}
								</label>
								<Input
									type='number'
									value={pricingRate}
									onChange={(e) => {
										setPricingRate(e.target.value);
										setPriceError(false);
									}}
									ref={priceInputRef}
									placeholder={
										chosenLanguage === "Arabic" ? "سعر النطاق" : "Price Range"
									}
									style={{
										width: "100%",
										padding: "8px",
										marginTop: "8px",
										fontSize: "1rem",
										border: "1px solid #d9d9d9",
										borderRadius: "4px",
										backgroundColor: "#fff",
										transition: "all 0.3s",
										boxSizing: "border-box",
									}}
								/>
								{priceError && (
									<div style={{ color: "red" }}>
										{chosenLanguage === "Arabic"
											? "الرجاء إدخال سعر النطاق"
											: "Please enter the price range"}
									</div>
								)}
							</div>
							<div className='text-center mt-3'>
								<Button
									onClick={handleDateRangeSubmit}
									className='btn btn-primary'
								>
									{chosenLanguage === "Arabic"
										? "إضافة سعر النطاق"
										: "Add Pricing Rate Range"}
								</Button>
							</div>
						</>
					) : (
						<div className='text-center mt-3'>
							<Button className='btn btn-primary' disabled>
								{chosenLanguage === "Arabic"
									? "الرجاء تحديد نطاق تاريخ"
									: "Please select a date range"}
							</Button>
						</div>
					)}
				</div>
			</div>
		</ZCase3Wrapper>
	);
};

export default ZCase3;

const ZCase3Wrapper = styled.div``;
