import React from "react";
import styled from "styled-components";

const ZSignupForm = ({ handleChange, clickSubmit, values }) => {
	return (
		<ZSignupFormWrapper>
			<React.Fragment>
				<h1 className='mb-3 text-center'>
					1- Hotel Account <span className='text-primary'>Register</span>
				</h1>
				{/* <Google informParent={informParent} /> */}
			</React.Fragment>

			<form onSubmit={clickSubmit}>
				<div className='row'>
					<div className='col-md-6'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label htmlFor='name' style={{ fontWeight: "bold" }}>
									User Name (Hotel Manager/ Owner)
								</label>
							</React.Fragment>
							<input
								type='text'
								name='name'
								value={values.name}
								onChange={handleChange("name")}
								required
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label htmlFor='email' style={{ fontWeight: "bold" }}>
									Email Address
								</label>
							</React.Fragment>
							<input
								type='text'
								name='email'
								value={values.email}
								onChange={handleChange("email")}
								required
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label htmlFor='phone' style={{ fontWeight: "bold" }}>
									Phone Number
								</label>
							</React.Fragment>
							<input
								type='text'
								name='phone'
								value={values.phone}
								onChange={handleChange("phone")}
								required
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label style={{ fontWeight: "bold" }}>Hotel Name</label>
							</React.Fragment>
							<input
								type='text'
								name='hotelName'
								value={values.hotelName}
								onChange={handleChange("hotelName")}
								required
							/>
						</div>
					</div>

					<div className='col-md-4'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label style={{ fontWeight: "bold" }}>Hotel Country</label>
							</React.Fragment>
							<input
								type='text'
								name='hotelCountry'
								value={values.hotelCountry}
								onChange={handleChange("hotelCountry")}
								required
							/>
						</div>
					</div>

					<div className='col-md-4'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label style={{ fontWeight: "bold" }}>Hotel State</label>
							</React.Fragment>
							<input
								type='text'
								name='hotelState'
								value={values.hotelState}
								onChange={handleChange("hotelState")}
								required
							/>
						</div>
					</div>

					<div className='col-md-4'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label style={{ fontWeight: "bold" }}>Hotel City</label>
							</React.Fragment>
							<input
								type='text'
								name='hotelCity'
								value={values.hotelCity}
								onChange={handleChange("hotelCity")}
								required
							/>
						</div>
					</div>

					<div className='col-md-8 mx-auto'>
						<div className='form-group' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label style={{ fontWeight: "bold" }}>Hotel Address</label>
							</React.Fragment>
							<input
								type='text'
								name='hotelAddress'
								value={values.hotelAddress}
								onChange={handleChange("hotelAddress")}
								required
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div className='form-group ' style={{ marginTop: "10px" }}>
							<React.Fragment>
								<label htmlFor='password' style={{ fontWeight: "bold" }}>
									Password
								</label>
							</React.Fragment>
							<input
								type='password'
								name='password'
								value={values.password}
								onChange={handleChange("password")}
								required
							/>
						</div>
					</div>

					<div className='col-md-6'>
						<div
							className='form-group'
							style={{ marginTop: "10px", marginBottom: "10px" }}
						>
							<React.Fragment>
								<label htmlFor='password2' style={{ fontWeight: "bold" }}>
									{" "}
									Confirm Password
								</label>
							</React.Fragment>
							<input
								background='red'
								type='password'
								name='password2'
								value={values.password2}
								onChange={handleChange("password2")}
								required
							/>
						</div>
					</div>
				</div>

				<React.Fragment>
					<input
						type='submit'
						value='Register'
						className='btn btn-primary w-75 btn-block mx-auto'
						//onClick={sendEmail}
					/>
				</React.Fragment>
			</form>
		</ZSignupFormWrapper>
	);
};

export default ZSignupForm;

const ZSignupFormWrapper = styled.div`
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

	.form-container {
		margin-left: 20px;
		margin-right: 20px;
	}
`;
