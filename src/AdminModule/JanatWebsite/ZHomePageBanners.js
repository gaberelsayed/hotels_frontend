import React, { useState } from "react";
import styled from "styled-components";
import { cloudinaryUpload1 } from "../apiAdmin";
import axios from "axios";
import ImageCardHomeMainBanner from "./ImageCardHomeMainBanner";
import Resizer from "react-image-file-resizer";
import { isAuthenticated } from "../../auth";

const ZHomePageBanners = ({ addThumbnail, setAddThumbnail }) => {
	// eslint-disable-next-line
	const [loading, setLoading] = useState(false);
	const { user, token } = isAuthenticated();

	const fileUploadAndResizeThumbNail = (e) => {
		// console.log(e.target.files);
		let files = e.target.files;
		let allUploadedFiles = addThumbnail;
		if (files) {
			for (let i = 0; i < files.length; i++) {
				Resizer.imageFileResizer(
					files[i],
					1920,
					997,
					"jpeg",
					100,
					0,
					(uri) => {
						cloudinaryUpload1(user._id, token, { image: uri })
							.then((data) => {
								allUploadedFiles.push(data);

								setAddThumbnail({ ...addThumbnail, images: allUploadedFiles });
							})
							.catch((err) => {
								console.log("CLOUDINARY UPLOAD ERR", err);
							});
					},
					"base64"
				);
			}
		}
	};

	const FileUploadThumbnail = () => {
		return (
			<>
				<ImageCardHomeMainBanner
					uploadFrom='BasicProduct'
					addThumbnail={addThumbnail}
					handleImageRemove={handleImageRemove}
					setAddThumbnail={setAddThumbnail}
					fileUploadAndResizeThumbNail={fileUploadAndResizeThumbNail}
				/>
			</>
		);
	};

	const handleImageRemove = (public_id) => {
		setLoading(true);
		// console.log("remove image", public_id);
		axios
			.post(
				`${process.env.REACT_APP_API_URL}/admin/removeimage/${user._id}`,
				{ public_id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((res) => {
				// eslint-disable-next-line
				const { images } = addThumbnail;
				let filteredImages = images.filter((item) => {
					return item.public_id !== public_id;
				});
				if (addThumbnail.images.length === 1) {
					setAddThumbnail([]);
				} else {
					setAddThumbnail({ ...addThumbnail, images: filteredImages });
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				// setTimeout(function () {
				// 	window.location.reload(false);
				// }, 1000);
			});
	};

	return (
		<ZHomePageBannersWrapper>
			<div className='container mt-3'>
				<h3
					style={{ color: "#009ef7", fontWeight: "bold" }}
					className='mt-1 mb-3 text-center'
				>
					Home Page Main Banners
				</h3>
				{FileUploadThumbnail()}
			</div>
		</ZHomePageBannersWrapper>
	);
};

export default ZHomePageBanners;

const ZHomePageBannersWrapper = styled.div`
	.container {
		border: 2px solid lightgrey;
		border-radius: 20px;
		background: white;
	}

	@media (max-width: 1750px) {
		background: white;
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
