import React, { useState } from "react";
import styled from "styled-components";
import { cloudinaryUpload1 } from "../apiAdmin";
import axios from "axios";
import ImageCardHomeMainBanner from "./ImageCardHomeMainBanner";
import Resizer from "react-image-file-resizer";
import { isAuthenticated } from "../../auth";

const ZHomePageBanners = ({ addThumbnail, setAddThumbnail }) => {
	const { user, token } = isAuthenticated();
	// eslint-disable-next-line
	const [loading, setLoading] = useState(false);

	const fileUploadAndResizeThumbNail = (e) => {
		let files = e.target.files;
		let allUploadedFiles = addThumbnail.images ? [...addThumbnail.images] : [];

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
								allUploadedFiles.push({
									...data,
									title: "",
									titleArabic: "",
									subTitle: "",
									subtitleArabic: "",
									buttonTitle: "",
									buttonTitleArabic: "",
									pageRedirectURL: "",
									btnBackgroundColor: "",
								});
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

	const handleFieldChange = (index, field, value) => {
		let updatedImages = [...addThumbnail.images];
		updatedImages[index][field] = value;
		setAddThumbnail({ ...addThumbnail, images: updatedImages });
	};

	const handleImageRemove = (public_id) => {
		setLoading(true);
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
				let filteredImages = addThumbnail.images.filter(
					(item) => item.public_id !== public_id
				);
				setAddThumbnail({ ...addThumbnail, images: filteredImages });
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<ZHomePageBannersWrapper>
			<div className='container mt-3'>
				<h3
					className='mt-1 mb-3 text-center'
					style={{ color: "#009ef7", fontWeight: "bold" }}
				>
					Home Page Main Banners
				</h3>
				<ImageCardHomeMainBanner
					uploadFrom='BasicProduct'
					addThumbnail={addThumbnail}
					handleImageRemove={handleImageRemove}
					setAddThumbnail={setAddThumbnail}
					fileUploadAndResizeThumbNail={fileUploadAndResizeThumbNail}
					handleFieldChange={handleFieldChange}
				/>
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
		padding: 10px;
		margin-top: 10px;
	}
`;
