import React from "react";
import styled from "styled-components";
import CountUp from "react-countup";

const HotelMapCards = () => {
	return (
		<Wrapper>
			<StatsCards>
				<StatCard color='rgba(0, 0, 255, 0.1)' textColor='rgba(0, 0, 255, 0.2)'>
					<h2>
						Occupied{" "}
						<span>
							<CountUp end={12} duration={1.5} />
						</span>
					</h2>
				</StatCard>
				<StatCard
					color='rgba(128, 0, 128, 0.1)'
					textColor='rgba(128, 0, 128, 0.2)'
				>
					<h2>
						Vacant{" "}
						<span>
							<CountUp end={3} duration={1.5} />
						</span>
					</h2>
				</StatCard>
				<StatCard color='rgba(0, 255, 0, 0.1)' textColor='rgba(0, 255, 0, 0.5)'>
					<h2>
						Clean{" "}
						<span>
							<CountUp end={19} duration={1.5} />
						</span>
					</h2>
				</StatCard>
				<StatCard color='rgba(255, 0, 0, 0.1)' textColor='rgba(255, 0, 0, 0.2)'>
					<h2>
						Dirty{" "}
						<span>
							<CountUp end={23} duration={1.5} />
						</span>
					</h2>
				</StatCard>
				<StatCard
					color='rgba(255, 255, 0, 0.1)'
					textColor='rgba(255, 255, 0, 1)'
				>
					<h2>
						Cleaning{" "}
						<span>
							<CountUp end={17} duration={1.5} />
						</span>
					</h2>
				</StatCard>
				<StatCard color='rgba(255, 0, 0, 0.1)' textColor='rgba(255, 0, 0, 0.2)'>
					<h2>
						Out Of Service{" "}
						<span>
							<CountUp end={15} duration={1.5} />
						</span>
					</h2>
				</StatCard>
			</StatsCards>
		</Wrapper>
	);
};

export default HotelMapCards;

// Styled components
const Wrapper = styled.div`
	background-color: #ededed;
	border-radius: 5px;
`;

const StatsCards = styled.div`
	display: flex;
	justify-content: center; /* Center the cards */
	align-items: center;
	vertical-align: center;
	margin-bottom: 20px;
	gap: 5px; /* Set the gap between the cards */
	padding-top: 10px;
	padding-bottom: 10px;
`;

const StatCard = styled.div`
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 8px;
	padding: 10px;
	width: 200px; /* Set a fixed width for the cards */
	text-align: center;

	h2 {
		font-size: 1.1rem;
		margin: 0;
		color: ${(props) => props.textColor};
		font-weight: bold;

		span {
			font-size: 1rem;
			color: black;
		}
	}
`;
