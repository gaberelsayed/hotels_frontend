/** @format */

import React from "react";
import styled from "styled-components";
import { Modal } from "antd";

const ZSuccessfulUpdate = ({
	modalVisible,
	setModalVisible,
	setStep,
	setSelectedRoomType,
	setRoomTypeSelected,
}) => {
	const urlParams = new URLSearchParams(window.location.search);
	const roomCount = urlParams.has("roomcount");

	return (
		<ZSuccessfulUpdateWrapper>
			<Modal
				width='70%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}
					>{`Settings successfully updated...`}</div>
				}
				open={modalVisible}
				onOk={() => {
					setStep(1);
					setSelectedRoomType("");
					setRoomTypeSelected(false);
					setModalVisible(false);
				}}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible(false);
				}}
			>
				<div className='container'>
					<h3>
						{roomCount
							? "Would you like to update another room?"
							: "Would you like to add other room types?"}
					</h3>
				</div>
			</Modal>
		</ZSuccessfulUpdateWrapper>
	);
};

export default ZSuccessfulUpdate;

const ZSuccessfulUpdateWrapper = styled.div``;
