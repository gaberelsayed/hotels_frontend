import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import styled from "styled-components";
import { signup } from "../../auth";
import { toast } from "react-toastify";

const { Option } = Select;

const OwnerRegisterForm = ({ allHotelDetailsAdmin }) => {
	const [values, setValues] = useState({
		name: "",
		phone: "",
		email: "",
		password: "",
		confirm_password: "",
		hotelIdsOwner: [],
	});

	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleHotelChange = (value) => {
		setValues({ ...values, hotelIdsOwner: value });
	};

	const formSubmit = () => {
		// Check all fields are filled
		if (
			!values.name ||
			!values.phone ||
			!values.email ||
			values.hotelIdsOwner.length === 0
		) {
			message.error("Please fill in all fields.");
			return;
		}
		// Check the password is at least 6 characters and contains numbers and letters
		if (values.password.length < 6) {
			message.error("Password must be at least 6 characters.");
			return;
		}
		if (!/\d/.test(values.password) || !/[a-zA-Z]/.test(values.password)) {
			message.error("Password must contain both letters and numbers.");
			return;
		}
		// Check the confirm password matches
		if (values.password !== values.confirm_password) {
			message.error("Passwords do not match.");
			return;
		}

		signup({
			name: values.name,
			email: values.email,
			password: values.password,
			password2: values.confirm_password,
			role: 10000,
			phone: values.phone,
			hotelName: "",
			hotelAddress: "",
			hotelCountry: "KSA",
			hotelState: "",
			hotelCity: "",
			hotelIdsOwner: values.hotelIdsOwner,
		}).then((data) => {
			if (data.error || data.misMatch) {
				setValues({ ...values, error: data.error, success: false });
				toast.error(data.error);
			} else {
				toast.success("Owner Account Was Successfully Created");

				window.scrollTo({ top: 0, behavior: "smooth" });
				setTimeout(() => {
					window.location.reload(false);
				}, 1500);
			}
		});
	};

	return (
		<OwnerRegisterFormWrapper>
			<h3>Owner Account Register</h3>
			<Form onFinish={formSubmit}>
				<div className='row'>
					<div className='col-md-4'>
						<Form.Item
							rules={[{ required: true, message: "Please input your name!" }]}
						>
							<Input
								name='name'
								value={values.name}
								onChange={handleChange}
								placeholder='Full Name'
							/>
						</Form.Item>
					</div>

					<div className='col-md-4'>
						<Form.Item
							rules={[
								{ type: "email", message: "The input is not valid E-mail!" },
								{ required: true, message: "Please input your email!" },
							]}
						>
							<Input
								name='email'
								value={values.email}
								onChange={handleChange}
								placeholder='Email'
							/>
						</Form.Item>
					</div>

					<div className='col-md-4'>
						<Form.Item
							rules={[
								{ required: true, message: "Please input your phone number!" },
							]}
						>
							<Input
								name='phone'
								value={values.phone}
								onChange={handleChange}
								placeholder='Phone'
							/>
						</Form.Item>
					</div>

					<div className='col-md-6'>
						<Form.Item
							name='password'
							rules={[
								{ required: true, message: "Please input your password!" },
								() => ({
									validator(_, value) {
										if (!value || value.length >= 6) {
											return Promise.resolve();
										}
										return Promise.reject(
											new Error("Password must be at least 6 characters.")
										);
									},
								}),
							]}
						>
							<Input.Password
								name='password'
								value={values.password}
								onChange={handleChange}
								placeholder='Password'
							/>
						</Form.Item>
					</div>

					<div className='col-md-6'>
						<Form.Item
							name='confirm_password'
							dependencies={["password"]}
							rules={[
								{ required: true, message: "Please confirm your password!" },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue("password") === value) {
											return Promise.resolve();
										}
										return Promise.reject(
											new Error("The two passwords you entered do not match!")
										);
									},
								}),
							]}
						>
							<Input.Password
								name='confirm_password'
								value={values.confirm_password}
								onChange={handleChange}
								placeholder='Confirm Password'
							/>
						</Form.Item>
					</div>

					<div className='col-md-12'>
						<Form.Item
							rules={[{ required: true, message: "Please select hotel(s)!" }]}
						>
							<Select
								mode='multiple'
								placeholder='Select Hotel'
								onChange={handleHotelChange}
								value={values.hotelIdsOwner}
								style={{ textTransform: "capitalize" }}
							>
								{allHotelDetailsAdmin.map((hotel) => (
									<Option
										style={{ textTransform: "capitalize" }}
										key={hotel._id}
										value={hotel._id}
									>
										{hotel.hotelName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
					<Form.Item>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "1rem",
								alignContent: "center",
								paddingLeft: "100px",
							}}
						>
							<Button type='primary' className='w-100' htmlType='submit'>
								Submit Owner Account Form
							</Button>
						</div>
					</Form.Item>
				</div>
			</Form>
		</OwnerRegisterFormWrapper>
	);
};

export default OwnerRegisterForm;

const OwnerRegisterFormWrapper = styled.div`
	padding: 24px;
	background: #fff;
	min-height: 360px;
	margin: auto;
	.ant-form-item {
		margin-bottom: 16px;
	}

	h3 {
		font-weight: bold;
		color: darkgoldenrod;
		text-align: center;
		padding: 10px;
	}
`;
