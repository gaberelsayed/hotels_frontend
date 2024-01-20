import React, { useState, useEffect } from "react";
import {
	getPaginatedListHotelRunner,
	prereservationList,
	prerservationAuto,
} from "../apiAdmin";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import PreReservationTable from "../ReservationsFolder/PreReservationTable";
import { Spin } from "antd";

const HotelRunnerReservationList = ({ chosenLanguage, hotelDetails }) => {
	const [allPreReservations, setAllPreReservations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [q, setQ] = useState("");
	const [decrement, setDecrement] = useState(0);

	const { user } = isAuthenticated();

	const getAllPreReservation = () => {
		prereservationList(user._id).then((data3) => {
			if (data3 && data3.error) {
				console.log(data3.error);
			} else {
				setAllPreReservations(data3 && data3.length > 0 ? data3 : []);
			}
		});
	};

	useEffect(() => {
		getAllPreReservation();
		// eslint-disable-next-line
	}, []);

	const addPreReservations = () => {
		const isConfirmed = window.confirm(
			chosenLanguage === "Arabic"
				? "قد تستغرق هذه العملية بضع دقائق، هل تريد المتابعة؟"
				: "This may take a few minutes, Do you want to proceed?"
		);
		if (!isConfirmed) return;

		setLoading(true);
		getPaginatedListHotelRunner(1, 15).then((data0) => {
			if (data0 && data0.error) {
				console.log(data0.error);
			} else {
				prerservationAuto(
					data0.pages - decrement,
					hotelDetails._id,
					hotelDetails.belongsTo._id
				).then((data) => {
					if (data) {
						console.log(data, "data from prereservation");
					}
					setDecrement(decrement + 1);
					setLoading(false);
				});
			}
		});
	};

	return (
		<HotelRunnerReservationListWrapper>
			{loading ? (
				<>
					<div className='text-center my-5'>
						<Spin size='large' />
						<p>
							{" "}
							{chosenLanguage === "Arabic" ? "" : ""} Loading Reservations...
						</p>
					</div>
				</>
			) : (
				<>
					<div
						className='mx-auto mb-5 mt-4 text-center'
						onClick={() => {
							addPreReservations();
						}}
					>
						<button className='btn btn-success' style={{ fontWeight: "bold" }}>
							{chosenLanguage === "Arabic"
								? "تنزيل جميع الحجوزات من Booking.com وExpedia وTrivago؟"
								: "Get All Reservations from Booking.com, Expedia & Trivago?"}
						</button>
					</div>
					<div>
						<PreReservationTable
							allPreReservations={allPreReservations}
							setQ={setQ}
							q={q}
							chosenLanguage={chosenLanguage}
						/>
					</div>
				</>
			)}
		</HotelRunnerReservationListWrapper>
	);
};

export default HotelRunnerReservationList;

const HotelRunnerReservationListWrapper = styled.div`
	margin-top: 50px;
	margin-bottom: 50px;
	margin-right: 20px;
`;
