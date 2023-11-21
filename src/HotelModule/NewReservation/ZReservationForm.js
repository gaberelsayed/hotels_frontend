import React from "react";
import styled from "styled-components";
import { DatePicker } from "antd";
import HotelOverviewReservation from "./HotelOverviewReservation";

const ZReservationForm = ({
	customer_details,
	setCustomer_details,
	start_date,
	setStart_date,
	end_date,
	setEnd_date,
	disabledDate,
	chosenLanguage,
	hotelDetails,
	hotelRooms,
	values,
}) => {
	return (
		<ZReservationFormWrapper>
			<h4>Customer Details:</h4>

			<div className='row'>
				<div className='col-md-4'>
					<div
						className='form-group'
						style={{ marginTop: "10px", marginBottom: "10px" }}
					>
						<label style={{ fontWeight: "bold" }}> Visitor Name</label>
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
						<label style={{ fontWeight: "bold" }}> Visitor Phone</label>
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
						<label style={{ fontWeight: "bold" }}> Visitor Email</label>
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

				<div className='col-md-6'>
					<label
						className='dataPointsReview mt-3'
						style={{
							fontWeight: "bold",
							fontSize: "1.05rem",
							color: "#32322b",
						}}
					>
						Start Date
					</label>
					<br />
					<DatePicker
						className='inputFields'
						disabledDate={disabledDate}
						inputReadOnly
						size='small'
						showToday={true}
						placeholder='Please pick the desired schedule start date'
						style={{
							height: "auto",
							width: "100%",
							padding: "10px",
							boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
							borderRadius: "10px",
						}}
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
						End Date
					</label>
					<br />
					<DatePicker
						className='inputFields'
						disabledDate={disabledDate}
						inputReadOnly
						size='small'
						showToday={true}
						placeholder='Please pick the desired schedule start date'
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
			<div className='col-md-8 mx-auto mt-5'>
				<hr />
			</div>

			<h4>Pick Up A Room</h4>
			<h5>Please Click Here To Pick A Room:</h5>

			<HotelOverviewReservation
				hotelDetails={hotelDetails}
				hotelRooms={hotelRooms}
				values={values}
			/>
		</ZReservationFormWrapper>
	);
};

export default ZReservationForm;

const ZReservationFormWrapper = styled.div`
	h4 {
		font-size: 1.35rem;
		font-weight: bolder;
	}

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
	select:focus,
	textarea:focus,
	label:focus {
		outline: none;
		border: 1px solid var(--primaryColor);

		box-shadow: 5px 8px 3px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		font-weight: bold;
	}
`;
