import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { message } from "antd";
import { isAuthenticated } from "../../auth";
import { cloudinaryUpload1 } from "../apiAdmin";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import imageImage from "../../GeneralImages/UploadImageImage.jpg";

const ImageCardMain = ({ hotelPhotos, setHotelDetails }) => {
	const { user, token } = isAuthenticated();
	const [photos, setPhotos] = useState(hotelPhotos);

	useEffect(() => {
		// Ensure photos are in sync with hotelPhotos prop
		setPhotos(hotelPhotos);
	}, [hotelPhotos]);

	const fileUploadAndResizeThumbNail = (e) => {
		let files = e.target.files;
		let validFiles = [];
		let invalidFileIndexes = [];

		Array.from(files).forEach((file, index) => {
			if (file.size <= 1500000) {
				validFiles.push(file);
			} else {
				invalidFileIndexes.push(index + 1);
			}
		});

		if (invalidFileIndexes.length) {
			message.error(
				`Image(s) at position ${invalidFileIndexes.join(
					", "
				)} are more than 1.5 MB. Please try another image.`
			);
		}

		if (validFiles.length) {
			const uploadPromises = validFiles.map((file) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);

				return new Promise((resolve, reject) => {
					reader.onload = () => {
						const base64EncodedImage = reader.result;
						cloudinaryUpload1(user._id, token, { image: base64EncodedImage })
							.then(resolve)
							.catch(reject);
					};
					reader.onerror = (error) => reject(error);
				});
			});

			Promise.all(uploadPromises).then((results) => {
				const newPhotos = results.map((data) => ({
					public_id: data.public_id,
					url: data.url,
				}));

				const updatedPhotos = [...photos, ...newPhotos];
				setPhotos(updatedPhotos);

				setHotelDetails((prevDetails) => ({
					...prevDetails,
					hotelPhotos: updatedPhotos,
				}));
			});
		}
	};

	const handleImageRemove = (public_id) => {
		axios
			.post(
				`${process.env.REACT_APP_API_URL}/admin/removeimage/${user._id}`,
				{ public_id },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			.then((res) => {
				if (res.data) {
					const updatedPhotos = photos.filter(
						(photo) => photo.public_id !== public_id
					);
					setPhotos(updatedPhotos);

					setHotelDetails((prevDetails) => ({
						...prevDetails,
						hotelPhotos: updatedPhotos,
					}));
				}
			})
			.catch((err) => {
				console.error("Error removing image:", err);
			});
	};

	const handleOnDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(photos);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setPhotos(items);
		setHotelDetails((prevDetails) => ({
			...prevDetails,
			hotelPhotos: items,
		}));
	};

	return (
		<ImageCardWrapper dir='ltr'>
			<div className='card card-flush py-4 mx-auto text-center'>
				<div className='card-body text-center pt-0'>
					<div className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'>
						<DragDropContext onDragEnd={handleOnDragEnd}>
							<Droppable droppableId='photos' direction='horizontal'>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										style={{
											display: "flex",
											justifyContent: "center",
											overflow: "auto",
										}}
									>
										{photos.map((image, index) => (
											<Draggable
												key={image.public_id}
												draggableId={image.public_id}
												index={index}
											>
												{(provided) => (
													<ImageContainer
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<CloseButton
															onClick={() => handleImageRemove(image.public_id)}
															aria-label='Close'
														>
															&times;
														</CloseButton>
														<img
															src={image.url}
															alt='Room'
															style={{
																width: "150px",
																height: "150px",
																boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
															}}
														/>
													</ImageContainer>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
					<div>
						<label style={{ cursor: "pointer", fontSize: "0.95rem" }}>
							<img
								src={imageImage}
								alt='imageUpload'
								style={{ width: "200px", height: "200px" }}
							/>
							<input
								type='file'
								multiple
								hidden
								accept='images/*'
								onChange={fileUploadAndResizeThumbNail}
								required
							/>
						</label>
					</div>
					<div className='text-muted fs-7'>
						Width: 800px, Height: 954px;
						<br />
						Set the General Hotel Photos. Only *.png, *.jpg and *.jpeg image
						files are accepted
					</div>
				</div>
			</div>
		</ImageCardWrapper>
	);
};

export default ImageCardMain;

const ImageCardWrapper = styled.div`
	margin: auto;

	.card {
		border: 1px white solid !important;
		max-width: 90%;
		margin: auto;
	}
`;

const ImageContainer = styled.div`
	position: relative;
	display: inline-block;
	margin: 5px;
`;

const CloseButton = styled.button`
	position: absolute;
	top: -10px;
	right: 0px;
	background-color: black;
	color: white;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	font-size: 20px;
	line-height: 20px;
	padding: 5px;
`;
