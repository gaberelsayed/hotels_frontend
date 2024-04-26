import React, { useState, useEffect } from "react";
import SquarePaymentMainForm from "./SquarePaymentMainForm";

const SquarePaymentMain = () => {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const sqPaymentScript = document.createElement("script");
		sqPaymentScript.src = "https://js.squareup.com/v2/paymentform";
		sqPaymentScript.type = "text/javascript";
		sqPaymentScript.onload = () => setLoaded(true);
		document.getElementsByTagName("head")[0].appendChild(sqPaymentScript);
	}, []);

	return loaded ? (
		<SquarePaymentMainForm paymentForm={window.SqPaymentForm} />
	) : null;
};

export default SquarePaymentMain;
