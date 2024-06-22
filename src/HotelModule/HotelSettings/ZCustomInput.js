import React from "react";
import { Input } from "antd";

const ZCustomInput = React.forwardRef(({ value, onClick }, ref) => (
	<Input
		ref={ref}
		value={value}
		onClick={onClick}
		readOnly
		placeholder='Select date range'
		style={{ cursor: "pointer" }}
	/>
));

export default ZCustomInput;
