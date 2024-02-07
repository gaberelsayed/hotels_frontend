import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import styled from "styled-components";
import ZLogoAdd from "./ZLogoAdd";
import ZHomePageBanners from "./ZHomePageBanners";
import ZHomePageBanner2 from "./ZHomePageBanner2";
import ZContactusBannerAdd from "./ZContactusBannerAdd";
import ZAboutUsAdd from "./ZAboutUsAdd";
import ZHotelsMainBanner from "./ZHotelsMainBanner";
import { JanatWebsite, getJanatWebsiteRecord } from "../apiAdmin";
import { toast } from "react-toastify";

const JanatWebsiteMain = ({ chosenLanguage }) => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [logo, setLogo] = useState([]);
	const [homeMainBanners, setHomeMainBanners] = useState([]);
	const [homeSecondBanner, setHomeSecondBanner] = useState([]);
	const [contactUsBanner, setContactUsBanner] = useState([]);
	const [aboutUsBanner, setAboutUsBanner] = useState([]);
	const [hotelPageBanner, setHotelPageBanner] = useState([]);
	const [documentId, setDocumentId] = useState(undefined);

	const gettingJanatWebsiteRecord = () => {
		getJanatWebsiteRecord().then((data) => {
			if (data && data.error) {
				console.log(data.error, "data.error");
			} else {
				if (
					data &&
					data[0] &&
					data[0].janatLogo &&
					data[0].homeMainBanners &&
					data[0].homeSecondBanner &&
					data[0].contactUsBanner &&
					data[0].aboutUsBanner &&
					data[0].hotelPageBanner
				)
					setLogo({ images: data && data[0] && [data[0].janatLogo] });
				setHomeMainBanners({
					images: data && data[0] && data[0].homeMainBanners,
				});
				setHomeSecondBanner({
					images: data && data[0] && [data[0].homeSecondBanner],
				});
				setContactUsBanner({
					images: data && data[0] && [data[0].contactUsBanner],
				});
				setAboutUsBanner({
					images: data && data[0] && [data[0].aboutUsBanner],
				});
				setHotelPageBanner({
					images: data && data[0] && [data[0].hotelPageBanner],
				});
				setDocumentId(data && data[0] && data[0]._id);
			}
		});
	};

	useEffect(() => {
		if (window.innerWidth <= 1000) {
			setCollapsed(true);
		}
		gettingJanatWebsiteRecord();
		// eslint-disable-next-line
	}, []);

	const submitDocument = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });

		const myDocument = {
			janatLogo: logo && logo.images[0] && logo.images[0],
			homeMainBanners: homeMainBanners && homeMainBanners.images,
			homeSecondBanner:
				homeSecondBanner &&
				homeSecondBanner.images &&
				homeSecondBanner.images[0],
			contactUsBanner:
				contactUsBanner && contactUsBanner.images && contactUsBanner.images[0],
			aboutUsBanner:
				aboutUsBanner && aboutUsBanner.images && aboutUsBanner.images[0],
			hotelPageBanner:
				hotelPageBanner && hotelPageBanner.images && hotelPageBanner.images[0],
		};

		JanatWebsite(documentId, myDocument).then((data) => {
			if (data && data.error) {
				console.log(data.error, "Error creating a document");
			} else {
				toast.success("Janat Website Was Successfully Updated!");
			}
		});
	};
	return (
		<JanatWebsiteMainWrapper
			dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}
			show={collapsed}
		>
			<div className='grid-container-main'>
				<div className='navcontent'>
					<AdminNavbar
						fromPage='JanatWebsite'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
						chosenLanguage={chosenLanguage}
					/>
				</div>

				<div className='otherContentWrapper'>
					<div className='container-wrapper'>
						<h3 className='mb-3'>Janat Booking Website Edit</h3>
						<div>
							<ZLogoAdd addThumbnail={logo} setAddThumbnail={setLogo} />
						</div>
						<div>
							<ZHomePageBanners
								addThumbnail={homeMainBanners}
								setAddThumbnail={setHomeMainBanners}
							/>
						</div>
						<div>
							<ZHomePageBanner2
								addThumbnail={homeSecondBanner}
								setAddThumbnail={setHomeSecondBanner}
							/>
						</div>
						<div>
							<ZContactusBannerAdd
								addThumbnail={contactUsBanner}
								setAddThumbnail={setContactUsBanner}
							/>
						</div>
						<div>
							<ZAboutUsAdd
								addThumbnail={aboutUsBanner}
								setAddThumbnail={setAboutUsBanner}
							/>
						</div>
						<div>
							<ZHotelsMainBanner
								addThumbnail={hotelPageBanner}
								setAddThumbnail={setHotelPageBanner}
							/>
						</div>

						<div className='mt-4'>
							<button className='btn btn-primary' onClick={submitDocument}>
								Submit...
							</button>
						</div>
					</div>
				</div>
			</div>
		</JanatWebsiteMainWrapper>
	);
};

export default JanatWebsiteMain;

const JanatWebsiteMainWrapper = styled.div`
	overflow-x: hidden;
	/* background: #ededed; */
	margin-top: 20px;
	min-height: 715px;

	.grid-container-main {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "5% 75%" : "17% 75%")};
	}

	.container-wrapper {
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
		background: white;
		margin: 0px 10px;
	}

	h3 {
		font-weight: bold;
		font-size: 1.5rem;
		text-align: center;
		color: #006ad1;
	}

	@media (max-width: 1400px) {
		background: white;
	}
`;
