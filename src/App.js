import React, { useEffect } from "react";
import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "./cart_context";
import Footer from "./Footer";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

//Management Routes
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./AdminModule/AdminDashboard";
import AddNewHotel from "./AdminModule/NewHotels/AddNewHotel";
import AddedHotelsMain from "./AdminModule/AddedHotels/AddedHotelsMain";

//Hotel Routes
import HotelRoute from "./auth/HotelRoute";
import HotelManagerDashboard from "./HotelModule/HotelManagement/HotelManagerDashboard";
import ReservationsMain from "./HotelModule/ReservationsFolder/ReservationsMain";
import NewReservationMain from "./HotelModule/NewReservation/NewReservationMain";
import HotelSettingsMain from "./HotelModule/HotelSettings/HotelSettingsMain";
import SignupNew from "./HotelModule/HotelStaff/SignupNew";
import ReservationDetail from "./HotelModule/ReservationsFolder/ReservationDetail";
import ClientPayMain from "./HotelModule/ClientPay/ClientPayMain";

function App() {
	const { languageToggle, chosenLanguage } = useCartContext();

	const languageToggle2 = () => {
		localStorage.setItem("lang", JSON.stringify(chosenLanguage));
		// window.location.reload(false);
	};

	useEffect(() => {
		languageToggle2();
		languageToggle(chosenLanguage);
		// eslint-disable-next-line
	}, [chosenLanguage]);

	return (
		<BrowserRouter>
			<>
				<ToastContainer
					position='top-center'
					toastStyle={{ width: "auto", minWidth: "400px" }}
				/>

				<Switch>
					<Route path='/signup' exact component={Signup} />
					<Route path='/' exact component={Signin} />
					<Route
						path='/client-payment/:reservationId/:guestname/:guestphone/:hotelname/:roomtype/:checkin/:checkout/:daysofresidence/:totalamount'
						exact
						component={ClientPayMain}
					/>

					<AdminRoute
						path='/admin/dashboard'
						exact
						component={AdminDashboard}
					/>
					<AdminRoute path='/admin/new-hotel' exact component={AddNewHotel} />
					<AdminRoute
						path='/admin/added-hotels'
						exact
						component={AddedHotelsMain}
					/>

					<HotelRoute
						path='/hotel-management/dashboard'
						exact
						component={HotelManagerDashboard}
					/>
					<HotelRoute
						path='/hotel-management/reservation-history'
						exact
						component={ReservationsMain}
					/>
					<HotelRoute
						path='/hotel-management/new-reservation'
						exact
						component={NewReservationMain}
					/>
					<HotelRoute
						path='/hotel-management/settings'
						exact
						component={HotelSettingsMain}
					/>

					<HotelRoute
						path='/hotel-management/staff'
						exact
						component={SignupNew}
					/>

					<HotelRoute
						path='/reservation-details/:confirmationNumber'
						exact
						component={ReservationDetail}
					/>
				</Switch>
			</>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
