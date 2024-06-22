import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, message } from "antd";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ImageCard from "./ImageCard";
import ImageCardMain from "./ImageCardMain";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ZCustomInput from "./ZCustomInput";

const { Option } = Select;

const ZHotelDetailsForm2 = ({
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
	roomTypes,
	currentStep,
	setCurrentStep,
	setSelectedRoomType,
	selectedRoomType,
	amenitiesList,
	roomTypeSelected,
	setRoomTypeSelected,
}) => {
	const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
	const [pricingRate, setPricingRate] = useState("");
	const [customRoomType, setCustomRoomType] = useState("");
	const [priceError, setPriceError] = useState(false);
	const calendarRef = useRef(null);
	const priceInputRef = useRef(null);
	const [form] = Form.useForm();
	const [hotelPhotos] = useState(hotelDetails.hotelPhotos || []);

	useEffect(() => {
		if (selectedRoomType) {
			const roomType =
				selectedRoomType === "other" ? customRoomType : selectedRoomType;
			const existingRoomDetails = hotelDetails.roomCountDetails[roomType] || {};
			form.setFieldsValue({
				roomType: selectedRoomType,
				customRoomType: selectedRoomType === "other" ? customRoomType : "",
				roomCount: existingRoomDetails.count || 0,
				basePrice: existingRoomDetails.price?.basePrice || 0,
				description: existingRoomDetails.description || "",
				amenities: existingRoomDetails.amenities || [],
			});
			setRoomTypeSelected(true);
		}
		// eslint-disable-next-line
	}, [selectedRoomType, customRoomType, form, hotelDetails]);

	useEffect(() => {
		form.setFieldsValue({
			parkingLot: hotelDetails.parkingLot ? "1" : "0",
			hotelFloors: hotelDetails.hotelFloors,
		});
	}, [form, hotelDetails]);

	useEffect(() => {
		if (selectedDateRange[0] && selectedDateRange[1]) {
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
		// eslint-disable-next-line
	}, [selectedDateRange]);

	const handleNext = () => {
		form
			.validateFields()
			.then((values) => {
				const roomType =
					values.roomType === "other" ? values.customRoomType : values.roomType;
				const roomColor = getRoomColor(roomType);
				const updatedRoomCountDetails = {
					...hotelDetails.roomCountDetails,
					[roomType]: {
						...(hotelDetails.roomCountDetails[roomType] || {}),
						count: values.roomCount,
						price: { basePrice: values.basePrice },
						description: values.description,
						amenities: values.amenities,
						pricingRate:
							hotelDetails.roomCountDetails[roomType]?.pricingRate || [],
						roomColor,
					},
				};

				setHotelDetails((prevDetails) => ({
					...prevDetails,
					roomCountDetails: updatedRoomCountDetails,
				}));

				setCurrentStep(currentStep + 1);
			})
			.catch((info) => {
				message.error("Please fill in the required fields.");
			});
	};

	const handlePrev = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleFinish = (values) => {
		setHotelDetails((prevDetails) => ({
			...prevDetails,
			...values,
		}));
		message.success("Hotel details updated successfully!");
	};

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
			date.setHours(0, 0, 0, 0); // Set time to 00:00:00
			dateArray.push(date);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dateArray;
	};

	const handleDateRangeSubmit = () => {
		if (!pricingRate) {
			setPriceError(true);
			return;
		}

		const roomType =
			selectedRoomType === "other" ? customRoomType : selectedRoomType;
		const updatedRoomCountDetails = {
			...hotelDetails.roomCountDetails,
			[roomType]: {
				count: 0,
				price: { basePrice: 0 },
				photos: [],
				description: "",
				amenities: [],
				pricingRate: hotelDetails.roomCountDetails[roomType]?.pricingRate || [],
				...hotelDetails.roomCountDetails[roomType],
			},
		};

		const newPricingRate = generateDateRangeArray(
			selectedDateRange[0],
			selectedDateRange[1]
		).map((date) => ({
			calendarDate: date.toISOString().split("T")[0],
			room_type: roomType,
			price: pricingRate,
			color: getColorForPrice(pricingRate),
		}));

		const existingRates = updatedRoomCountDetails[roomType].pricingRate || [];

		// Convert dates to strings for comparison
		const startRange = selectedDateRange[0].toISOString().split("T")[0];
		const endRange = selectedDateRange[1].toISOString().split("T")[0];

		// Replace existing rates within the selected date range
		const updatedRates = existingRates.map((rate) => {
			const rateDate = rate.calendarDate;

			if (rateDate >= startRange && rateDate <= endRange) {
				// Find the new rate for this date
				const newRate = newPricingRate.find(
					(newRate) => newRate.calendarDate === rateDate
				);
				return newRate ? newRate : rate;
			}
			return rate;
		});

		// Add any new rates that were not in the existing range
		newPricingRate.forEach((newRate) => {
			if (
				!updatedRates.some((rate) => rate.calendarDate === newRate.calendarDate)
			) {
				updatedRates.push(newRate);
			}
		});

		updatedRoomCountDetails[roomType].pricingRate = updatedRates;

		setHotelDetails((prevDetails) => ({
			...prevDetails,
			roomCountDetails: updatedRoomCountDetails,
		}));

		// Clear the selected date range and pricing rate
		setSelectedDateRange([null, null]);
		setPricingRate("");
		setPriceError(false);
		if (priceInputRef.current) {
			priceInputRef.current.focus();
		}
		const calendarApi = calendarRef.current.getApi();
		const events = calendarApi.getEvents();
		events.forEach((event) => {
			if (event.title === "Selected") {
				event.remove();
			}
		});

		message.success("Date range added successfully!");
	};

	const predefinedColors = [
		"#1e90ff",
		"#6495ed",
		"#87ceeb",
		"#b0c4de",
		"#d3d3d3",
	];
	const priceColorMapping = {};
	const getColorForPrice = (price) => {
		if (!priceColorMapping[price]) {
			priceColorMapping[price] =
				predefinedColors[
					Object.keys(priceColorMapping).length % predefinedColors.length
				];
		}
		return priceColorMapping[price];
	};

	const getRoomColor = (roomType) => {
		const predefinedRoomColors = {
			standardRooms: "#003366", // Dark Blue
			singleRooms: "#8B0000", // Dark Red
			doubleRooms: "#004d00", // Dark Green
			twinRooms: "#800080", // Dark Purple
			queenRooms: "#FF8C00", // Dark Orange
			kingRooms: "#2F4F4F", // Dark Slate Gray
			tripleRooms: "#8B4513", // Saddle Brown
			quadRooms: "#00008B", // Navy
			studioRooms: "#696969", // Dim Gray
			suite: "#483D8B", // Dark Slate Blue
			masterSuite: "#556B2F", // Dark Olive Green
			familyRooms: "#A52A2A", // Brown
		};

		if (predefinedRoomColors[roomType]) {
			return predefinedRoomColors[roomType];
		}

		return (
			"#" +
			Math.floor(Math.random() * 16777215)
				.toString(16)
				.padStart(6, "0")
		);
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<>
						<Form.Item
							name='parkingLot'
							label={
								chosenLanguage === "Arabic"
									? "هل يوجد موقف سيارات في فندقك؟"
									: "Does Your Hotel Have A Parking Lot?"
							}
							rules={[{ required: true, message: "Please select an option" }]}
						>
							<Select
								onChange={(value) => {
									setHotelDetails((prevDetails) => ({
										...prevDetails,
										parkingLot: value === "1",
									}));
								}}
							>
								<Option
									value='1'
									style={{
										textAlign: chosenLanguage === "Arabic" ? "right" : "",
									}}
								>
									{chosenLanguage === "Arabic" ? "نعم" : "Yes"}
								</Option>
								<Option
									value='0'
									style={{
										textAlign: chosenLanguage === "Arabic" ? "right" : "",
									}}
								>
									{chosenLanguage === "Arabic" ? "لا" : "No"}
								</Option>
							</Select>
						</Form.Item>
						<Form.Item
							name='hotelFloors'
							label={
								chosenLanguage === "Arabic"
									? "كم عدد الطوابق في فندقك؟"
									: "How Many Floors Does your hotel have?"
							}
							rules={[
								{
									required: true,
									message: "Please input the number of floors",
								},
							]}
						>
							<Input
								type='number'
								onChange={(e) => {
									setHotelDetails((prevDetails) => ({
										...prevDetails,
										hotelFloors: e.target.value,
									}));
								}}
							/>
						</Form.Item>
						<h4>
							{chosenLanguage === "Arabic"
								? "صور عامة عن الفندق (مثل المبنى، الردهة، المصاعد، الخ...)"
								: "General Images About the hotel (e.g. building, lobby, elevators, etc...)"}
						</h4>
						<Form.Item>
							<ImageCardMain
								roomType='hotelPhotos'
								hotelPhotos={hotelPhotos}
								setHotelDetails={setHotelDetails}
							/>
						</Form.Item>
					</>
				);
			case 1:
				return (
					<>
						<Form.Item
							name='roomType'
							label={
								chosenLanguage === "Arabic"
									? "اختر نوع الغرفة"
									: "Select Room Type"
							}
							rules={[{ required: true, message: "Please select a room type" }]}
						>
							<Select
								onChange={(value) => {
									if (value === "other") {
										form.setFieldsValue({ customRoomType: "" });
									}
									setRoomTypeSelected(true);
									setSelectedRoomType(value);
									const roomType = value === "other" ? customRoomType : value;
									const existingRoomDetails =
										hotelDetails.roomCountDetails[roomType] || {};
									form.setFieldsValue({
										roomCount: existingRoomDetails.count || 0,
										basePrice: existingRoomDetails.price?.basePrice || 0,
										description: existingRoomDetails.description || "",
										amenities: existingRoomDetails.amenities || [],
									});
								}}
							>
								{roomTypes.map((room) => (
									<Option
										key={room.value}
										value={room.value}
										style={{
											textAlign: chosenLanguage === "Arabic" ? "right" : "",
											paddingRight: chosenLanguage === "Arabic" ? "20px" : "",
										}}
									>
										{room.label}
									</Option>
								))}
								<Option
									key='other'
									value='other'
									style={{
										textAlign: chosenLanguage === "Arabic" ? "right" : "",
										paddingRight: chosenLanguage === "Arabic" ? "20px" : "",
									}}
								>
									{chosenLanguage === "Arabic" ? "أخرى" : "Other"}
								</Option>
							</Select>
						</Form.Item>
						{form.getFieldValue("roomType") === "other" && (
							<Form.Item
								name='customRoomType'
								label={
									chosenLanguage === "Arabic"
										? "حدد نوع الغرفة الأخرى"
										: "Specify Other Room Type"
								}
								rules={[
									{ required: true, message: "Please specify the room type" },
								]}
							>
								<Input
									value={customRoomType}
									onChange={(e) => setCustomRoomType(e.target.value)}
								/>
							</Form.Item>
						)}
						{roomTypeSelected && (
							<>
								<Form.Item
									name='roomCount'
									label={
										chosenLanguage === "Arabic" ? "عدد الغرف" : "Room Count"
									}
									rules={[
										{ required: true, message: "Please input the room count" },
									]}
								>
									<Input
										type='number'
										onChange={(e) => {
											const roomType =
												form.getFieldValue("roomType") === "other"
													? customRoomType
													: form.getFieldValue("roomType");
											setHotelDetails((prevDetails) => ({
												...prevDetails,
												roomCountDetails: {
													...prevDetails.roomCountDetails,
													[roomType]: {
														...prevDetails.roomCountDetails[roomType],
														count: parseInt(e.target.value, 10),
													},
												},
											}));
										}}
									/>
								</Form.Item>
								<Form.Item
									name='basePrice'
									label={
										chosenLanguage === "Arabic"
											? "سعر الغرفة الأساسي"
											: "Base Room Price"
									}
									rules={[
										{ required: true, message: "Please input the base price" },
									]}
								>
									<Input
										type='number'
										onChange={(e) => {
											const roomType =
												form.getFieldValue("roomType") === "other"
													? customRoomType
													: form.getFieldValue("roomType");
											setHotelDetails((prevDetails) => ({
												...prevDetails,
												roomCountDetails: {
													...prevDetails.roomCountDetails,
													[roomType]: {
														...prevDetails.roomCountDetails[roomType],
														price: {
															basePrice: parseFloat(e.target.value),
														},
													},
												},
											}));
										}}
									/>
								</Form.Item>

								<Form.Item
									name='description'
									label={
										chosenLanguage === "Arabic"
											? "وصف الغرفة"
											: "Room Description"
									}
									rules={[
										{
											required: true,
											message: "Please input the room description",
										},
									]}
								>
									<Input.TextArea
										onChange={(e) => {
											const roomType =
												form.getFieldValue("roomType") === "other"
													? customRoomType
													: form.getFieldValue("roomType");
											setHotelDetails((prevDetails) => ({
												...prevDetails,
												roomCountDetails: {
													...prevDetails.roomCountDetails,
													[roomType]: {
														...prevDetails.roomCountDetails[roomType],
														description: e.target.value,
													},
												},
											}));
										}}
									/>
								</Form.Item>
								<Form.Item
									name='amenities'
									label={
										chosenLanguage === "Arabic"
											? "وسائل الراحة"
											: "Room Amenities"
									}
									rules={[
										{ required: true, message: "Please select room amenities" },
									]}
								>
									<Select
										mode='multiple'
										allowClear
										onChange={(value) => {
											const roomType =
												form.getFieldValue("roomType") === "other"
													? customRoomType
													: form.getFieldValue("roomType");
											setHotelDetails((prevDetails) => ({
												...prevDetails,
												roomCountDetails: {
													...prevDetails.roomCountDetails,
													[roomType]: {
														...prevDetails.roomCountDetails[roomType],
														amenities: value,
													},
												},
											}));
										}}
									>
										{amenitiesList.map((amenity, index) => (
											<Option
												key={index}
												value={amenity}
												style={{
													textAlign: chosenLanguage === "Arabic" ? "right" : "",
												}}
											>
												{amenity}
											</Option>
										))}
									</Select>
								</Form.Item>
							</>
						)}
					</>
				);

			case 2:
				return (
					<div className='my-3'>
						{ImageCard && (
							<ImageCard
								roomType={
									form.getFieldValue("roomType") === "other"
										? customRoomType
										: form.getFieldValue("roomType")
								}
								hotelPhotos={hotelPhotos}
								chosenLanguage={chosenLanguage}
								hotelDetails={hotelDetails}
								setHotelDetails={setHotelDetails}
							/>
						)}
					</div>
				);
			case 3:
				const pricingEvents =
					selectedRoomType &&
					hotelDetails.roomCountDetails[
						selectedRoomType === "other" ? customRoomType : selectedRoomType
					]
						? hotelDetails.roomCountDetails[
								selectedRoomType === "other" ? customRoomType : selectedRoomType
						  ].pricingRate.map((rate) => ({
								title: `${selectedRoomType}: ${rate.price} SAR`,
								start: rate.calendarDate,
								end: rate.calendarDate,
								allDay: true,
								backgroundColor: getColorForPrice(rate.price),
						  }))
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
					); // Adjust the end date

					setSelectedDateRange([selectedStart, selectedEnd]);

					// Update the date picker
					const dates = [moment(selectedStart), moment(selectedEnd)];
					form.setFieldsValue({
						dateRange: dates,
					});
				};

				const handleDatePickerChange = (dates) => {
					const [start, end] = dates;
					setSelectedDateRange([start, end]);

					if (start && end) {
						const calendarApi = calendarRef.current.getApi();
						const tempEvent = {
							title: "Selected",
							start: start.toISOString().split("T")[0],
							end: end.toISOString().split("T")[0],
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

				const handleCancelSelection = () => {
					setSelectedDateRange([null, null]);
					setPricingRate("");
					setPriceError(false);
					const calendarApi = calendarRef.current.getApi();
					const events = calendarApi.getEvents();
					events.forEach((event) => {
						if (event.title === "Selected") {
							event.remove();
						}
					});
					form.setFieldsValue({
						dateRange: [],
					});
				};

				return (
					<div className='row'>
						<div className='col-md-9'>
							<FullCalendar
								ref={calendarRef}
								plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
									? `تسعير الغرفة: ${selectedRoomType}`
									: `Pricing for room: ${selectedRoomType}`}
							</h4>
							<label>
								{" "}
								{chosenLanguage === "Arabic" ? "نطاق التاريخ" : "Date Range"}
							</label>
							<Form.Item
								dir='ltr'
								className='w-100'
								name='dateRange'
								rules={[
									{ required: true, message: "Please select a date range" },
								]}
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
											{chosenLanguage === "Arabic"
												? "سعر النطاق:"
												: "Price Range:"}
											<Input
												type='number'
												value={pricingRate}
												onChange={(e) => {
													setPricingRate(e.target.value);
													setPriceError(false);
												}}
												ref={priceInputRef}
												placeholder={
													chosenLanguage === "Arabic"
														? "سعر النطاق"
														: "Price Range"
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
										</label>
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
				);

			default:
				return null;
		}
	};

	return (
		<ZHotelDetailsForm2Wrapper
			isArabic={chosenLanguage === "Arabic"}
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
		>
			<h3>
				{chosenLanguage === "Arabic" ? "بناء الفندق" : "Build Hotel"} (
				{hotelDetails.hotelName})
			</h3>
			<Form
				form={form}
				layout='vertical'
				initialValues={hotelDetails}
				onFinish={handleFinish}
			>
				{renderStepContent()}
				<div className='steps-action'>
					{currentStep > 0 && (
						<Button style={{ margin: "0 8px" }} onClick={handlePrev}>
							{chosenLanguage === "Arabic" ? "السابق" : "Previous"}
						</Button>
					)}
					{currentStep < 3 && (
						<Button type='primary' onClick={handleNext}>
							{chosenLanguage === "Arabic" ? "التالي" : "Next"}
						</Button>
					)}
				</div>
			</Form>
		</ZHotelDetailsForm2Wrapper>
	);
};

