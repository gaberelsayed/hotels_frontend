import React from "react";
import CountUp from "react-countup";
import styled from "styled-components";

const ScoreCards = ({ scoreCardObject, titles }) => {
	const { total, inhouse, other } = scoreCardObject;

	return (
		<ScoreCardsWrapper>
			<Card bgColor='#2f556b'>
				<Title>{titles.total}</Title>
				<Count>
					<CountUp
						start={0}
						end={total}
						duration={1.5}
						separator=','
						decimals={0}
					/>
				</Count>
			</Card>
			<Card bgColor='#6b452f'>
				<Title>{titles.inhouse}</Title>
				<Count>
					<CountUp
						start={0}
						end={inhouse}
						duration={2}
						separator=','
						decimals={2}
					/>
				</Count>
			</Card>
			<Card bgColor='#6b2f2f'>
				<Title>{titles.others}</Title>
				<Count>
					<CountUp
						start={0}
						end={other}
						duration={2.5}
						separator=','
						decimals={2}
					/>
				</Count>
			</Card>
		</ScoreCardsWrapper>
	);
};

export default ScoreCards;

const ScoreCardsWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	margin: 20px 0;
`;

const Card = styled.div`
	background-color: ${(props) => props.bgColor};
	color: white;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	text-align: center;
	width: 30%;
	transition: transform 0.3s ease;

	&:hover {
		transform: scale(1.05);
	}
`;

const Title = styled.div`
	font-size: 1.2em;
	font-weight: bold;
	margin-bottom: 10px;

	@media (max-width: 1000px) {
		font-size: 1em;
	}
`;

const Count = styled.div`
	font-size: 1.7rem;
	font-weight: bold;

	@media (max-width: 1000px) {
		font-size: 1.3rem;
	}
`;
