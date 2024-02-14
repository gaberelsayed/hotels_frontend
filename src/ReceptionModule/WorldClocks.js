import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import styled from "styled-components";

const WorldClocks = () => {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setDate(new Date()), 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<WorldClocksWrapper>
			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<div>
					<h5>Mecca, Saudi Arabia (GMT+3)</h5>
					<div className='clock-border-saudi'>
						<Clock
							value={
								new Date(
									date.toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
								)
							}
							renderNumbers={true}
						/>
					</div>
				</div>
				<div>
					<h5>California, USA (PST)</h5>
					<div className='clock-border-usa'>
						<Clock
							value={
								new Date(
									date.toLocaleString("en-US", {
										timeZone: "America/Los_Angeles",
									})
								)
							}
							renderNumbers={true}
						/>
					</div>
				</div>
				<div>
					<h5>Egypt (GMT+2)</h5>
					<div className='clock-border-egypt'>
						<Clock
							value={
								new Date(
									date.toLocaleString("en-US", { timeZone: "Africa/Cairo" })
								)
							}
							renderNumbers={true}
						/>
					</div>
				</div>
			</div>
		</WorldClocksWrapper>
	);
};

export default WorldClocks;

const WorldClocksWrapper = styled.div`
	text-align: center;

	h5 {
		text-align: center;
		font-weight: bold;
	}

	.clock-border-egypt {
		text-align: center;
		margin: auto;
	}
`;
