import React, { useState } from "react";
import { Table, Button, Modal, Select, notification } from "antd";
import { updatingHouseKeepingTask } from "../HotelModule/apiAdmin";

const HouseKeepingEmployeeTable = ({ employeeWork, chosenLanguage }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState("");

	const showModal = (record) => {
		setSelectedTask(record);
		setSelectedStatus(record.task_status);
		setIsModalVisible(true);
	};

	const handleOk = () => {
		updatingHouseKeepingTask(selectedTask._id, { task_status: selectedStatus })
			.then((response) => {
				if (response.error) {
					notification.error({
						message: "Update Failed",
						description: response.error,
					});
				} else {
					notification.success({
						message: "Update Successful",
						description: "The task status has been updated.",
					});
					setTimeout(() => {
						window.location.reload(false);
					}, 1500);
					setIsModalVisible(false);
					// Refresh the data or update the state to reflect the changes
				}
			})
			.catch((err) => {
				notification.error({
					message: "Update Failed",
					description: "An error occurred while updating the task.",
				});
			});
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const columns = [
		{
			title: chosenLanguage === "Arabic" ? "الطابق" : "Floor",
			dataIndex: "floor",
			key: "floor",
			render: (text, record) => record.rooms[0]?.floor,
		},
		{
			title: chosenLanguage === "Arabic" ? "رقم الغرفة" : "Room Number",
			dataIndex: "room_number",
			key: "room_number",
			render: (text, record) =>
				record.rooms.map((room) => room.room_number).join(", "),
		},
		{
			title: chosenLanguage === "Arabic" ? "الحالة" : "Status",
			dataIndex: "task_status",
			key: "task_status",
		},
		{
			title: chosenLanguage === "Arabic" ? "تحرير" : "Edit",
			key: "edit",
			render: (text, record) => (
				<Button onClick={() => showModal(record)}>
					{chosenLanguage === "Arabic" ? "تحرير" : "Edit"}
				</Button>
			),
		},
	];

	return (
		<>
			<Table
				columns={columns}
				dataSource={employeeWork}
				rowKey='_id'
				pagination={false}
			/>
			<Modal
				title={chosenLanguage === "Arabic" ? "تحديث الحالة" : "Update Status"}
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Select
					value={selectedStatus}
					onChange={setSelectedStatus}
					style={{ width: "100%" }}
				>
					<Select.Option value='unfinished'>
						{chosenLanguage === "Arabic" ? "غير منتهية" : "Unfinished"}
					</Select.Option>
					<Select.Option value='finished'>
						{chosenLanguage === "Arabic" ? "منتهية" : "Finished"}
					</Select.Option>
				</Select>
			</Modal>
		</>
	);
};

export default HouseKeepingEmployeeTable;
