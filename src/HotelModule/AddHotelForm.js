import React, { useState } from "react";
import { Form, Input, Button, Typography, Select } from "antd";
import { toast } from "react-toastify";
import { isAuthenticated } from "../auth"; // Import the authentication method
import { PropertySignup } from "./apiAdmin"; // Import the API method
import styled from "styled-components";

const { Title } = Typography;
const { Option } = Select;

const AddHotelForm = ({ closeAddHotelModal }) => {
	const [hotelData, setHotelData] = useState({
		hotelName: "",
		hotelCountry: "",
		hotelState: "",
		hotelCity: "",
		phone: "",
		hotelAddress: "",
		hotelFloors: "",
		propertyType: "", // Added propertyType field
	});

	const { user } = isAuthenticated(); // Get the authenticated user

	const handleChange = (name) => (event) => {
		const value = event.target ? event.target.value : event;
		setHotelData({ ...hotelData, [name]: value });
	};

	const handleSubmit = async () => {
		try {
			const response = await PropertySignup({
				...hotelData,
				existingUser: user ? user._id : null, // Pass the user ID if the user is authenticated
			});
			if (response.error) {
				toast.error(response.error);
			} else {
				toast.success(`Hotel ${hotelData.hotelName} was successfully added`);
				closeAddHotelModal(); // Close the modal after successful submission
				setTimeout(() => {
					window.location.reload();
				}, 2000); // Refresh the page after 2 seconds
			}
		} catch (error) {
			toast.error("Error adding hotel: " + error.message);
		}
	};

	return (
		<Form onFinish={handleSubmit} layout='vertical'>
			<Title level={3}>Add New Property</Title>
			<Form.Item label='Hotel Name' required>
				<Input
					value={hotelData.hotelName}
					onChange={handleChange("hotelName")}
					placeholder='Hotel Name'
				/>
			</Form.Item>
			<Form.Item label='Country' required>
				<Input
					value={hotelData.hotelCountry}
					onChange={handleChange("hotelCountry")}
					placeholder='Country'
				/>
			</Form.Item>
			<Form.Item label='State' required>
				<Input
					value={hotelData.hotelState}
					onChange={handleChange("hotelState")}
					placeholder='State'
				/>
			</Form.Item>
			<Form.Item label='City' required>
				<Input
					value={hotelData.hotelCity}
					onChange={handleChange("hotelCity")}
					placeholder='City'
				/>
			</Form.Item>
			<Form.Item label='Phone' required>
				<Input
					value={hotelData.phone}
					onChange={handleChange("phone")}
					placeholder='Phone'
				/>
			</Form.Item>
			<Form.Item label='Address' required>
				<Input
					value={hotelData.hotelAddress}
					onChange={handleChange("hotelAddress")}
					placeholder='Address'
				/>
			</Form.Item>
			<Form.Item label='Number of Floors' required>
				<Input
					value={hotelData.hotelFloors}
					onChange={handleChange("hotelFloors")}
					placeholder='Number of Floors'
				/>
			</Form.Item>
			<Form.Item label='Property Type' required>
				<Select
					value={hotelData.propertyType}
					onChange={handleChange("propertyType")}
					placeholder='Select Property Type'
				>
					<Option value='Hotel'>Hotel</Option>
					<Option value='Apartments'>Apartments</Option>
					<Option value='Houses'>Houses</Option>
				</Select>
			</Form.Item>
			<Form.Item>
				<StyledButton type='primary' htmlType='submit'>
					Add Hotel
				</StyledButton>
			</Form.Item>
		</Form>
	);
};

export default AddHotelForm;

const StyledButton = styled(Button)`
	background-color: var(--button-bg-primary);
	border-color: var(--button-bg-primary);
	color: var(--button-font-color);
	&:hover,
	&:focus {
		background-color: var(--button-bg-primary-hover);
		border-color: var(--button-bg-primary-hover);
	}
`;
