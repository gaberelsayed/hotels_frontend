import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
	getHotelDetails,
	hotelAccount,
	singlePreReservation,
	singlePreReservationHotelRunner,
} from "../apiAdmin";
import { Spin } from "antd";
import { isAuthenticated } from "../../auth";
import SingleReservationSection1 from "./SingleReservationSection1";
import SingleReservationSection2 from "./SingleReservationSection2";

const SinglePrereservationPage = (props) => {
	const [loading, setLoading] = useState(true);
	const [singleReservationHotelRunner, setSingleReservationHotelRunner] =
		useState("");
	const [searchedReservation, setSearchedReservation] = useState("");

	const { user, token } = isAuthenticated();

	const renderingBookingData = () => {
		setLoading(true);

		hotelAccount(user._id, token, user._id).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error rendering");
			} else {
				getHotelDetails(data._id).then((data2) => {
					if (data2 && data2.error) {
						console.log(data2.error, "Error rendering");
					} else {
						console.log(data2[0], "data2");
						if (data && data.name && data._id && data2 && data2.length > 0) {
							singlePreReservation(
								props.match.params.confirmationNumber,
								data2[0]._id,
								data2[0].belongsTo._id
							).then((data3) => {
								if (data3 && data3.error) {
									console.log(data3.error, "error single reservation");
									setLoading(false);
								} else {
									singlePreReservationHotelRunner(
										props.match.params.confirmationNumber
									).then((data4) => {
										if (data4 && data4.error) {
											console.log(data4.error);
										} else {
											setSearchedReservation(data3);
											setSingleReservationHotelRunner(
												data4.reservations && data4.reservations[0]
											);
										}
									});

									setLoading(false);
								}
							});
						}
					}
				});
			}
		});
	};

	useEffect(() => {
		renderingBookingData();
		// eslint-disable-next-line
	}, []);

	console.log(singleReservationHotelRunner, "singleReservationHotelRunner");

	return (
		<SinglePrereservationPageWrapper>
			{loading ? (
				<>
					<div className='text-center my-5'>
						<Spin size='large' />
						<p>Loading...</p>
					</div>
				</>
			) : (
				<>
					<div className='row'>
						<div
							className='col-md-4 mx-auto myGrid'
							style={{ border: "1px solid #311414" }}
						>
							<SingleReservationSection1
								searchedReservation={searchedReservation}
							/>
						</div>

						<div
							className='col-md-8 mx-auto myGrid'
							style={{ border: "1px solid #311414" }}
						>
							<SingleReservationSection2
								singleReservationHotelRunner={singleReservationHotelRunner}
							/>
						</div>
					</div>
				</>
			)}
		</SinglePrereservationPageWrapper>
	);
};

export default SinglePrereservationPage;

const SinglePrereservationPageWrapper = styled.div`
	padding: 50px;
	min-height: 1000px;
	background-color: #f0f0f0;

	.myGrid {
		min-height: 800px;
		background-color: white;
	}

	h3 {
		font-size: 1.65rem;
		font-weight: bold;
		color: #ad4949;
	}
`;
