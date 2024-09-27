import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { List, Select, Spin } from "antd";
import {
	getFilteredClosedSupportCasesClients,
	updateSupportCase,
} from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import socket from "../../socket";
import ChatDetail from "./ChatDetail";
import StarRatings from "react-star-ratings"; // Import StarRatings for displaying ratings

const { Option } = Select;

const HistoryClientsSupportCases = () => {
	const { token } = isAuthenticated();
	const [closedCases, setClosedCases] = useState([]);
	const [selectedCase, setSelectedCase] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchClosedCases = () => {
			getFilteredClosedSupportCasesClients(token) // Using the client-specific API
				.then((data) => {
					if (!data.error) {
						setClosedCases(data);
					}
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
				});
		};

		fetchClosedCases();

		const handleCaseReopened = (reopenedCase) => {
			setClosedCases((prevCases) =>
				prevCases.filter((c) => c._id !== reopenedCase.case._id)
			);
		};

		const handleCaseClosed = (closedCase) => {
			setClosedCases((prevCases) => [...prevCases, closedCase.case]);
		};

		socket.on("reopenCase", handleCaseReopened);
		socket.on("closeCase", handleCaseClosed);

		return () => {
			socket.off("reopenCase", handleCaseReopened);
			socket.off("closeCase", handleCaseClosed);
		};
	}, [token]);

	const handleCaseSelection = (selectedCase) => {
		setSelectedCase(selectedCase);
	};

	const handleChangeStatus = async (value) => {
		if (selectedCase) {
			try {
				await updateSupportCase(selectedCase._id, { caseStatus: value }, token);
				if (value === "open") {
					socket.emit("reopenCase", { case: selectedCase });
					setClosedCases((prevCases) =>
						prevCases.filter((c) => c._id !== selectedCase._id)
					);
				} else if (value === "closed") {
					socket.emit("closeCase", { case: selectedCase });
					setClosedCases((prevCases) => [...prevCases, selectedCase]);
				}
				setSelectedCase(null);
			} catch (error) {
				console.error("Error reopening the case.");
			}
		}
	};

	return (
		<HistoryClientsSupportCasesWrapper dir='ltr'>
			<MainContentWrapper>
				<SupportCasesList>
					{loading ? (
						<Spin tip='Loading closed cases...' />
					) : (
						<List
							dir='ltr'
							style={{ marginTop: "20px" }}
							header={
								<div
									style={{ fontWeight: "bold", textDecoration: "underline" }}
								>
									Closed Client Support Cases
								</div>
							}
							bordered
							dataSource={closedCases}
							renderItem={(item) => (
								<List.Item
									key={item._id}
									onClick={() => handleCaseSelection(item)}
									style={{
										cursor: "pointer",
										textTransform: "capitalize",
										backgroundColor:
											selectedCase && selectedCase._id === item._id
												? "#e6f7ff"
												: "white",
										display: "flex",
										flexDirection: "column", // Arrange content vertically
										alignItems: "flex-start", // Align items to the start
									}}
								>
									<div>
										{item.inquiryAbout} -{" "}
										{item.hotelId
											? item.hotelId.hotelName +
											  " | " +
											  item.conversation[0].inquiryAbout
											: ""}
									</div>
									<StarRatingWrapper>
										<StarRatings
											rating={item.rating || 0} // Display the rating
											starRatedColor='gold'
											numberOfStars={5}
											starDimension='20px'
											starSpacing='2px'
										/>
									</StarRatingWrapper>
								</List.Item>
							)}
						/>
					)}
				</SupportCasesList>

				{selectedCase && (
					<ChatDetailWrapper dir='ltr'>
						<h3>Chat with {selectedCase.displayName2}</h3>
						<StatusSelect
							dir='ltr'
							value={selectedCase.caseStatus}
							onChange={handleChangeStatus}
						>
							<Option value='closed'>Closed</Option>
							<Option value='open'>Open</Option>
						</StatusSelect>
						<ChatDetail chat={selectedCase} isHistory={true} />
					</ChatDetailWrapper>
				)}
			</MainContentWrapper>
		</HistoryClientsSupportCasesWrapper>
	);
};

export default HistoryClientsSupportCases;

// Styled-components

const HistoryClientsSupportCasesWrapper = styled.div`
	padding: 20px;
`;

const MainContentWrapper = styled.div`
	display: flex;
	width: 100%;
	margin-top: 20px;
`;

const SupportCasesList = styled.div`
	width: 25%;
	padding-right: 10px;
`;

const ChatDetailWrapper = styled.div`
	width: 75%;
	padding-left: 10px;
	border: 1px solid #e8e8e8;
	background-color: #f9f9f9;
	border-radius: 4px;
`;

const StatusSelect = styled(Select)`
	width: 150px;
	margin-top: 20px;
`;

const StarRatingWrapper = styled.div`
	margin-top: 5px; /* Add space between the text and stars */
`;
