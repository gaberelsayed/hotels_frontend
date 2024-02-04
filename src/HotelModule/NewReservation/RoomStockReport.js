import React, { useState, useMemo } from "react";
import { Table, Button, Select } from "antd";
import styled from "styled-components";

const { Option } = Select;

export const RoomStockReport = ({ dayOverDayInventory, chosenLanguage }) => {
	const [selectedRoomType, setSelectedRoomType] = useState("");
	const [showDanger, setShowDanger] = useState(false);

	const filteredData = useMemo(() => {
		return dayOverDayInventory.filter((item) => {
			const matchesType = selectedRoomType
				? item.room_type === selectedRoomType
				: true;
			const isDanger = showDanger ? item.total_rooms_available <= 3 : true;
			return matchesType && isDanger;
		});
	}, [dayOverDayInventory, selectedRoomType, showDanger]);

	const roomTypes = useMemo(() => {
		return [...new Set(dayOverDayInventory.map((item) => item.room_type))];
	}, [dayOverDayInventory]);

	const columns = [
		{ title: "Date", dataIndex: "date", key: "date" },
		{ title: "Room Type", dataIndex: "room_type", key: "room_type" },
		{ title: "Total Rooms", dataIndex: "total_rooms", key: "total_rooms" },
		{
			title: "Total Rooms Available",
			dataIndex: "total_rooms_available",
			key: "total_rooms_available",
			render: (text) => (
				<span
					style={{
						color: text <= 3 ? "white" : "inherit",
						backgroundColor: text <= 3 ? "darkred" : "inherit",
					}}
				>
					{text}
				</span>
			),
		},
		{
			title: "Total Rooms Reserved",
			dataIndex: "total_rooms_reserved",
			key: "total_rooms_reserved",
		},
		{
			title: "Total Rooms Occupied",
			dataIndex: "total_rooms_occupied",
			key: "total_rooms_occupied",
		},
	];

	return (
		<RoomStockReportWrapper>
			<FiltersWrapper>
				<Select
					placeholder='Filter by Room Type'
					onChange={(value) => setSelectedRoomType(value)}
					style={{ width: 200, marginRight: 16, textTransform: "capitalize" }}
					allowClear
				>
					{roomTypes.map((roomType) => (
						<Option key={roomType} value={roomType}>
							{roomType}
						</Option>
					))}
				</Select>
				<Button
					danger
					className='mx-3'
					onClick={() => setShowDanger(!showDanger)}
					style={{ fontSize: "1rem", fontWeight: "bold" }}
				>
					{chosenLanguage === "Arabic" ? (
						<>{showDanger ? "عرض الكل" : "في خطر"}</>
					) : (
						<>{showDanger ? "Show All" : "Danger"}</>
					)}
				</Button>
			</FiltersWrapper>
			<Table
				dataSource={filteredData}
				columns={columns}
				rowKey='id'
				scroll={{ y: 800 }}
				pagination={false}
				sticky
			/>
		</RoomStockReportWrapper>
	);
};

const RoomStockReportWrapper = styled.div`
	max-height: 1000px;
	overflow: auto;
`;

const FiltersWrapper = styled.div`
	margin-bottom: 16px;
`;
