/** @format */

import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { signup, authenticate, isAuthenticated, signin } from "../auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Signup = () => {
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		password2: "",
		error: "",
		success: false,
		misMatch: false,
		redirectToReferrer: "",
		loading: false,
	});

	const {
		name,
		email,
		password,
		password2,
		// eslint-disable-next-line
		success,
		misMatch,
		redirectToReferrer,
		// eslint-disable-next-line
		loading,
	} = values;

	// console.log(success);

	const { user } = isAuthenticated();
	const handleChange = (name) => (event) => {
		setValues({
			...values,
			error: false,
			misMatch: false,
			[name]: event.target.value,
		});
	};

	// console.log(loading);

	// const informParent = (response) => {
	// 	setValues({ ...values, error: false, loading: true });
	// 	if (response.error) {
	// 		setValues({ ...values, error: response.error, loading: false });
	// 		toast.error(response.error);
	// 	} else {
	// 		authenticate2(response, () => {
	// 			setValues({
	// 				...values,
	// 				redirectToReferrer: true,
	// 			});
	// 		});
	// 	}
	// };

	const clickSubmit = (event) => {
		event.preventDefault();
		if (password !== password2) {
			setValues({
				...values,
				success: false,
				misMatch: true,
			});
			return <>{toast.error(MisMatchError)}</>;
		} else {
			setValues({ ...values, error: false, misMatch: false });
			signup({
				name,
				email,
				password,
				password2,
				misMatch,
			}).then((data) => {
				if (data.error || data.misMatch) {
					setValues({ ...values, error: data.error, success: false });
					toast.error(data.error);
				} else
					signin({ email, password }).then((data) => {
						if (data.error) {
							setValues({ ...values, error: data.error, loading: false });
						} else {
							authenticate(data, () => {
								setValues({
									...values,
									redirectToReferrer: true,
								});
							});
						}
					});
			});
		}
	};

	const redirectUser = () => {
		if (redirectToReferrer) {
			if (user && user.role === 1) {
				return <Redirect to='/admin/dashboard' />;
			} else {
				return <Redirect to='/' />;
			}
		}
		if (isAuthenticated()) {
			return <Redirect to='/' />;
		}
	};

	const signUpForm = () => (
		<FormSignup>
			<div className='row justify-content-md-center mt-5'>
				<div className='col-md-5 col-sm-12 '>
					<div className='form-container text-center'>
						<Fragment>
							<h1 className='mb-3'>
								Account <span className='text-primary'>Register</span>
							</h1>
							{/* <Google informParent={informParent} /> */}
						</Fragment>
						<form onSubmit={clickSubmit}>
							<div className='form-group'>
								<Fragment>
									<label htmlFor='name' style={{ fontWeight: "bold" }}>
										Full Name
									</label>
								</Fragment>
								<input
									type='text'
									name='name'
									value={name}
									onChange={handleChange("name")}
									required
								/>
							</div>
							<div
								className='form-group '
								style={{
									marginTop: "25px",
								}}
							></div>
							<div className='form-group' style={{ marginTop: "25px" }}>
								<Fragment>
									<label htmlFor='email' style={{ fontWeight: "bold" }}>
										Email Address / Phone
									</label>
								</Fragment>
								<input
									type='text'
									name='email'
									value={email}
									onChange={handleChange("email")}
									required
								/>
							</div>

							<div className='form-group ' style={{ marginTop: "25px" }}>
								<Fragment>
									<label htmlFor='password' style={{ fontWeight: "bold" }}>
										Password
									</label>
								</Fragment>
								<input
									type='password'
									name='password'
									value={password}
									onChange={handleChange("password")}
									required
								/>
							</div>
							<div
								className='form-group'
								style={{ marginTop: "25px", marginBottom: "40px" }}
							>
								<Fragment>
									<label htmlFor='password2' style={{ fontWeight: "bold" }}>
										{" "}
										Confirm Password
									</label>
								</Fragment>
								<input
									background='red'
									type='password'
									name='password2'
									value={password2}
									onChange={handleChange("password2")}
									required
								/>
							</div>
							<Fragment>
								<input
									type='submit'
									value='Register'
									className='btn btn-primary w-75 btn-block mx-auto'
									//onClick={sendEmail}
								/>
							</Fragment>
						</form>
						<hr />
						<Fragment>
							<p
								style={{
									fontSize: "0.9rem",
									textAlign: "center",
								}}
							>
								If You Already have an account, Please{" "}
								<strong
									style={{
										textDecoration: "underline",
										fontStyle: "italic",
										fontSize: "1rem",
									}}
								>
									<Link to='/signin' className='btn btn-sm btn-outline-primary'>
										Login Here
									</Link>
								</strong>
							</p>
						</Fragment>
						<hr />
					</div>
				</div>
				<Fragment>
					<div className='col-md-5 SignupPic' style={{ borderRadius: "20px" }}>
						<Fragment>
							<h5 style={{ marginTop: "70px" }}>
								<Link to='/'>
									<h4
										className=''
										style={{
											fontWeight: "bold",
											fontFamily: "Brush Script MT, Brush Script Std, cursive",
											textDecoration: "underline",
											textAlign: "center",
											color: "black",
										}}
									>
										Online Store Name
									</h4>
								</Link>
								{/* <div className="logo-type">
                  Puristic <br /> Lyf
                </div> */}
							</h5>
							<div
								className='col-md-12'
								style={{ textAlign: "center", marginTop: "0%" }}
							>
								<h3>
									Register with{" "}
									<span
										style={{
											fontWeight: "bold",
											fontFamily: "Brush Script MT, Brush Script Std, cursive",
											textDecoration: "underline",
											textAlign: "center",
											color: "black",
										}}
									>
										Online Store Name
									</span>
								</h3>
								<p className='container'>
									When you Register with{" "}
									<span
										style={{
											fontWeight: "bold",
											fontFamily: "Brush Script MT, Brush Script Std, cursive",
											textDecoration: "underline",
											textAlign: "center",
											color: "black",
											fontSize: "1.3rem",
										}}
									>
										Online Store Name
									</span>
									, you will have the privilege of obtaining free shipping,
									discounts and free products!
									<br />
									Your sensitive data is safe with highly secured complicated
									tokens and servers, furthermore, your personal information{" "}
									<span
										style={{ fontWeight: "bold", textDecoration: "underline" }}
									>
										WILL NEVER
									</span>{" "}
									be shared.
								</p>

								<p className='container mt-3'>
									<span
										style={{
											fontWeight: "bold",
											fontFamily: "Brush Script MT, Brush Script Std, cursive",
											textDecoration: "underline",
											textAlign: "center",
											color: "black",
											fontSize: "1.3rem",
										}}
									>
										Online Store Name
									</span>{" "}
									is the way to uniqueness and modern fashion. <br /> Once you
									register, you will be able to use our special program "Design
									It" which will allow you to add your preferred text to your
									loved ones or even photos from your design! <br />
									<div className='mt-5'>
										Our{" "}
										<span
											style={{
												fontWeight: "bold",
												fontFamily:
													"Brush Script MT, Brush Script Std, cursive",
												textDecoration: "underline",
												textAlign: "center",
												color: "black",
												fontSize: "1.3rem",
											}}
										>
											Online Store Name
										</span>{" "}
										team will be always there for your comfort in case you need
										any advise whether at choosing items or even at designing
										your own unique items!
									</div>
									<br />
									<div className='mt-3'>
										If you decided to design with us, Please be noted that
										<span
											style={{
												fontWeight: "bold",
												fontFamily:
													"Brush Script MT, Brush Script Std, cursive",
												textDecoration: "underline",
												textAlign: "center",
												color: "black",
												fontSize: "1.3rem",
											}}
										>
											Online Store Name
										</span>{" "}
										will always check the Copy Rights of any photo or even
										quote, if your design is Copy Righted, We will address this
										to you and give you advises.
									</div>
									<br />
								</p>
							</div>
						</Fragment>
					</div>
				</Fragment>
			</div>
		</FormSignup>
	);

	const MisMatchError = "Passwords Don't Match, Please Try Again!!";

	return (
		<WholeSignup>
			<ToastContainer />
			{signUpForm()}
			{redirectUser()}
		</WholeSignup>
	);
};

export default Signup;

const FormSignup = styled.div`
	min-height: 677px;

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
		margin-left: 50px;
		margin-right: 50px;
	}
`;

const WholeSignup = styled.div`
	margin-bottom: 100px;
	overflow: hidden;
`;
