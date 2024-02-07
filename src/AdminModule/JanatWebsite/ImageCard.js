import React from "react";
import styled from "styled-components";
import imageImage from "../../GeneralImages/UploadImageImage.jpg";

const ImageCard = ({
	setAddThumbnail,
	handleImageRemove,
	addThumbnail,
	fileUploadAndResizeThumbNail,
}) => {
	return (
		<ImageCardWrapper>
			<div className='card card-flush py-4'>
				<div className='card-body text-center pt-0'>
					<div
						className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
						data-kt-image-input='true'
					>
						<div className='image-input-wrapper w-180px h-180px'></div>
						<div className='col-12'>
							{addThumbnail &&
								addThumbnail.images &&
								addThumbnail.images.map((image) => {
									return (
										<div className='image-container m-3 col-6'>
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
												className='thumbnail-image'
												key={image.public_id}
											/>
										</div>
									);
								})}
						</div>
						{!addThumbnail.images ? (
							<label
								className=''
								style={{ cursor: "pointer", fontSize: "0.95rem" }}
							>
								<img
									src={imageImage}
									alt='imageUpload'
									style={{ width: "75%" }}
								/>
								<input
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
						Width: 222px, Height: 46px;
						<br />
						Set the logo thumbnail image. Only *.png, *.jpg and *.jpeg image
						files are accepted
					</div>
				</div>
			</div>
		</ImageCardWrapper>
	);
};

export default ImageCard;

const ImageCardWrapper = styled.div`
	.card {
		border: 1px #f6f6f6 solid !important;
	}

	.image-container {
		position: relative;
		display: inline-block; // To keep images in line
	}

	.thumbnail-image {
		width: 130px;
		height: 130px;
		box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
	}

	.close {
		position: absolute;
		top: -20px;
		right: 36%;
		color: white;
		background: black;
		font-size: 20px;
		border: none; // Remove border if any
		cursor: pointer; // To indicate this is clickable
	}
`;
