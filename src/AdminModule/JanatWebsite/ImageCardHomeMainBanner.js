import React from "react";
import styled from "styled-components";
import imageImage from "../../GeneralImages/UploadImageImage.jpg";

const ImageCardHomeMainBanner = ({
	setAddThumbnail,
	handleImageRemove,
	addThumbnail,
	fileUploadAndResizeThumbNail,
}) => {
	return (
		<ImageCardHomeMainBannerWrapper>
			<div className='card card-flush py-4'>
				<div className='card-body text-center pt-0'>
					<div
						className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
						data-kt-image-input='true'
					>
						<div className='image-input-wrapper'></div>
						<div className='image-gallery'>
							{addThumbnail &&
								addThumbnail.images &&
								addThumbnail.images.map((image) => (
									<div className='image-container' key={image.public_id}>
										<button
											type='button'
											className='close'
											onClick={() => {
												handleImageRemove(image.public_id);
												setAddThumbnail([]);
											}}
											aria-label='Close'
										>
											<span aria-hidden='true'>&times;</span>
										</button>
										<img
											src={image.url}
											alt='Img Not Found'
											className='uploaded-image'
										/>
									</div>
								))}
						</div>
						{!addThumbnail.images || addThumbnail.images.length === 0 ? (
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
						) : null}
					</div>
					<div className='text-muted fs-7'>
						Width: 1920px, Height: 997px;
						<br />
						Set the banners image. Only *.png, *.jpg and *.jpeg image files are
						accepted
					</div>
				</div>
			</div>
		</ImageCardHomeMainBannerWrapper>
	);
};

export default ImageCardHomeMainBanner;

const ImageCardHomeMainBannerWrapper = styled.div`
	.card {
		border: 1px white solid !important;
	}

	.image-gallery {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		justify-content: flex-start;
	}

	.image-container {
		position: relative;
		width: 150px;
		height: 150px;
	}

	.uploaded-image {
		width: 100%;
		height: 100%;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
	}

	.close {
		position: absolute;
		top: -10px; /* Adjusted to put the button on the edge */
		right: -10px; /* Adjusted to put the button on the edge */
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
	}

	.placeholder-image {
		width: 200px;
		height: 200px;
	}
`;
