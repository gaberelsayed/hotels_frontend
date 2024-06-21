import React from "react";
import styled from "styled-components";
// eslint-disable-next-line
import ZInputFieldPrices from "./ZInputFieldPrices";

const ZHotelDetailsForm = ({
	hotelDetails,
	setHotelDetails,
	chosenLanguage,
}) => {
	const getRoomCountTotal = (roomCountDetails) => {
		if (!roomCountDetails) {
			return 0; // Return 0 or some default value
		}
		return Object.values(roomCountDetails).reduce((total, count) => {
			// Convert count to a number and validate it
			const numericCount = Number(count);
			if (isNaN(numericCount)) {
				return total;
			}
			return total + numericCount;
		}, 0);
	};

	// Usage
	const totalRooms = getRoomCountTotal(hotelDetails.roomCountDetails);

	// eslint-disable-next-line
	const handlePriceChange = (roomType, priceType, value) => {
		setHotelDetails({
			...hotelDetails,
			roomCountDetails: {
				...hotelDetails.roomCountDetails,
				[roomType]: {
					...hotelDetails.roomCountDetails[roomType],
					[priceType]: value,
				},
			},
		});
	};

	return (
		<ZHotelDetailsFormWrapper isArabic={chosenLanguage === "Arabic"}>
			<div className='row'>
				<div className='col-md-6'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<React.Fragment>
							<label htmlFor='name' style={{ fontWeight: "bold" }}>
								{chosenLanguage === "Arabic"
									? "هل يوجد موقف سيارات في فندقك؟"
									: "Does Your Hotel Have A Parking Lot?"}
							</label>
						</React.Fragment>
						{chosenLanguage === "Arabic" ? (
							<select
								onChange={(e) =>
									setHotelDetails({
										...hotelDetails,
										parkingLot: e.target.value,
									})
								}
								className='form-control'
							>
								{hotelDetails && hotelDetails.parkingLot ? (
									<option value=''>نعم</option>
								) : (
									<option value=''>يرجى الاختيار / مطلوب*</option>
								)}
								<option value='0'>لا</option>
								<option value='1'>نعم</option>
							</select>
						) : (
							<select
								onChange={(e) =>
									setHotelDetails({
										...hotelDetails,
										parkingLot: e.target.value,
									})
								}
								className='form-control'
							>
								<option>Please select / Required*</option>
								<option value='0'>No</option>
								<option value='1'>Yes</option>
							</select>
						)}
					</div>
				</div>
				<div className='col-md-6'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<React.Fragment>
							<label htmlFor='name' style={{ fontWeight: "bold" }}>
								{chosenLanguage === "Arabic"
									? "كم عدد الطوابق في فندقك؟"
									: "How Many Floors Does your hotel have?"}
							</label>
						</React.Fragment>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.hotelFloors}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									hotelFloors: e.target.value,
								})
							}
							required
						/>
					</div>
				</div>

				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "11px",
								textAlign: "center",
							}}
						>
							Standard Rooms
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.standardRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										standardRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف فردية" : "Single Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.singleRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										singleRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف مزدوجة" : "Double Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.doubleRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										doubleRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف توأم" : "Twin Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.twinRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										twinRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف كوين" : "Queen Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.queenRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										queenRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف كينج" : "King Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.kingRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										kingRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف ثلاثية" : "Triple Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.tripleRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										tripleRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف رباعية" : "Quad Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.quadRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										quadRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>
				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "جناح" : "Suites"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.suite}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										suite: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>

				<div className='col-md-1'>
					<div className='form-group' style={{ marginTop: "10px" }}>
						<label
							htmlFor='name'
							style={{
								fontWeight: "bold",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							{chosenLanguage === "Arabic" ? "غرف عائلية" : "Family Rooms"}
						</label>
						<input
							type='number'
							name='hotelFloors'
							value={hotelDetails.roomCountDetails.familyRooms}
							onChange={(e) =>
								setHotelDetails({
									...hotelDetails,
									roomCountDetails: {
										...hotelDetails.roomCountDetails,
										familyRooms: e.target.value,
									},
								})
							}
							required
						/>
					</div>
				</div>

				{chosenLanguage === "Arabic" ? (
					<div
						className='col-md-2 my-auto'
						style={{
							marginTop: "10px",
							fontWeight: "bold",
							fontSize: "1.2rem",
						}}
					>
						الإجمالي: {totalRooms ? totalRooms : 0} غرف
					</div>
				) : (
					<div
						className='col-md-2 my-auto'
						style={{
							marginTop: "10px",
							fontWeight: "bold",
							fontSize: "1.2rem",
						}}
					>
						Total: {totalRooms ? totalRooms : 0} Rooms
					</div>
				)}
			</div>

			{/* <div
				className='col-md-12 text-center my-3'
				style={{ fontSize: "1.3rem", fontWeight: "bold" }}
			>
				{chosenLanguage === "Arabic"
					? "معدلات التسعير الثابتة:"
					: "Standard Pricing Rates:"}
			</div> */}

			{/* <div className='row my-2'>
				<div className='col-md-2 my-auto'>Standard Room Pricing</div>

				<ZInputFieldPrices
					targetedPricingTitle='Base Price'
					targetedPricing='standardRoomsPrice'
					targetedPricingProperty='basePrice'
					handlePriceChange={handlePriceChange}
					value={hotelDetails.roomCountDetails.standardRoomsPrice.basePrice}
				/>

				<ZInputFieldPrices
					targetedPricingTitle='Weekend Price'
					targetedPricing='standardRoomsPrice'
					targetedPricingProperty='weekendPrice'
					handlePriceChange={handlePriceChange}
					value={hotelDetails.roomCountDetails.standardRoomsPrice.weekendPrice}
				/>

			
			</div> */}
		</ZHotelDetailsFormWrapper>
	);
};

export default ZHotelDetailsForm;

const ZHotelDetailsFormWrapper = styled.div`
	h3 {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
		color: #006ad1;
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
	input[type="number"]:focus,
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

	.col-md-2 {
		font-weight: bold;
	}

	text-align: ${(props) => (props.isArabic ? "right" : "")};
`;
