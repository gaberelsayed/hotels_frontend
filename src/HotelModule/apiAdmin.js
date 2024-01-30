export const hotelAccount = (userId, token, accountId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/account-data/${accountId}/${userId}`,
		{
			method: "GET",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createNewReservation = (
	userId,
	hotelId,
	token,
	new_reservation
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/create/${userId}/${hotelId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(new_reservation),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getHotelDetails = (userId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/hotel-details/${userId}`, {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createRooms = (userId, token, room) => {
	return fetch(`${process.env.REACT_APP_API_URL}/room/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(room),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getHotelRooms = (accountId, userId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/room/${accountId}/${userId}`, {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateSingleRoom = (roomId, userId, token, room) => {
	return fetch(`${process.env.REACT_APP_API_URL}/room/${roomId}/${userId}`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(room),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingHotelDetailsForAdmin = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/hotel-details-admin/${userId}`,
		{
			method: "GET",
			Authorization: `Bearer ${token}`,
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getHotelReservations = (hotelId, userId, startdate, enddate) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/${startdate}/${enddate}/${hotelId}/${userId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getListOfRoomSummary = (checkinDate, checkoutDate, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/room/${checkinDate}/${checkoutDate}/${hotelId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getReservationSearch = (searchQuery, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/search/${searchQuery}/${hotelId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getReservationSearchAllMatches = (searchQuery, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/search/all-list/${searchQuery}/${hotelId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const reservationsList = (page, records, filters, hotelId, date) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/list/${page}/${records}/${filters}/${hotelId}/${date}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const reservationsTotalRecords = (
	page,
	records,
	filters,
	hotelId,
	date
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/get-total-records/${page}/${records}/${filters}/${hotelId}/${date}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const prerservationAuto = (page, hotelId, belongsTo) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/save/hotel-runner/${page}/${hotelId}/${belongsTo}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const singlePreReservation = (reservationNumber, hotelId, belongsTo) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/single-reservation/${reservationNumber}/${hotelId}/${belongsTo}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const singlePreReservationHotelRunner = (reservationNumber) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/single-reservation/hotel-runner/${reservationNumber}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getPaginatedListHotelRunner = (page, per_page) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/list/paginated/${page}/${per_page}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateSingleReservation = (reservationId, reservation) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservation-update/${reservationId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				// Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(reservation),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateRoomInventoryInHotelRunner = (room) => {
	return fetch(`${process.env.REACT_APP_API_URL}/room-inventory-update`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			// Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(room),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingRoomInventory = (startdate, enddate, userId, accountId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/room-inventory-reserved/${startdate}/${enddate}/${userId}/${accountId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const agodaData = (accountId, belongsTo, file) => {
	let formData = new FormData();
	formData.append("file", file);

	console.log(file);

	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/agoda-data-dump/${accountId}/${belongsTo}`,
		{
			method: "POST",
			body: formData, // send the file as FormData
		}
	)
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const expediaData = (accountId, belongsTo, file, country) => {
	let formData = new FormData();
	formData.append("file", file);

	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/expedia-data-dump/${accountId}/${belongsTo}/${country}`,
		{
			method: "POST",
			body: formData, // send the file as FormData
		}
	)
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const bookingData = (accountId, belongsTo, file) => {
	let formData = new FormData();
	formData.append("file", file);

	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/booking-data-dump/${accountId}/${belongsTo}`,
		{
			method: "POST",
			body: formData, // send the file as FormData
		}
	)
		.then((response) => response.json())
		.catch((err) => console.log(err));
};
