import React from "react";
import CountUp from "react-countup";
import styled from "styled-components";

const ScoreCards = ({ scoreCardObject, chosenLanguage }) => {
	const { total, total_amount, commission_janat, commission_affiliate } =
		scoreCardObject;
	const total_commission_due = commission_janat + commission_affiliate;

	return (
		<>
			<ScoreCardsWrapper>
				<Card bgColor='#2f556b'>
					<Title>
						{chosenLanguage === "Arabic" ? "الحجوزات" : "Reservations"}
					</Title>
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
					<Title>
						{chosenLanguage === "Arabic" ? "المبلغ الإجمالي" : "Total Amount"}
					</Title>
					<Count>
						<CountUp
							start={0}
							end={total_amount}
							duration={2}
							separator=','
							decimals={2}
							suffix=' SAR'
						/>
					</Count>
				</Card>
				<Card bgColor='#376b2f'>
					<Title>
						{chosenLanguage === "Arabic" ? "عمولة جنات" : "Janat Commission"}
					</Title>
					<Count>
						<CountUp
							start={0}
							end={commission_janat}
							duration={2.5}
							separator=','
							decimals={2}
							suffix=' SAR'
						/>
					</Count>
				</Card>
				<Card bgColor='#2f6b6b'>
					<Title>
						{chosenLanguage === "Arabic"
							? "عمولة الAffiliate "
							: "Affiliate Commission"}
					</Title>
					<Count>
						<CountUp
							start={0}
							end={commission_affiliate}
							duration={2.5}
							separator=','
							decimals={2}
							suffix=' SAR'
						/>
					</Count>
				</Card>
			</ScoreCardsWrapper>
			<TotalCard bgColor='#6b2f4c'>
				<Title>
					{chosenLanguage === "Arabic"
						? "إجمالي العمولة المستحقة"
						: "Total Commission Due"}
				</Title>
				<Count>
					<CountUp
						start={0}
						end={total_commission_due}
						duration={3}
						separator=','
						decimals={2}
						suffix=' SAR'
					/>
				</Count>
			</TotalCard>
		</>
	);
};

export default ScoreCards;

const ScoreCardsWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	margin: 20px 0;
	flex-wrap: wrap;
`;

const Card = styled.div`
	background-color: ${(props) => props.bgColor};
	color: white;
	padding: 5px;
	border-radius: 10px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	text-align: center;
	width: 20%;
	margin-bottom: 10px;
	transition: transform 0.3s ease;

	&:hover {
		transform: scale(1.05);
	}

	@media (max-width: 768px) {
		width: 45%;
	}

	@media (max-width: 480px) {
		width: 90%;
	}
`;

const TotalCard = styled(Card)`
	width: 50%;
	margin: 20px auto;

	@media (max-width: 768px) {
		width: 90%;
	}

	@media (max-width: 480px) {
		width: 90%;
	}
`;

const Title = styled.div`
	font-size: 1rem;
	font-weight: bold;
	margin-bottom: 10px;
`;

const Count = styled.div`
	font-size: 1.4rem;
	font-weight: bold;
`;
