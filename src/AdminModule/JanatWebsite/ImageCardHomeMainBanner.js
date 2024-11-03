import React from "react";
import styled from "styled-components";
import imageImage from "../../GeneralImages/UploadImageImage.jpg";

const ImageCardHomeMainBanner = ({
	setAddThumbnail,
	handleImageRemove,
	addThumbnail,
	fileUploadAndResizeThumbNail,
	handleFieldChange,
}) => {
	return (
		<ImageCardHomeMainBannerWrapper>
			<div className='card card-flush py-4'>
				<div className='card-body text-center pt-0'>
					<div className='image-input mb-3' data-kt-image-input='true'>
						<div className='image-gallery'>
							{addThumbnail &&
								addThumbnail.images &&
								addThumbnail.images.map((image, index) => (
									<div className='image-container' key={image.public_id}>
										<button
											type='button'
											className='close'
											onClick={() => handleImageRemove(image.public_id)}
											aria-label='Close'
										>
											<span aria-hidden='true'>&times;</span>
										</button>
										<img
											src={image.url}
											alt='Img Not Found'
											className='uploaded-image'
										/>
										<div className='input-fields'>
											<input
												type='text'
												placeholder='Title'
												value={image.title || ""}
												onChange={(e) =>
													handleFieldChange(index, "title", e.target.value)
												}
											/>
											<input
												type='text'
												placeholder='Title Arabic'
												value={image.titleArabic || ""}
												onChange={(e) =>
													handleFieldChange(
														index,
														"titleArabic",
														e.target.value
													)
												}
											/>
											<input
												type='text'
												placeholder='Subtitle'
												value={image.subTitle || ""}
												onChange={(e) =>
													handleFieldChange(index, "subTitle", e.target.value)
												}
											/>
											<input
												type='text'
												placeholder='Subtitle Arabic'
												value={image.subtitleArabic || ""}
												onChange={(e) =>
													handleFieldChange(
														index,
														"subtitleArabic",
														e.target.value
													)
												}
											/>
											<input
												type='text'
												placeholder='Button Title'
												value={image.buttonTitle || ""}
												onChange={(e) =>
													handleFieldChange(
														index,
														"buttonTitle",
														e.target.value
													)
												}
											/>
											<input
												type='text'
												placeholder='Button Title Arabic'
												value={image.buttonTitleArabic || ""}
												onChange={(e) =>
													handleFieldChange(
														index,
														"buttonTitleArabic",
														e.target.value
													)
												}
											/>
											<input
												type='text'
												placeholder='Page Redirect URL'
												value={image.pageRedirectURL || ""}
												onChange={(e) =>
													handleFieldChange(
														index,
														"pageRedirectURL",
														e.target.value
													)
												}
											/>
											<input
												type='text'
												placeholder='Button Background Color'
												value={image.btnBackgroundColor || ""}
												onChange={(e) =>
													handleFieldChange(
														index,
														"btnBackgroundColor",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								))}
						</div>
						<label className='upload-label'>
							<img
								src={imageImage}
								alt='imageUpload'
								className='placeholder-image'
							/>
							<input
								multiple
								type='file'
								hidden
								accept='images/*'
								onChange={fileUploadAndResizeThumbNail}
								required
							/>
						</label>
					</div>
					<div className='text-muted fs-7'>
						Width: 1920px, Height: 997px;
						<br />
						Set the banners image. Only *.png, *.jpg, and *.jpeg image files are
						accepted.
					</div>
				</div>
			</div>
		</ImageCardHomeMainBannerWrapper>
	);
};

export default ImageCardHomeMainBanner;

const ImageCardHomeMainBannerWrapper = styled.div`
	.card {
		border: 1px solid white !important;
	}

	.image-gallery {
		display: flex;
		flex-wrap: wrap;
		gap: 20px; /* Adjusted to add space between cards */
		justify-content: flex-start;
	}

	.image-container {
		position: relative;
		width: 200px; /* Increased width for input fields */
	}

	.uploaded-image {
		width: 100%;
		height: 150px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
		object-fit: cover; /* Ensures image is contained within the box */
	}

	.input-fields {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.input-fields input {
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
		width: 100%;
	}

	.close {
		position: absolute;
		top: -10px;
		right: -10px;
		color: white;
		background: black;
		font-size: 20px;
		border: none;
		cursor: pointer;
		padding: 0;
		border-radius: 50%;
	}

	.upload-label {
		cursor: pointer;
		font-size: 0.95rem;
		margin-top: 10px; /* Added space at the top */
		width: 200px; /* Ensures consistency with image width */
		align-self: center;
	}

	.placeholder-image {
		width: 100%;
		height: 150px;
	}
`;
