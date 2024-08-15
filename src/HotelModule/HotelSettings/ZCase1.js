import React from "react";
import { Form, Input, Select } from "antd";
import styled from "styled-components";

const { Option } = Select;

const ZCase1 = ({
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
	roomTypes,
	setSelectedRoomType,
	amenitiesList,
	roomTypeSelected,
	setRoomTypeSelected,
	fromPage,
	setCustomRoomType,
	customRoomType,
	form,
}) => {
	return (
		<ZCase1Wrapper
			isArabic={chosenLanguage === "Arabic"}
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
		>
			<>
				<Form.Item
					name='roomType'
					label={
						chosenLanguage === "Arabic" ? "اختر نوع الغرفة" : "Select Room Type"
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

							if (fromPage === "Updating") {
								form.setFieldsValue({
									displayName: existingRoomDetails.displayName || "",
									roomCount: existingRoomDetails.count || 0,
									basePrice: existingRoomDetails.price?.basePrice || 0,
									description: existingRoomDetails.description || "",
									amenities: existingRoomDetails.amenities || [],
								});
							}
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

										const existingRoomIndex = updatedRoomCountDetails.findIndex(
											(room) => room.roomType === roomType
										);

										if (existingRoomIndex > -1) {
											updatedRoomCountDetails[existingRoomIndex].displayName =
												e.target.value;
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
							label={chosenLanguage === "Arabic" ? "عدد الغرف" : "Room Count"}
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

										const existingRoomIndex = updatedRoomCountDetails.findIndex(
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

										const existingRoomIndex = updatedRoomCountDetails.findIndex(
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
								chosenLanguage === "Arabic" ? "وصف الغرفة" : "Room Description"
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

										const existingRoomIndex = updatedRoomCountDetails.findIndex(
											(room) => room.roomType === roomType
										);

										if (existingRoomIndex > -1) {
											updatedRoomCountDetails[existingRoomIndex].description =
												e.target.value;
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
								chosenLanguage === "Arabic" ? "وسائل الراحة" : "Room Amenities"
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

										const existingRoomIndex = updatedRoomCountDetails.findIndex(
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
		</ZCase1Wrapper>
	);
};

export default ZCase1;

const ZCase1Wrapper = styled.div``;
