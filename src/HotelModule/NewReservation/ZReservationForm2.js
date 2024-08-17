import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { DatePicker, Spin, Table, Modal, InputNumber } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../auth";
import {
	agodaData,
	airbnbData,
	bookingData,
	expediaData,
	janatData,
} from "../apiAdmin";

const ZReservationForm2 = ({
	customer_details,
	setCustomer_details,
	start_date,
	setStart_date,
	end_date,
	setEnd_date,
	disabledDate,
	hotelDetails,
	chosenLanguage,
	hotelRooms,
	pickedHotelRooms,
	clickSubmit2,
	total_amount,
	days_of_residence,
	setDays_of_residence,
	setBookingComment,
	booking_comment,
	setBookingSource,
	setPaymentStatus,
	paymentStatus,
	roomsSummary,
	confirmation_number,
	setConfirmationNumber,
	booking_source,
	clickedMenu,
	pickedRoomsType,
	setPickedRoomsType,
	roomInventory,
	total_guests,
	setTotalGuests,
	setSendEmail,
	sendEmail,
	paidAmount,
	setPaidAmount,
	isBoss,
	currentRoom,
	setCurrentRoom,
}) => {
	const [selectedRoomType, setSelectedRoomType] = useState("");
	// eslint-disable-next-line
	const [selectedPriceOption, setSelectedPriceOption] = useState("");
	// eslint-disable-next-line
	const [selectedCount, setSelectedCount] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
	const [updatedRoomCount, setUpdatedRoomCount] = useState(0);
	// eslint-disable-next-line
	const [updatedRoomPrice, setUpdatedRoomPrice] = useState(0);
	const [isModalVisible2, setIsModalVisible2] = useState(false);
	const [inheritedPrice, setInheritedPrice] = useState("");

	const { user } = isAuthenticated();

	const openModal = (room, index) => {
		setIsModalVisible(true);
		setSelectedRoomIndex(index);
		setUpdatedRoomCount(room.count);
		setUpdatedRoomPrice(room.chosenPrice); // Set the current price here
	};

	const onStartDateChange = (value) => {
		const dateAtMidnight = value ? value.clone().startOf("day").toDate() : null;
		setStart_date(dateAtMidnight ? dateAtMidnight.toISOString() : null);

		if (dateAtMidnight && end_date) {
			const adjustedEndDate = moment(end_date).startOf("day").toDate();
			const duration = moment(adjustedEndDate).diff(
				moment(dateAtMidnight),
				"days"
			);
			setDays_of_residence(duration >= 0 ? duration + 1 : 0);
		} else {
			setDays_of_residence(0);
		}
	};

	const onEndDateChange = (date) => {
		const adjustedEndDate = date ? date.clone().startOf("day").toDate() : null;
		setEnd_date(adjustedEndDate ? adjustedEndDate.toISOString() : null);

		if (adjustedEndDate && start_date) {
			const adjustedStartDate = moment(start_date).startOf("day").toDate();
			const duration = moment(adjustedEndDate).diff(
				moment(adjustedStartDate),
				"days"
			);
			setDays_of_residence(duration >= 0 ? duration + 1 : 0);
		} else {
			setDays_of_residence(0);
		}
	};

	const disabledEndDate = (current) => {
		return current && current < moment(start_date).startOf("day");
	};

	const handleRoomTypeChange = (e) => {
		setSelectedRoomType(e.target.value);
		setSelectedPriceOption("");
		setSelectedCount("");
	};

	const handleOk2 = () => {
		if (selectedRoomIndex !== null) {
			setPickedRoomsType((prev) => {
				const updatedRooms = [...prev];
				const updatedRoom = { ...updatedRooms[selectedRoomIndex] };

				// Ensure the count is not reset
				const currentCount = updatedRoom.count;

				// Update pricingByDay with the new prices
				updatedRoom.pricingByDay = updatedRoom.pricingByDay.map(
					(day, index) => {
						return {
							...day,
							price: parseFloat(day.price),
						};
					}
				);

				// Recalculate chosenPrice as the average of the pricingByDay prices
				updatedRoom.chosenPrice =
					updatedRoom.pricingByDay.reduce((acc, day) => acc + day.price, 0) /
					updatedRoom.pricingByDay.length;

				// Ensure the count remains the same
				updatedRoom.count = currentCount;

				// Update the room in the array
				updatedRooms[selectedRoomIndex] = updatedRoom;

				return updatedRooms;
			});
		}
		setIsModalVisible2(false);
	};

	const handleOk = () => {
		if (selectedRoomIndex !== null) {
			setPickedRoomsType((prev) => {
				const updatedRooms = [...prev];
				const roomToUpdate = { ...updatedRooms[selectedRoomIndex] };

				// Create an array of new room objects with the same details
				const newRoomObjects = Array.from({ length: updatedRoomCount }, () => ({
					room_type: roomToUpdate.room_type,
					chosenPrice: roomToUpdate.chosenPrice,
					count: 1,
					pricingByDay: roomToUpdate.pricingByDay,
				}));

				// Remove the original room object and insert the new room objects
				updatedRooms.splice(selectedRoomIndex, 1, ...newRoomObjects);

				return updatedRooms;
			});
		}
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleCancel2 = () => {
		setIsModalVisible2(false);
	};

	const removeRoom = () => {
		if (selectedRoomIndex !== null) {
			setPickedRoomsType((prev) =>
				prev.filter((_, index) => index !== selectedRoomIndex)
			);
		}
		setIsModalVisible(false);
	};

	const handleFileUpload = (uploadFunction) => {
		const isFromUS = window.confirm(
			"Is this upload from the US? Click OK for Yes, Cancel for No."
		);
		const country = isFromUS ? "US" : "NotUS";
		const accountId = hotelDetails._id;
		const belongsTo = user._id;
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept =
			".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
		fileInput.onchange = (e) => {
			setLoading(true);
			const file = e.target.files[0];
			uploadFunction(accountId, belongsTo, file, country).then((data) => {
				setLoading(false);
				if (data.error) {
					console.log(data.error);
					toast.error("Error uploading data");
				} else {
					toast.success("Data uploaded successfully!");
				}
			});
		};
		fileInput.click();
	};

	const generatePricingTable = useCallback(
		(roomType, displayName, startDate, endDate) => {
			// Find the room details by matching both roomType and displayName
			const roomDetails = hotelDetails.roomCountDetails.find(
				(detail) =>
					detail.roomType === roomType && detail.displayName === displayName
			);

			if (!roomDetails) {
				console.warn(
					"No matching room details found for the given roomType and displayName"
				);
				return;
			}

			const pricingRate = roomDetails?.pricingRate || [];
			const basePrice = roomDetails?.price?.basePrice || 0;

			const daysArray = [];
			const currentDate = moment(startDate);

			while (currentDate.isBefore(endDate)) {
				const dateString = currentDate.format("YYYY-MM-DD");
				const pricing = pricingRate.find(
					(price) => price.calendarDate === dateString
				);
				const price = pricing
					? parseFloat(pricing.price)
					: parseFloat(basePrice);
				daysArray.push({ date: dateString, price });
				currentDate.add(1, "day");
			}

			setPickedRoomsType((prev) => {
				const existingRoomIndex = prev.findIndex(
					(item) =>
						item.room_type === roomType && item.displayName === displayName
				);

				if (existingRoomIndex !== -1) {
					const updatedRooms = [...prev];
					updatedRooms[existingRoomIndex] = {
						...updatedRooms[existingRoomIndex],
						pricingByDay: daysArray,
						chosenPrice:
							daysArray.reduce((acc, day) => acc + day.price, 0) /
							daysArray.length,
					};
					return updatedRooms;
				} else {
					return [
						...prev,
						{
							room_type: roomType,
							displayName: displayName,
							pricingByDay: daysArray,
							chosenPrice:
								daysArray.reduce((acc, day) => acc + day.price, 0) /
								daysArray.length,
							count: 1,
						},
					];
				}
			});
		},
		[hotelDetails.roomCountDetails, setPickedRoomsType]
	);

	const handleInheritPrices = () => {
		if (inheritedPrice && selectedRoomType) {
			setPickedRoomsType((prev) => {
				const updatedRooms = prev.map((room) => {
					if (room.room_type === selectedRoomType) {
						const updatedPricingByDay = room.pricingByDay.map((day) => ({
							...day,
							price: parseFloat(inheritedPrice),
						}));
						return {
							...room,
							pricingByDay: updatedPricingByDay,
							chosenPrice:
								updatedPricingByDay.reduce((acc, day) => acc + day.price, 0) /
								updatedPricingByDay.length,
						};
					}
					return room;
				});
				return updatedRooms;
			});
		}
	};

	const calculateTotalAmountPerDay = () => {
		return pickedRoomsType.reduce((total, room) => {
			return total + room.count * room.chosenPrice;
		}, 0);
	};

	const calculateGrandTotal = () => {
		if (selectedRoomIndex !== null && pickedRoomsType[selectedRoomIndex]) {
			return pickedRoomsType[selectedRoomIndex].pricingByDay.reduce(
				(total, day) =>
					total + day.price * pickedRoomsType[selectedRoomIndex].count,
				0
			);
		}
		return 0;
	};

	useEffect(() => {
		if (selectedRoomType && start_date && end_date) {
			generatePricingTable(selectedRoomType, start_date, end_date);
		}
	}, [selectedRoomType, start_date, end_date, generatePricingTable]);

	const openModal2 = (room) => {
		const roomIndex = pickedRoomsType.findIndex(
			(pickedRoom) =>
				pickedRoom.room_type === room.room_type &&
				pickedRoom.chosenPrice === room.chosenPrice
		);
		if (roomIndex !== -1) {
			setSelectedRoomIndex(roomIndex);
			setIsModalVisible2(true);
		}
	};

	const columns = [
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (text, record, index) => (
				<InputNumber
					min={0}
					value={record.price}
					onChange={(value) => {
						const updatedRooms = [...pickedRoomsType];
						updatedRooms[selectedRoomIndex].pricingByDay[index].price = value;
						updatedRooms[selectedRoomIndex].chosenPrice =
							updatedRooms[selectedRoomIndex].pricingByDay.reduce(
								(acc, day) => acc + day.price,
								0
							) / updatedRooms[selectedRoomIndex].pricingByDay.length;
						setPickedRoomsType(updatedRooms);
					}}
				/>
			),
		},
	];

	return (
		<>
			{loading ? (
				<div className='text-center my-5'>
					<Spin size='large' />
					<p>
						{" "}
						{chosenLanguage === "Arabic" ? "" : ""} Loading Reservations...
					</p>
				</div>
			) : (
				<ZReservationFormWrapper arabic={chosenLanguage === "Arabic"}>
					<Modal
						title='Update Picked Room'
						open={isModalVisible}
						onOk={handleOk}
						onCancel={handleCancel}
					>
						<p>
							{chosenLanguage === "Arabic" ? "" : ""}Update the count for the
							room:
						</p>
						<InputNumber
							min={1}
							value={updatedRoomCount}
							onChange={setUpdatedRoomCount}
						/>

						<div className='my-3'>
							<button
								className='btn btn-info w-50'
								style={{ cursor: "pointer" }}
								onClick={() => openModal2(pickedRoomsType[selectedRoomIndex])}
							>
								Adjust Room Pricing
							</button>
						</div>

						<div className='my-3'>
							<button
								onClick={() => removeRoom(selectedRoomIndex)}
								className='btn btn-danger w-50'
							>
								{chosenLanguage === "Arabic" ? "" : ""}Remove Room
							</button>
						</div>
					</Modal>

					<Modal
						title={`Selected ${selectedRoomType} Pricing`}
						open={isModalVisible2}
						onOk={handleOk2}
						onCancel={handleCancel2}
					>
						<div>
							<InputNumber
								value={inheritedPrice}
								onChange={(value) => setInheritedPrice(value)}
								placeholder='Enter new price to inherit'
								style={{ width: "100%", marginBottom: "10px" }}
							/>
							<button onClick={handleInheritPrices} className='btn btn-primary'>
								Inherit New Prices
							</button>
						</div>
						<Table
							dataSource={
								pickedRoomsType[selectedRoomIndex]?.pricingByDay.map((day) => ({
									date: day.date,
									price: day.price,
								})) || []
							}
							columns={columns}
							rowKey='date'
							pagination={false}
						/>
						<div
							style={{
								marginTop: "10px",
								fontWeight: "bold",
								fontSize: "1.2rem",
							}}
						>
							Grand Total: {calculateGrandTotal().toFixed(2)} SAR
						</div>
					</Modal>

					{isBoss ? (
						<div className='mx-auto mb-5 mt-4 text-center'>
							<button
								className='btn btn-primary mx-2'
								style={{ fontWeight: "bold" }}
								onClick={() => handleFileUpload(agodaData)}
							>
								{chosenLanguage === "Arabic"
									? "رفع بيانات أجودا"
									: "Agoda Upload"}
							</button>
							<button
								className='btn btn-primary mx-2'
								style={{ fontWeight: "bold" }}
								onClick={() => handleFileUpload(expediaData)}
							>
								{chosenLanguage === "Arabic"
									? "رفع بيانات إكسبيديا"
									: "Expedia Upload"}
							</button>
							<button
								className='btn btn-primary mx-2'
								style={{ fontWeight: "bold" }}
								onClick={() => handleFileUpload(bookingData)}
							>
								{chosenLanguage === "Arabic"
									? "رفع بيانات بوكينج"
									: "Booking Upload"}
							</button>
							<button
								className='btn btn-primary mx-2'
								style={{ fontWeight: "bold" }}
								onClick={() => handleFileUpload(airbnbData)}
							>
								{chosenLanguage === "Arabic"
									? "رفع بيانات Airbnb"
									: "Airbnb Upload"}
							</button>
							<button
								className='btn btn-primary mx-2'
								style={{ fontWeight: "bold" }}
								onClick={() => handleFileUpload(janatData)}
							>
								{chosenLanguage === "Arabic"
									? "رفع بيانات Janat"
									: "Janat Upload"}
							</button>
						</div>
					) : null}

					<h6
						style={{
							textTransform: "uppercase",
							color: "darkcyan",
							fontWeight: "bold",
						}}
					>
						{chosenLanguage === "Arabic"
							? "تحذير... هذا حجز أولي"
							: "WARNING... THIS IS A preliminary RESERVATION"}
					</h6>

					<div className='row'>
						<div className='col-md-8'>
							<div className='row'>
								<div className='col-md-4'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic" ? "الاسم" : "Guest Name"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.name}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													name: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className='col-md-4'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic" ? "الهاتف" : "Guest Phone"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.phone}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													phone: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className='col-md-4'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "البريد الإلكتروني"
												: "Guest Email"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.email}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													email: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className='col-md-3'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "رقم جواز السفر"
												: "Guest Passport #"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.passport}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													passport: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className='col-md-3'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "نسخة جواز السفر"
												: "Passport Copy #"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.copyNumber}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													copyNumber: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className='col-md-3'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "تاريخ الميلاد"
												: "Date Of Birth"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.passportExpiry}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													passportExpiry: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className='col-md-3'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic" ? "الجنسية" : "Nationality"}
										</label>
										<input
											background='red'
											type='text'
											value={customer_details.nationality}
											onChange={(e) =>
												setCustomer_details({
													...customer_details,
													nationality: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div
									className={
										customer_details.hasCar === "yes"
											? "col-md-4"
											: "col-md-8 mx-auto"
									}
								>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "هل لدى الضيف سيارة؟"
												: "Does The Guest Have A Car?"}
										</label>
										<div>
											<div
												className='mx-3'
												style={{ display: "inline-block", marginRight: "10px" }}
											>
												<input
													type='radio'
													name='hasCar'
													value='yes'
													checked={customer_details.hasCar === "yes"}
													onChange={(e) =>
														setCustomer_details({
															...customer_details,
															hasCar: e.target.value,
														})
													}
												/>
												{chosenLanguage === "Arabic" ? "نعم" : "Yes"}
											</div>
											<div style={{ display: "inline-block" }}>
												<input
													type='radio'
													name='hasCar'
													value='no'
													checked={customer_details.hasCar === "no"}
													onChange={(e) =>
														setCustomer_details({
															...customer_details,
															hasCar: e.target.value,
														})
													}
												/>
												{chosenLanguage === "Arabic" ? "لا" : "No"}
											</div>
										</div>
									</div>
								</div>
								{customer_details.hasCar === "yes" && (
									<>
										<div className='col-md-2'>
											<div
												className='form-group'
												style={{ marginTop: "10px", marginBottom: "10px" }}
											>
												<label style={{ fontWeight: "bold" }}>
													{chosenLanguage === "Arabic"
														? "رقم لوحة السيارة"
														: "License Plate"}
												</label>
												<input
													type='text'
													value={customer_details.carLicensePlate}
													onChange={(e) =>
														setCustomer_details({
															...customer_details,
															carLicensePlate: e.target.value,
														})
													}
												/>
											</div>
										</div>
										<div className='col-md-2'>
											<div
												className='form-group'
												style={{ marginTop: "10px", marginBottom: "10px" }}
											>
												<label style={{ fontWeight: "bold" }}>
													{chosenLanguage === "Arabic"
														? "لون السيارة"
														: "Car Color"}
												</label>
												<input
													type='text'
													value={customer_details.carColor}
													onChange={(e) =>
														setCustomer_details({
															...customer_details,
															carColor: e.target.value,
														})
													}
												/>
											</div>
										</div>
										<div className='col-md-2'>
											<div
												className='form-group'
												style={{ marginTop: "10px", marginBottom: "10px" }}
											>
												<label style={{ fontWeight: "bold" }}>
													{chosenLanguage === "Arabic"
														? "موديل/نوع السيارة"
														: "Car Model"}
												</label>
												<input
													type='text'
													value={customer_details.carModel}
													onChange={(e) =>
														setCustomer_details({
															...customer_details,
															carModel: e.target.value,
														})
													}
												/>
											</div>
										</div>
									</>
								)}

								<div className='col-md-6'>
									<label
										className='dataPointsReview mt-3'
										style={{
											fontWeight: "bold",
											fontSize: "1.05rem",
											color: "#32322b",
										}}
									>
										{chosenLanguage === "Arabic"
											? "تاريخ الوصول"
											: "Checkin Date"}{" "}
										{start_date
											? `(${new Date(start_date).toDateString()})`
											: ""}
									</label>
									<br />
									<DatePicker
										className='inputFields'
										disabledDate={disabledDate}
										inputReadOnly
										size='small'
										showToday={true}
										placeholder='Please pick the desired schedule checkin date'
										style={{
											height: "auto",
											width: "100%",
											padding: "10px",
											boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
											borderRadius: "10px",
										}}
										onChange={onStartDateChange}
									/>
								</div>

								<div className='col-md-6'>
									<label
										className='dataPointsReview mt-3'
										style={{
											fontWeight: "bold",
											fontSize: "1.05rem",
											color: "#32322b",
										}}
									>
										{chosenLanguage === "Arabic"
											? "موعد انتهاء الأقامة"
											: "Checkout Date"}{" "}
										{end_date ? `(${new Date(end_date).toDateString()})` : ""}
									</label>
									<br />
									<DatePicker
										className='inputFields'
										disabledDate={disabledEndDate}
										inputReadOnly
										size='small'
										showToday={true}
										placeholder='Please pick the desired schedule checkout date'
										style={{
											height: "auto",
											width: "100%",
											padding: "10px",
											boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
											borderRadius: "10px",
										}}
										onChange={onEndDateChange}
									/>
								</div>
							</div>

							<div
								className='row my-4 mx-auto'
								style={{
									background: "#ededed",
									width: "99%",
									minHeight: "250px",
								}}
							>
								<div className='col-md-6 mx-auto my-2'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "مصدر الحجز"
												: "Booking Source"}
										</label>
										<select
											onChange={(e) => setBookingSource(e.target.value)}
											style={{
												height: "auto",
												width: "100%",
												padding: "10px",
												boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
												borderRadius: "10px",
											}}
										>
											<option value=''>
												{booking_source ? booking_source : "Please Select"}
											</option>
											<option value='janat'>Janat</option>
											<option value='affiliate'>Affiliate</option>
											<option value='manual'>Manual Reservation</option>
											<option value='booking.com'>Booking.com</option>
											<option value='trivago'>Trivago</option>
											<option value='expedia'>Expedia</option>
											<option value='hotel.com'>Hotel.com</option>
											<option value='airbnb'>Airbnb</option>
										</select>
									</div>
								</div>

								{booking_source !== "manual" && booking_source && (
									<div className='col-md-6 mx-auto my-2'>
										<div
											className='form-group'
											style={{ marginTop: "10px", marginBottom: "10px" }}
										>
											<label style={{ fontWeight: "bold" }}>
												{chosenLanguage === "Arabic"
													? "رقم التأكيد"
													: "Confirmation #"}
											</label>
											<input
												background='red'
												type='text'
												value={confirmation_number}
												onChange={(e) => setConfirmationNumber(e.target.value)}
											/>
										</div>
									</div>
								)}

								<div className='col-md-6 mx-auto my-auto'>
									<div className='form-group'>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? " الدفع او السداد"
												: "Payment"}
										</label>
										<select
											onChange={(e) => setPaymentStatus(e.target.value)}
											style={{
												height: "auto",
												width: "100%",
												padding: "10px",
												boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
												borderRadius: "10px",
											}}
										>
											<option value=''>Please Select</option>
											<option value='not paid'>Not Paid</option>
											<option value='credit/ debit'>Credit/ Debit</option>
											<option value='cash'>Cash</option>
											<option value='deposit'>Deposit</option>
										</select>
									</div>
									{paymentStatus === "deposit" && (
										<div className='mt-4'>
											<input
												value={paidAmount}
												onChange={(e) => setPaidAmount(e.target.value)}
												type='text'
												placeholder={
													chosenLanguage === "Arabic"
														? "المبلغ المودع"
														: "Deposited amount"
												}
											/>
										</div>
									)}
								</div>

								<div className='col-md-6 mx-auto my-2'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "عدد الضيوف"
												: "Total Guests"}
										</label>
										<input
											type='number'
											min={1}
											value={total_guests}
											onChange={(e) => setTotalGuests(e.target.value)}
											style={{
												height: "auto",
												width: "100%",
												padding: "10px",
												boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
												borderRadius: "10px",
											}}
										/>
									</div>
								</div>

								<div className='col-md-6 mx-auto my-2'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic"
												? "إرسال بريد إلكتروني"
												: "Send Email"}
										</label>
										<br />
										<input
											type='checkbox'
											checked={sendEmail}
											onChange={(e) => setSendEmail(e.target.checked)}
											style={{
												width: "20px",
												height: "20px",
											}}
										/>
									</div>
								</div>

								<div className='col-md-8 mx-auto my-2'>
									<div
										className='form-group'
										style={{ marginTop: "10px", marginBottom: "10px" }}
									>
										<label style={{ fontWeight: "bold" }}>
											{chosenLanguage === "Arabic" ? "تعليق الضيف" : "Comment"}
										</label>
										<textarea
											background='red'
											cols={8}
											type='text'
											value={booking_comment}
											onChange={(e) => setBookingComment(e.target.value)}
											style={{
												width: "100%",
												padding: "10px",
												boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
												borderRadius: "10px",
											}}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='col-md-4 taskeen'>
							<h4 className='my-4'>
								{chosenLanguage === "Arabic"
									? "حجز غرفة للضيف"
									: "Reserve A Room For The Guest"}
							</h4>

							<div className='row' style={{ textTransform: "capitalize" }}>
								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic"
										? "رقم التأكيد"
										: "Confirmation #"}
								</div>

								<div className='col-md-6 my-2'>{confirmation_number}</div>

								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "تاريخ الوصول" : "Arrival"}
									<div style={{ background: "#bfbfbf", padding: "2px" }}>
										{start_date ? `${new Date(start_date).toDateString()}` : ""}
									</div>
								</div>

								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "تاريخ المغادرة" : "Departure"}
									<div style={{ background: "#bfbfbf", padding: "2px" }}>
										{end_date ? `${new Date(end_date).toDateString()}` : ""}
									</div>
								</div>
								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "طريقة الدفع" : "Payment"}
								</div>
								<div className='col-md-6 my-2'>Not Paid</div>
								<div className='col-md-6 my-2'>
									{chosenLanguage === "Arabic" ? "حالة الحجز" : "Status"}
								</div>
								<div className='col-md-6 my-2'></div>
							</div>
							<h4 className='my-4 text-center' style={{ color: "#006ad1" }}>
								{chosenLanguage === "Arabic"
									? "المبلغ الإجمالي"
									: "Total Amount:"}{" "}
								{(
									calculateTotalAmountPerDay() *
									(Number(days_of_residence) - 1)
								).toLocaleString()}{" "}
								SAR
							</h4>

							<div className='text-center mx-auto'>
								<button
									className='btn btn-info'
									onClick={() => {
										window.scrollTo({ top: 1000, behavior: "smooth" });
									}}
								>
									{chosenLanguage === "Arabic"
										? "تسجيل دخول الزائر..."
										: "Check The Guest In..."}
								</button>
							</div>
						</div>
					</div>
					<div className='container'>
						<div className='row'>
							{roomsSummary && roomsSummary.length > 0 && (
								<div
									className='col-md-4'
									style={{ marginTop: "20px", marginBottom: "20px" }}
								>
									{chosenLanguage === "Arabic" ? (
										<>
											<label style={{ fontWeight: "bold" }}>نوع الغرفة</label>
											<select
												onChange={handleRoomTypeChange}
												value={selectedRoomType}
												style={{
													height: "auto",
													width: "100%",
													padding: "10px",
													boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
													borderRadius: "10px",
													textTransform: "capitalize",
												}}
											>
												<option value=''>اختر نوع الغرفة</option>
												{roomInventory &&
													roomInventory.map((room) => (
														<option key={room.room_type} value={room.room_type}>
															{room.room_type} | المتاح: {room.available} غرف
														</option>
													))}
											</select>
										</>
									) : (
										<>
											<label style={{ fontWeight: "bold" }}>Room Type</label>
											<select
												onChange={handleRoomTypeChange}
												value={selectedRoomType}
												style={{
													height: "auto",
													width: "100%",
													padding: "10px",
													boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
													borderRadius: "10px",
													textTransform: "capitalize",
												}}
											>
												<option value=''>Select Room Type</option>
												{roomsSummary.map((room) => (
													<option key={room.room_type} value={room.room_type}>
														{room.room_type} | Available: {room.available} Rooms
													</option>
												))}
											</select>
										</>
									)}
								</div>
							)}
						</div>
					</div>

					<div className='container mt-3'>
						{customer_details.name &&
						start_date &&
						end_date &&
						pickedRoomsType.length > 0 ? (
							<>
								<div className='total-amount my-3'>
									<h5 style={{ fontWeight: "bold" }}>
										Days Of Residence: {days_of_residence} Days /{" "}
										{days_of_residence <= 1 ? 1 : days_of_residence - 1} Nights
									</h5>

									<h4>
										Total Amount Per Day:{" "}
										{Number(calculateTotalAmountPerDay()).toFixed(2)} SAR/ Day
									</h4>
									<div className='room-list my-3'>
										{pickedRoomsType.map((room, index) => (
											<div
												key={index}
												className='room-item my-2'
												style={{
													fontWeight: "bold",
													textTransform: "capitalize",
													cursor: "pointer",
													fontSize: "1.1rem",
													color: "darkgoldenrod",
												}}
												onClick={() => openModal(room, index)}
											>
												{`Room Type: ${room.room_type}, Price: ${room.chosenPrice} SAR, Count: ${room.count} Rooms`}{" "}
												<span
													style={{
														color: "darkred",
														textDecoration: "underline",
														fontSize: "1.2rem",
													}}
												>
													(Click To Update)
												</span>
											</div>
										))}
									</div>

									<h3>
										Total Amount:{" "}
										{(
											calculateTotalAmountPerDay() *
											Number(days_of_residence - 1)
										).toFixed(2)}{" "}
										SAR
									</h3>
									{paidAmount && paymentStatus === "deposit" && (
										<h3>Paid Amount: {paidAmount.toLocaleString()} SAR</h3>
									)}
								</div>
								<div className='mt-5 mx-auto text-center col-md-6'>
									<button
										className='btn btn-success w-50'
										onClick={() => {
											clickSubmit2();
										}}
										style={{ fontWeight: "bold", fontSize: "1.2rem" }}
									>
										Make A Reservation...
									</button>
								</div>
							</>
						) : null}
					</div>
				</ZReservationFormWrapper>
			)}
		</>
	);
};

export default ZReservationForm2;

const ZReservationFormWrapper = styled.div`
	h4 {
		font-size: 1.35rem;
		font-weight: bolder;
	}
	text-align: ${(props) => (props.arabic ? "right" : "")};

	h5 {
		font-size: 1.2rem;
		font-weight: bold;
		text-decoration: underline;
		cursor: pointer;
		margin-top: 20px;
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
		border: 1px solid #ccc;
	}
	input[type="text"]:focus,
	input[type="email"]:focus,
	input[type="password"]:focus,
	input[type="date"]:focus,
	input[type="number"]:focus,
	select:focus,
	textarea:focus,
	label:focus {
		outline: none;
		border: 1px solid var(--primaryColor);

		box-shadow: 5px 8px 3px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		font-weight: bold;
	}

	.taskeen {
		background-color: white;
		min-height: 250px;
		border-radius: 5px;
	}
`;
