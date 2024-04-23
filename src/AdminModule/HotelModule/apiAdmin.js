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

export const sendReservationConfirmationEmail = (
	reservationData,
	userId,
	hotelId,
	token
) => {
	return fetch(`${process.env.REACT_APP_API_URL}/send-reservation-email`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(reservationData),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const sendPaymnetLinkToTheClient = (
	reservationLink,
	reservationEmail
) => {
	return fetch(`${process.env.REACT_APP_API_URL}/send-payment-link-email`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			paymentLink: reservationLink,
			customerEmail: reservationEmail,
		}),
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

export const checkedoutReservationsList = (
	page,
	records,
	startDate,
	endDate,
	hotelId,
	channel
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations-checkedout/${page}/${records}/${hotelId}/${channel}/${startDate}/${endDate}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getCheckedOutReservations = (page, records, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/checkedout-reservations/list/${page}/${records}/${hotelId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const generalReportReservationsList = (
	page,
	records,
	startDate,
	endDate,
	hotelId,
	channel,
	dateBy,
	noshow,
	cancel,
	inhouse,
	showCheckedout,
	payment
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations-general-report/${page}/${records}/${hotelId}/${channel}/${startDate}/${endDate}/${dateBy}/${noshow}/${cancel}/${inhouse}/${showCheckedout}/${payment}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getGeneralReportReservations = (
	startDate,
	endDate,
	hotelId,
	channel,
	dateBy,
	noshow,
	cancel,
	inhouse,
	showCheckedout,
	payment
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/general-report-reservations/list/${hotelId}/${channel}/${startDate}/${endDate}/${dateBy}/${noshow}/${cancel}/${inhouse}/${showCheckedout}/${payment}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getReservationSummary = (hotelId, date) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations-summary/${hotelId}/${date}`,
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

export const checkedoutReservationsTotalRecords = (
	startDate,
	endDate,
	hotelId,
	channel
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations-summary-checkedout/${hotelId}/${channel}/${startDate}/${endDate}`,
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

export const singlePreReservationById = (reservationId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/single-reservation/${reservationId}`,
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

export const gettingDayOverDayInventory = (userId, accountId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/inventory-report/${userId}/${accountId}`,
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

export const airbnbData = (accountId, belongsTo, file, country) => {
	let formData = new FormData();
	formData.append("file", file);

	console.log(file);

	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/airbnb-data-dump/${accountId}/${belongsTo}/${country}`,
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

export const janatData = (accountId, belongsTo, file) => {
	let formData = new FormData();
	formData.append("file", file);

	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/janat-data-dump/${accountId}/${belongsTo}`,
		{
			method: "POST",
			body: formData, // send the file as FormData
		}
	)
		.then((response) => response.json())
		.catch((err) => console.log(err));
};

export const cloudinaryUpload1 = (userId, token, image) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/admin/uploadimages/${userId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(image),
			// body: image,
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateHotelDetails = (hotelId, userId, token, details) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/hotel-details-update/${hotelId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(details),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingDateReport = (date, hotelId, userMainId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations/todate/ahowan/yaba/${date}/${hotelId}/${userMainId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingDayOverDay = (hotelId, userMainId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/dayoverday/${hotelId}/${userMainId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingMonthOverMonth = (hotelId, userMainId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/monthovermonth/${hotelId}/${userMainId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingBookingSource = (hotelId, userMainId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/bookingsource/${hotelId}/${userMainId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingReservationStatus = (hotelId, userMainId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservationstatus/${hotelId}/${userMainId}`,
		{
			method: "GET",
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

//For Payment
export const getBraintreeClientToken = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/braintree/getToken`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const processPayment_Subscription = (token, paymentData) => {
	return fetch(`${process.env.REACT_APP_API_URL}/braintree/subscription`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(paymentData),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const processPayment = (reservationId, paymentData) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/braintree/payment/${reservationId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentData),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const processPayment_SAR = (reservationId, paymentData) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/braintree/sar-payment/${reservationId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentData),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const processCommissionPayment = (paymentData) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/braintree/commission-payment`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentData),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const processPayment_Square = (reservationId, paymentData) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/square/payment/${reservationId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentData),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const processPayment_Stripe = (reservationId, paymentData) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/stripe/payment/${reservationId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentData),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingCreatePaymentIntent = async (amount, metadata) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/create-payment-intent`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ amount: amount, metadata }),
			}
		);
		const data = await response.json();
		return data.clientSecret;
	} catch (error) {
		console.error("Error creating payment intent:", error);
		throw error;
	}
};

export const processCommissionPayment_Stripe = (paymentData) => {
	return fetch(`${process.env.REACT_APP_API_URL}/stripe/commission-payment`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(paymentData),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createStripeCheckoutSession = async (checkoutData) => {
	try {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/create-checkout-session`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(checkoutData),
			}
		);
		const data = await response.json();
		return data.url;
	} catch (error) {
		console.error("Error creating checkout session:", error);
		throw error;
	}
};

export const updatingReservationAfterSuccessfulPayment = (details) => {
	return fetch(`${process.env.REACT_APP_API_URL}/stripe/update-reservation`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(details),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const currecyConversion = (saudimoney) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/currencyapi/${Number(saudimoney).toFixed(
			2
		)}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateSubscriptionCardFn = (token, paymentData) => {
	console.log(paymentData, "paymentData");
	return fetch(
		`${process.env.REACT_APP_API_URL}/braintree/update-subscription-card`,
		{
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(paymentData),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOwnerProfile = (userId, token, user) => {
	return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateUser = (user, next) => {
	if (typeof window !== "undefined") {
		if (localStorage.getItem("jwt")) {
			let auth = JSON.parse(localStorage.getItem("jwt"));
			auth.user = user;
			localStorage.setItem("jwt", JSON.stringify(auth));
			next();
		}
	}
};

export const getSubscriptionData = (userId, token, subscriptionId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/braintree/subscription-data/${userId}/${subscriptionId}`,
		{
			method: "GET",
			headers: {
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

export const createNewHouseKeepingTask = (hotelId, housekeeping) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/house-keeping/create/${hotelId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(housekeeping),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getAllHouseKeepingTasks = (page, records, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/house-keeping-list/${page}/${records}/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getAllHouseKeepingTotalRecords = (hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/house-keeping-total-records/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getHouseKeepingStaff = (hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/house-keeping-staff/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updatingHouseKeepingTask = (taskId, task) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/house-keeping-update-document/${taskId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(task),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getEmployeeWorkLoad = (userId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/house-keeping-employee/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const pendingPaymentReservationList = (page, records, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations-pending/${page}/${records}/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingCommissionPaidReservations = (page, records, hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/reservations-paid-commission/${page}/${records}/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingCollectedReservations = (
	page,
	records,
	hotelId,
	status
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/collected-reservations/list/${status}/${page}/${records}/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const gettingAggregatedCollectedReservations = (
	page,
	records,
	hotelId,
	status
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/aggregated-collected-reservations/list/${status}/${page}/${records}/${hotelId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createConnectAccount = (hotelId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/stripe/create-connect-account/${hotelId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				// Authorization: `Bearer ${token}`,
			},
			// body: JSON.stringify(),
		}
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};