export default ZHotelDetailsForm2;

const ZHotelDetailsForm2Wrapper = styled.div`
	max-width: 1600px;
	margin: auto;
	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
	}

	.ant-form-item {
		margin-bottom: 1rem;
	}

	.ant-upload-list-picture .ant-upload-list-item {
		height: auto;
		line-height: 1.5;
	}

	input[type="text"],
	input[type="email"],
	input[type="password"],
	input[type="date"],
	input[type="number"],
	select,
	textarea {
		display: block;
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		background-color: #fff;
		transition: all 0.3s;
		box-sizing: border-box;
	}

	input[type="text"]:focus,
	input[type="email"]:focus,
	input[type="password"]:focus,
	input[type="number"]:focus,
	input[type="date"]:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #40a9ff;
		box-shadow: 2px 5px 0 2px rgba(0, 0, 0, 0.5);
	}

	.col-md-2 {
		font-weight: bold;
	}

	.calendar-container {
		height: calc(100vh - 300px); // Adjust the value as needed
		width: 90% !important;
		max-width: 90%;
		margin: 0 auto;
		overflow: hidden;
	}

	.fc {
		height: 100%;
	}

	text-align: ${(props) => (props.isArabic ? "right" : "left")};
	.steps-action {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	button {
		text-transform: capitalize !important;
	}
`;
