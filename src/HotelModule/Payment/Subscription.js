import React from "react";
import styled from "styled-components";
import UpdateCardBeProComp from "./UpdateCardBeProComp";
import SubscriptionDataInfo from "./SubscriptionDataInfo";
import DropIn from "braintree-web-drop-in-react";

const Subscription = ({
	user,
	token,
	updateSubscriptionCard,
	buy_subscribe,
	setUpdateCardClicked,
	updateCardClicked,
	data,
	setData,
	chosenLanguage,
	hotelDetails,
}) => {
	return (
		<SubscriptionWrapper>
			{hotelDetails && user && hotelDetails.subscribed ? (
				<div className='col-md-6 platformShare mt-5'>
					<div>
						<h3>
							THANK YOU!
							<br />
							<br />
							<strong style={{ fontSize: "1.5rem", color: "darkgreen" }}>
								You have already submitted your card, XHOTEL PRO is now
								authorized to get monthly transactions from you
							</strong>
						</h3>
						<br />
						<br />
						<h5>
							{" "}
							<strong
								style={{
									fontSize: "1.3rem",
									textTransform: "uppercase",
									color: "black",
								}}
							>
								Thank you again for your business!
							</strong>{" "}
						</h5>
					</div>
					<div>
						<div>
							<SubscriptionDataInfo
								user={user}
								token={token}
								hotelDetails={hotelDetails}
							/>
						</div>
					</div>
					<div
						className='mt-4'
						style={{
							fontSize: "1.2rem",
							fontWeight: "bolder",
							color: "black",
						}}
					>
						If you would like to update your card,{" "}
						<div
							onClick={() => {
								setUpdateCardClicked(!updateCardClicked);
								if (updateCardClicked === true) {
									window.scrollTo({ top: 100, behavior: "smooth" });
								} else {
									window.scrollTo({ top: 300, behavior: "smooth" });
								}
							}}
							style={{
								fontSize: "1.4rem",
								fontWeight: "bolder",
								color: "darkgoldenrod",
								cursor: "pointer",
							}}
						>
							<strong>PLEASE CLICK HERE....</strong>
						</div>
					</div>
					<div>
						{updateCardClicked ? (
							<UpdateCardBeProComp
								data={data}
								updateUserCard={updateSubscriptionCard}
							/>
						) : null}
					</div>
				</div>
			) : (
				<div className='col-md-10 mx-auto platformShare mt-5'>
					<div onBlur={() => setData({ ...data, error: "" })}>
						{data && data.clientToken ? (
							<div className=' col-md-12'>
								{chosenLanguage === "Arabic" ? (
									<>
										<h3>
											نظام إدارة الممتلكات (X-Hotel PRO PMS) الخاص بنا
											<br />
											<strong style={{ color: "black" }}> $100/ شهرياً</strong>
										</h3>
										<br />
										<ul
											className='mx-auto col-md-8 ulist'
											style={{ fontWeight: "bolder" }}
										>
											<li>
												وحدة الاستقبال
												<ul className='ulist'>
													<li>الحجوزات</li>
													<li>تسجيل الوصول</li>
													<li>تسجيل المغادرة</li>
													<li>تقارير مفصلة</li>
												</ul>
											</li>
											<li>إدارة المخزون</li>
											<li>تجميع جميع الحجوزات من جميع القنوات في مكان واحد</li>
											<li>وحدة خدمة التنظيف</li>
											<li>
												لوحة تحكم المالك التي تتضمن جميع المؤشرات الرئيسية في
												مكان واحد.
											</li>
										</ul>
									</>
								) : (
									<>
										<h3>
											Our PRO PMS (Property Management System) PLAN{" "}
											<strong style={{ color: "black" }}> $100/ Month</strong>{" "}
										</h3>
										<ul
											className='mx-auto col-md-8 ulist'
											style={{ fontWeight: "bolder" }}
										>
											<li>
												Reception Module
												<ul className='ulist'>
													<li>Reservations</li>
													<li>Checkins</li>
													<li>Checkouts</li>

													<li>Great Reporting</li>
												</ul>
											</li>
											<li>Inventory Management</li>
											<li>
												Compiling all reservations across all channels in one
												place
											</li>
											<li>House Keeping Module</li>
											<li>
												Owner Dashboard that includes all KPI's in one place.
											</li>
										</ul>
									</>
								)}

								<DropIn
									options={{
										authorization: data && data.clientToken,
										// paypal: {
										// 	flow: "vault",
										// },
										// googlePay: {
										// 	flow: "vault",
										// },
										// applePay: {
										// 	flow: "vault",
										// },
									}}
									onInstance={(instance) => (data.instance = instance)}
								/>
								<button
									onClick={buy_subscribe}
									className='btn btn-success btn-block my-2 col-md-8 mx-auto'
								>
									Subscribe to our PRO plan
								</button>
							</div>
						) : null}
					</div>
				</div>
			)}
		</SubscriptionWrapper>
	);
};

export default Subscription;

const SubscriptionWrapper = styled.div``;
