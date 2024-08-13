import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Select, message, Modal } from "antd";
import styled from "styled-components";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ImageCard from "./ImageCard";
import ImageCardMain from "./ImageCardMain";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ZCustomInput from "./ZCustomInput";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
	submittingHotelDetails,
	fromPage,
}) => {
	const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
	const [pricingRate, setPricingRate] = useState("");
	const [customRoomType, setCustomRoomType] = useState("");
	const [priceError, setPriceError] = useState(false);
	const [locationModalVisible, setLocationModalVisible] = useState(false);
	const [markerPosition, setMarkerPosition] = useState({
		lat: 24.7136,
		lng: 46.6753,
	}); // Default to Riyadh, Saudi Arabia
	const [address, setAddress] = useState("");
	const calendarRef = useRef(null);
	const priceInputRef = useRef(null);
	const [form] = Form.useForm();
	const [hotelPhotos, setHotelPhotos] = useState(
		hotelDetails.hotelPhotos || []
	);
	const [geocoder, setGeocoder] = useState(null);

	const handleLoad = () => {
		setGeocoder(new window.google.maps.Geocoder());
	};

	// Update form fields when selectedRoomType changes
	useEffect(() => {
		if (selectedRoomType && fromPage === "Updating") {
			const { roomType, displayName } = selectedRoomType;

			const roomCountDetailsArray = Array.isArray(hotelDetails.roomCountDetails)
				? hotelDetails.roomCountDetails
				: [];

			// Find the room details using both roomType and displayName
			const existingRoomDetails =
				roomCountDetailsArray.find(
					(room) =>
						room.roomType === roomType && room.displayName === displayName
				) || {};

			// Pre-populate form fields with the existing room details
			form.setFieldsValue({
				roomType,
				customRoomType: roomType === "other" ? customRoomType : "",
				displayName: existingRoomDetails.displayName || "",
				roomCount: existingRoomDetails.count || 0,
				basePrice: existingRoomDetails.price?.basePrice || 0,
				description: existingRoomDetails.description || "",
				amenities: existingRoomDetails.amenities || [],
			});
			setRoomTypeSelected(true);
		}
	}, [
		fromPage,
		selectedRoomType,
		customRoomType,
		form,
		hotelDetails,
		setRoomTypeSelected,
	]);

	// Update form fields with existing hotel details
	useEffect(() => {
		form.setFieldsValue({
			parkingLot: hotelDetails.parkingLot ? "1" : "0",
			hotelFloors: hotelDetails.hotelFloors,
		});
	}, [form, hotelDetails]);

	// Handle date range selection in the calendar
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
	}, [selectedDateRange]);

	// Handle input field change and update map
	const handleAddressChange = (e) => {
		setAddress(e.target.value);

		if (geocoder) {
			geocodeAddress(e.target.value);
		} else {
			console.error("Geocoder is not initialized");
		}
	};

	// Geocode the address to get the coordinates
	const geocodeAddress = (address) => {
		if (!geocoder) {
			console.error("Geocoder is not initialized");
			return;
		}

		geocoder.geocode({ address }, (results, status) => {
			if (status === "OK" && results[0]) {
				const location = results[0].geometry.location;
				setMarkerPosition({
					lat: location.lat(),
					lng: location.lng(),
				});
				setHotelDetails((prevDetails) => ({
					...prevDetails,
					location: {
						type: "Point",
						coordinates: [location.lng(), location.lat()],
					},
					hotelAddress: results[0].formatted_address,
				}));
			} else if (status !== "OK" && status !== "ZERO_RESULTS") {
				message.error(
					"Geocode was not successful for the following reason: " + status
				);
			}
		});
	};

	// Handle map click to set marker position
	const handleMapClick = (e) => {
		const lat = e.latLng.lat();
		const lng = e.latLng.lng();
		setMarkerPosition({ lat, lng });
		reverseGeocode(lat, lng);
	};

	// Reverse geocode to get the address from the coordinates
	const reverseGeocode = (lat, lng) => {
		if (!geocoder) {
			console.error("Geocoder is not initialized");
			return;
		}

		geocoder.geocode({ location: { lat, lng } }, (results, status) => {
			if (status === "OK" && results[0]) {
				setAddress(results[0].formatted_address);
				setHotelDetails((prevDetails) => ({
					...prevDetails,
					location: {
						type: "Point",
						coordinates: [lng, lat],
					},
					hotelAddress: results[0].formatted_address,
				}));
			} else {
				message.error(
					"Geocode was not successful for the following reason: " + status
				);
			}
		});
	};

	// Handle location modal OK button click
	const handleLocationModalOk = () => {
		geocoder.geocode(
			{ location: { lat: markerPosition.lat, lng: markerPosition.lng } },
			(results, status) => {
				if (status === "OK" && results[0]) {
					const addressComponents = results[0].address_components;
					const hotelCountry = addressComponents.find((comp) =>
						comp.types.includes("country")
					)?.long_name;
					const hotelCity = addressComponents.find((comp) =>
						comp.types.includes("locality")
					)?.long_name;
					const hotelState = addressComponents.find((comp) =>
						comp.types.includes("administrative_area_level_1")
					)?.long_name;

					setHotelDetails((prevDetails) => ({
						...prevDetails,
						location: {
							type: "Point",
							coordinates: [markerPosition.lng, markerPosition.lat],
						},
						hotelAddress: results[0].formatted_address,
						hotelCountry: hotelCountry || prevDetails.hotelCountry,
						hotelCity: hotelCity || prevDetails.hotelCity,
						hotelState: hotelState || prevDetails.hotelState,
					}));
					message.success(
						chosenLanguage === "Arabic"
							? "تم تحديث موقع الفندق بنجاح!"
							: "Hotel location updated successfully!"
					);
				} else {
					message.error(
						"Geocode was not successful for the following reason: " + status
					);
				}
			}
		);
		setLocationModalVisible(false);
	};

	// Handle location modal cancel button click
	const handleLocationModalCancel = () => {
		setLocationModalVisible(false);
	};

	// Handle next step in the form
	const handleNext = () => {
		form
			.validateFields()
			.then((values) => {
				const roomType =
					values.roomType === "other" ? customRoomType : values.roomType;
				const roomColor = getRoomColor(roomType);

				const roomCountDetailsArray = Array.isArray(
					hotelDetails.roomCountDetails
				)
					? hotelDetails.roomCountDetails
					: [];

				const existingRoomIndex = roomCountDetailsArray.findIndex(
					(room) =>
						room.roomType === roomType &&
						room.displayName === values.displayName
				);

				const updatedRoomCountDetails = [...roomCountDetailsArray];

				const newRoomDetails = {
					roomType,
					displayName: values.displayName,
					count: values.roomCount,
					price: { basePrice: values.basePrice },
					description: values.description,
					amenities: values.amenities,
					roomColor,
					pricingRate:
						existingRoomIndex > -1
							? updatedRoomCountDetails[existingRoomIndex].pricingRate
							: [], // Preserve existing pricing rates
					photos:
						existingRoomIndex > -1
							? updatedRoomCountDetails[existingRoomIndex].photos
							: [], // Preserve existing photos
				};

				if (existingRoomIndex > -1) {
					updatedRoomCountDetails[existingRoomIndex] = {
						...updatedRoomCountDetails[existingRoomIndex],
						...newRoomDetails,
					};
				} else {
					updatedRoomCountDetails.push(newRoomDetails);
				}

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

	// Handle previous step in the form
	const handlePrev = () => {
		setCurrentStep(currentStep - 1);
	};

	// Handle form submission
	const handleFinish = (values) => {
		setHotelDetails((prevDetails) => ({
			...prevDetails,
			...values,
		}));
		message.success("Hotel details updated successfully!");
	};

	// Generate date range array for pricing
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

	// Function to map room types to colors
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

	// Function to get color for price ranges
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

	// Function to open the location modal
	const handleOpenLocationModal = () => {
		if (
			hotelDetails.location &&
			hotelDetails.location.coordinates.length === 2 &&
			hotelDetails.location.coordinates[0] !== 0 &&
			hotelDetails.location.coordinates[1] !== 0
		) {
			// Use the existing location coordinates to set the map's initial center
			setMarkerPosition({
				lat: hotelDetails.location.coordinates[1], // latitude
				lng: hotelDetails.location.coordinates[0], // longitude
			});
		} else if (hotelDetails.hotelCountry && hotelDetails.hotelCity) {
			// Use the address to set the map's initial center if country and city are available
			const address = `${hotelDetails.hotelCity}, ${hotelDetails.hotelCountry}`;
			geocodeAddress(address);
		} else {
			// Default to KSA if no location is available in hotelDetails
			setMarkerPosition({ lat: 24.7136, lng: 46.6753 }); // Coordinates for Riyadh, Saudi Arabia
		}
		setLocationModalVisible(true);
	};

	const handleDatePickerChange = (dates) => {
		const [start, end] = dates;
		if (end) {
			const adjustedEnd = new Date(end);
			adjustedEnd.setDate(adjustedEnd.getDate() + 1); // Make end date inclusive

			const calendarApi = calendarRef.current.getApi();

			// Remove any existing grey "Selected" events
			const existingSelectedEvents = calendarApi
				.getEvents()
				.filter((event) => event.title === "Selected");
			existingSelectedEvents.forEach((event) => event.remove());

			const tempEvent = {
				title: "Selected",
				start: start.toISOString().split("T")[0],
				end: adjustedEnd.toISOString().split("T")[0], // Use adjusted end date
				allDay: true,
				backgroundColor: "lightgrey",
			};

			calendarApi.addEvent(tempEvent);
			setSelectedDateRange([start, adjustedEnd]);
		}
	};

	// Render the step content based on the current step
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

						{/* Display message based on location coordinates */}
						<div
							dir='ltr'
							style={{
								marginBottom: "10px",
								fontWeight: "bold",
								fontSize: "14px",
								textTransform: "capitalize",
							}}
						>
							{hotelDetails.location.coordinates[0] === 0 &&
							hotelDetails.location.coordinates[1] === 0 ? (
								<span style={{ color: "red" }}>
									{chosenLanguage === "Arabic"
										? "لم يتم تأكيد الموقع"
										: "No location was confirmed"}
								</span>
							) : (
								<span style={{ color: "darkgreen" }}>
									{chosenLanguage === "Arabic"
										? `Location: ${hotelDetails.hotelAddress}`
										: `Location: ${hotelDetails.hotelAddress}`}
								</span>
							)}
						</div>

						<Button
							type={
								hotelDetails.location.coordinates[0] === 0 &&
								hotelDetails.location.coordinates[1] === 0
									? "danger"
									: "primary"
							}
							onClick={handleOpenLocationModal}
							style={{ marginBottom: "16px" }}
						>
							{chosenLanguage === "Arabic"
								? hotelDetails.location.coordinates[0] === 0 &&
								  hotelDetails.location.coordinates[1] === 0
									? "إضافة موقع الفندق"
									: "تعديل موقع الفندق"
								: hotelDetails.location.coordinates[0] === 0 &&
								    hotelDetails.location.coordinates[1] === 0
								  ? "Add Hotel Location"
								  : "Edit Hotel Location"}
						</Button>

						<Modal
							title={
								chosenLanguage === "Arabic"
									? "حدد موقع الفندق"
									: "Select Hotel Location"
							}
							open={locationModalVisible}
							onOk={handleLocationModalOk}
							onCancel={handleLocationModalCancel}
							width={1100}
						>
							<Input
								value={address}
								onChange={handleAddressChange}
								placeholder={
									chosenLanguage === "Arabic"
										? "أدخل عنوان الفندق"
										: "Enter hotel address"
								}
								style={{ marginBottom: "16px" }}
							/>
							<LoadScript
								googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY}
								onLoad={handleLoad} // Load handler to initialize geocoder
							>
								<GoogleMap
									mapContainerStyle={{ width: "100%", height: "400px" }}
									center={markerPosition}
									zoom={14}
									onClick={handleMapClick}
								>
									<Marker position={markerPosition} draggable={true} />
								</GoogleMap>
							</LoadScript>
						</Modal>

						<h4>
							{chosenLanguage === "Arabic"
								? "صور عامة عن الفندق (مثل المبنى، الردهة، المصاعد، الخ...)"
								: "General Images About the hotel (e.g. building, lobby, elevators, etc...)"}
						</h4>
						<Form.Item>
							<ImageCardMain
								roomType='hotelPhotos'
								hotelPhotos={hotelPhotos}
								setHotelPhotos={setHotelPhotos}
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

									const roomCountDetailsArray = Array.isArray(
										hotelDetails.roomCountDetails
									)
										? hotelDetails.roomCountDetails
										: [];

									const existingRoomDetails =
										roomCountDetailsArray.find(
											(room) => room.roomType === roomType
										) || {};

									form.setFieldsValue({
										displayName:
											(existingRoomDetails.displayName &&
												fromPage === "Updating") ||
											"",
										roomCount:
											(existingRoomDetails.count && fromPage === "Updating") ||
											0,
										basePrice:
											(existingRoomDetails.price?.basePrice &&
												fromPage === "Updating") ||
											0,
										description:
											(existingRoomDetails.description &&
												fromPage === "Updating") ||
											"",
										amenities:
											(existingRoomDetails.amenities &&
												fromPage === "Updating") ||
											[],
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
									name='displayName'
									label={
										chosenLanguage === "Arabic"
											? "اسم العرض (الاسم المعروض للعملاء)"
											: "Display Name"
									}
									rules={[
										{
											required: true,
											message: "Please input the display name",
										},
									]}
								>
									<Input
										onChange={(e) => {
											const roomType =
												form.getFieldValue("roomType") === "other"
													? customRoomType
													: form.getFieldValue("roomType");

											setHotelDetails((prevDetails) => {
												const updatedRoomCountDetails = Array.isArray(
													prevDetails.roomCountDetails
												)
													? prevDetails.roomCountDetails
													: [];

												const existingRoomIndex =
													updatedRoomCountDetails.findIndex(
														(room) => room.roomType === roomType
													);

												if (existingRoomIndex > -1) {
													updatedRoomCountDetails[
														existingRoomIndex
													].displayName = e.target.value;
												} else {
													updatedRoomCountDetails.push({
														roomType,
														displayName: e.target.value,
													});
												}

												return {
													...prevDetails,
													roomCountDetails: updatedRoomCountDetails,
												};
											});
										}}
									/>
								</Form.Item>

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

											setHotelDetails((prevDetails) => {
												const updatedRoomCountDetails = Array.isArray(
													prevDetails.roomCountDetails
												)
													? prevDetails.roomCountDetails
													: [];

												const existingRoomIndex =
													updatedRoomCountDetails.findIndex(
														(room) => room.roomType === roomType
													);

												if (existingRoomIndex > -1) {
													updatedRoomCountDetails[existingRoomIndex].count =
														parseInt(e.target.value, 10);
												} else {
													updatedRoomCountDetails.push({
														roomType,
														count: parseInt(e.target.value, 10),
													});
												}

												return {
													...prevDetails,
													roomCountDetails: updatedRoomCountDetails,
												};
											});
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

											setHotelDetails((prevDetails) => {
												const updatedRoomCountDetails = Array.isArray(
													prevDetails.roomCountDetails
												)
													? prevDetails.roomCountDetails
													: [];

												const existingRoomIndex =
													updatedRoomCountDetails.findIndex(
														(room) => room.roomType === roomType
													);

												if (existingRoomIndex > -1) {
													updatedRoomCountDetails[existingRoomIndex].price = {
														basePrice: parseFloat(e.target.value),
													};
												} else {
													updatedRoomCountDetails.push({
														roomType,
														price: { basePrice: parseFloat(e.target.value) },
													});
												}

												return {
													...prevDetails,
													roomCountDetails: updatedRoomCountDetails,
												};
											});
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

											setHotelDetails((prevDetails) => {
												const updatedRoomCountDetails = Array.isArray(
													prevDetails.roomCountDetails
												)
													? prevDetails.roomCountDetails
													: [];

												const existingRoomIndex =
													updatedRoomCountDetails.findIndex(
														(room) => room.roomType === roomType
													);

												if (existingRoomIndex > -1) {
													updatedRoomCountDetails[
														existingRoomIndex
													].description = e.target.value;
												} else {
													updatedRoomCountDetails.push({
														roomType,
														description: e.target.value,
													});
												}

												return {
													...prevDetails,
													roomCountDetails: updatedRoomCountDetails,
												};
											});
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

											setHotelDetails((prevDetails) => {
												const updatedRoomCountDetails = Array.isArray(
													prevDetails.roomCountDetails
												)
													? prevDetails.roomCountDetails
													: [];

												const existingRoomIndex =
													updatedRoomCountDetails.findIndex(
														(room) => room.roomType === roomType
													);

												if (existingRoomIndex > -1) {
													updatedRoomCountDetails[existingRoomIndex].amenities =
														value;
												} else {
													updatedRoomCountDetails.push({
														roomType,
														amenities: value,
													});
												}

												return {
													...prevDetails,
													roomCountDetails: updatedRoomCountDetails,
												};
											});
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
								setHotelPhotos={setHotelPhotos}
								setHotelDetails={setHotelDetails}
								chosenLanguage={chosenLanguage}
								hotelDetails={hotelDetails}
							/>
						)}
					</div>
				);
			case 3:
				const pricingEvents =
					(selectedRoomType &&
						hotelDetails.roomCountDetails &&
						hotelDetails.roomCountDetails
							.find(
								(room) =>
									room.roomType ===
									(selectedRoomType === "other"
										? customRoomType
										: selectedRoomType)
							)
							?.pricingRate?.map((rate) => ({
								title: `${selectedRoomType}: ${rate.price} SAR`,
								start: rate.calendarDate,
								end: rate.calendarDate,
								allDay: true,
								backgroundColor: getColorForPrice(rate.price),
							}))) ||
					[];

				// Handling calendar date selection
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

				// Handling date range submission for pricing
				const handleDateRangeSubmit = () => {
					if (!pricingRate) {
						setPriceError(true);
						return;
					}

					const roomType =
						selectedRoomType === "other" ? customRoomType : selectedRoomType;

					// Find the index of the existing room in roomCountDetails
					const roomIndex = hotelDetails.roomCountDetails.findIndex(
						(room) =>
							room.roomType === roomType &&
							room.displayName === form.getFieldValue("displayName")
					);

					// Prepare new pricing rates for the selected date range
					const newPricingRates = generateDateRangeArray(
						selectedDateRange[0],
						selectedDateRange[1]
					).map((date) => ({
						calendarDate: date.toISOString().split("T")[0],
						room_type: roomType,
						price: pricingRate,
						color: getColorForPrice(pricingRate),
					}));

					// Update roomCountDetails with the new pricing
					const updatedRoomCountDetails = [...hotelDetails.roomCountDetails];

					if (roomIndex > -1) {
						let existingRates =
							updatedRoomCountDetails[roomIndex].pricingRate || [];

						// Remove overlapping rates and add the new rates
						existingRates = existingRates.filter(
							(rate) =>
								rate.calendarDate <
									selectedDateRange[0].toISOString().split("T")[0] ||
								rate.calendarDate >
									selectedDateRange[1].toISOString().split("T")[0]
						);

						// Merge the new pricing rates
						updatedRoomCountDetails[roomIndex].pricingRate = [
							...existingRates,
							...newPricingRates,
						];
					} else {
						updatedRoomCountDetails.push({
							roomType,
							displayName: form.getFieldValue("displayName"),
							pricingRate: newPricingRates,
						});
					}

					// Update state
					setHotelDetails((prevDetails) => ({
						...prevDetails,
						roomCountDetails: updatedRoomCountDetails,
					}));

					// Clear selection and reset state
					handleCancelSelection();

					message.success("Date range added successfully!");
				};

				// Handle canceling of selection
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
									? `تسعير الغرفة: ${selectedRoomType}`
									: `Pricing for room: ${selectedRoomType}`}
							</h4>
							<label>
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

					{currentStep < 3 && currentStep !== 0 && (
						<Button type='primary' onClick={handleNext}>
							{chosenLanguage === "Arabic" ? "التالي" : "Next"}
						</Button>
					)}

					{currentStep < 3 && currentStep === 0 && (
						<button
							className='btn btn-primary'
							onClick={handleNext}
							style={{ fontSize: "20px", fontWeight: "bold" }}
						>
							{chosenLanguage === "Arabic"
								? "إضافة غرفة جديدة"
								: "Add A New Room"}
						</button>
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

	.fc,
	.fc-media-screen,
	.fc-direction-ltr,
	.fc-theme-standard {
		max-height: 650px !important;
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
