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

const ZUpdateCase3 = ({
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
	existingRoomDetails, // Pass the selected room's details
}) => {
	const calendarRef = useRef(null);
	const priceInputRef = useRef(null);

	// Prepopulate selected date range and pricing events for the selected room
	useEffect(() => {
		if (existingRoomDetails && existingRoomDetails.pricingRate) {
			const prepopulatedEvents = existingRoomDetails.pricingRate.map(
				(rate) => ({
					title: `${existingRoomDetails.displayName.slice(0, 10) || "Room"}: ${
						rate.price
					} SAR`,
					start: rate.calendarDate,
					end: rate.calendarDate,
					allDay: true,
					backgroundColor: rate.color || getColorForPrice(rate.price),
				})
			);

			if (calendarRef.current) {
				const calendarApi = calendarRef.current.getApi();
				calendarApi.getEvents().forEach((event) => event.remove()); // Clear previous events
				prepopulatedEvents.forEach((event) => calendarApi.addEvent(event));
			}
		}
	}, [existingRoomDetails, getColorForPrice]);

	// Helper function to generate an array of dates between two dates
	const generateDateRangeArray = (startDate, endDate) => {
		const dateArray = [];
		let currentDate = new Date(startDate);
		const end = new Date(endDate);

		while (currentDate <= end) {
			dateArray.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dateArray;
	};

	// Handle the date range selection from the date picker
	const handleDatePickerChange = (dates) => {
		const [start, end] = dates;
		setSelectedDateRange([start, end]);

		if (start && end) {
			const adjustedEnd = new Date(end);
			adjustedEnd.setDate(adjustedEnd.getDate() + 1);

			const calendarApi = calendarRef.current.getApi();
			const tempEvent = {
				title: "Selected",
				start: start.toISOString().split("T")[0],
				end: adjustedEnd.toISOString().split("T")[0],
				allDay: true,
				backgroundColor: "lightgrey",
			};

			const existingSelectedEvents = calendarApi
				.getEvents()
				.filter((event) => event.title === "Selected");
			existingSelectedEvents.forEach((event) => event.remove());

			calendarApi.addEvent(tempEvent);
		}
	};

	// Handle calendar selection
	const handleCalendarSelect = (info) => {
		const selectedStart = new Date(info.start);
		const selectedEnd = new Date(info.end);
		selectedEnd.setDate(selectedEnd.getDate() - 1);

		setSelectedDateRange([selectedStart, selectedEnd]);

		const dates = [moment(selectedStart), moment(selectedEnd)];
		form.setFieldsValue({
			dateRange: dates,
		});
	};

	// Submit the pricing data for the selected date range
	const handleDateRangeSubmit = () => {
		if (!pricingRate) {
			setPriceError(true);
			return;
		}

		const roomType =
			selectedRoomType === "other" ? customRoomType : selectedRoomType;
		const fullDisplayName = form.getFieldValue("displayName");

		const newPricingRates = generateDateRangeArray(
			selectedDateRange[0],
			selectedDateRange[1]
		).map((date) => ({
			calendarDate: date.toISOString().split("T")[0],
			room_type: roomType,
			price: pricingRate,
			color: getColorForPrice(pricingRate, selectedDateRange.join("-")),
		}));

		// Update the roomCountDetails state with new pricing data
		setHotelDetails((prevDetails) => {
			const updatedRoomCountDetails = prevDetails.roomCountDetails.map(
				(room) => {
					if (room._id === existingRoomDetails._id) {
						// Merge existing rates with new ones, ensuring no duplicates
						const mergedRates = [
							...(room.pricingRate || []).filter(
								(rate) =>
									!newPricingRates.some(
										(newRate) => newRate.calendarDate === rate.calendarDate
									)
							),
							...newPricingRates,
						];
						return { ...room, pricingRate: mergedRates };
					}
					return room;
				}
			);
			return { ...prevDetails, roomCountDetails: updatedRoomCountDetails };
		});

		const calendarApi = calendarRef.current.getApi();
		newPricingRates.forEach((rate) => {
			const existingEvents = calendarApi
				.getEvents()
				.filter((event) => event.startStr === rate.calendarDate);
			existingEvents.forEach((event) => event.remove());

			calendarApi.addEvent({
				title: `${fullDisplayName}: ${rate.price} SAR`,
				start: rate.calendarDate,
				end: rate.calendarDate,
				allDay: true,
				backgroundColor: rate.color,
			});
		});

		handleCancelSelection();

		message.success("Date range added successfully!");
	};

	// Cancel the date range selection
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

	const pricingEvents =
		existingRoomDetails?.pricingRate?.map((rate) => ({
			title: `${existingRoomDetails.displayName}: ${rate.price} SAR`,
			start: rate.calendarDate,
			end: rate.calendarDate,
			allDay: true,
			backgroundColor: rate.color || getColorForPrice(rate.price),
		})) || [];

	return (
		<ZUpdateCase3Wrapper
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
					/>
				</div>
				<div
					className='col-md-3'
					style={{ textAlign: chosenLanguage === "Arabic" ? "right" : "" }}
				>
					<h4 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
						{chosenLanguage === "Arabic"
							? `تسعير الغرفة: ${form?.getFieldValue("displayName") || ""}`
							: `Pricing for room: ${form?.getFieldValue("displayName") || ""}`}
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
							<h4
								style={{
									fontSize: "1.1rem",
									fontWeight: "bold",
									textAlign: chosenLanguage === "Arabic" ? "right" : "",
								}}
							>
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
										textAlign: chosenLanguage === "Arabic" ? "right" : "",
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
		</ZUpdateCase3Wrapper>
	);
};

export default ZUpdateCase3;

const ZUpdateCase3Wrapper = styled.div``;
