import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { List, Select, Spin } from "antd";
import { getFilteredClosedSupportCasesClients } from "../apiAdmin";
import { isAuthenticated } from "../../auth";
import socket from "../../socket";
import ChatDetailHotels from "./ChatDetailHotels";
import { updateSupportCase } from "../../AdminModule/apiAdmin";

// eslint-disable-next-line
const { Option } = Select;

const HistoryClientsSupportCasesHotels = () => {
	const { token } = isAuthenticated();
	const [closedCases, setClosedCases] = useState([]);
	const [selectedCase, setSelectedCase] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedHotel, setSelectedHotel] = useState(null);

	useEffect(() => {
		const storedHotel = localStorage.getItem("selectedHotel");
		if (storedHotel) {
			setSelectedHotel(JSON.parse(storedHotel)._id);
		}
	}, []);

	useEffect(() => {
		const fetchClosedCases = () => {
			if (selectedHotel) {
				getFilteredClosedSupportCasesClients(token, selectedHotel)
					.then((data) => {
						if (!data.error) {
							setClosedCases(data);
						}
						setLoading(false);
					})
					.catch(() => {
						setLoading(false);
					});
			}
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
	}, [token, selectedHotel]);

	const handleCaseSelection = (selectedCase) => {
		setSelectedCase(selectedCase);
	};

	// eslint-disable-next-line
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
				console.error(`Error updating the case to ${value}.`);
			}
		}
	};

	return (
		<HistoryClientsSupportCasesHotelsWrapper>
			<MainContentWrapper>
				<SupportCasesList>
					{loading ? (
						<Spin tip='Loading closed cases...' />
					) : (
						<List
							style={{ marginTop: "20px" }}
							header={
								<div
									style={{ fontWeight: "bold", textDecoration: "underline" }}
								>
									Closed Support Cases
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
									}}
								>
									{item.hotelId ? item.conversation[0].inquiryAbout : ""}
								</List.Item>
							)}
						/>
					)}
				</SupportCasesList>

				{selectedCase && (
					<ChatDetailWrapper>
						{/* <StatusSelect
							value={selectedCase.caseStatus}
							onChange={handleChangeStatus}
						>
							<Option value='closed'>Closed</Option>
							<Option value='open'>Open</Option>
						</StatusSelect> */}
						<ChatDetailHotels
							chat={selectedCase}
							isHistory={true} // Include this prop to indicate it's historical
						/>
					</ChatDetailWrapper>
				)}
			</MainContentWrapper>
		</HistoryClientsSupportCasesHotelsWrapper>
	);
};

export default HistoryClientsSupportCasesHotels;

const HistoryClientsSupportCasesHotelsWrapper = styled.div`
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

// eslint-disable-next-line
const StatusSelect = styled(Select)`
	width: 150px;
	margin-top: 20px;
`;
