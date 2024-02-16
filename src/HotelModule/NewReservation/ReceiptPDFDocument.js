import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const ReceiptPDFDocument = ({ reservation }) => {
	return (
		<Document>
			<Page size='A4'>
				<View>
					<Text style={styles.h3}>Zaer Plaza Hotel</Text>
				</View>
			</Page>
		</Document>
	);
};

export default ReceiptPDFDocument;

const styles = StyleSheet.create({
	page: {
		margin: "10px auto",
		fontFamily: "Arial, Helvetica, sans-serif",
	},
	headerWrapper: {
		backgroundColor: "lightgrey",
		padding: "5px",
		textAlign: "center",
	},
	h3: {
		fontWeight: "bold",
		fontSize: "1.7rem",
		margin: "auto",
	},
	h4: {
		fontWeight: "bold",
		fontSize: "1.5rem",
	},
	status: {
		color: "grey",
	},
	conf: {
		fontSize: "0.9rem",
		fontWeight: "bold",
	},
	secTable: {
		border: "solid 1px black",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: "0.9rem",
	},
	secBorder: {
		border: "solid 1px black",
	},
	secBorder2: {
		border: "solid 1px black",
		padding: "8px",
	},
	thirdTableWrapper: {
		textAlign: "center",
		fontWeight: "bold",
		fontSize: "0.9rem",
	},
	tableHeader: {
		border: "solid 1px black",
	},
	thirdTableWrapper2: {
		textAlign: "center",
		fontSize: "0.85rem",
	},
	tableBody: {
		border: "solid 1px black",
		padding: "10px",
	},
	fourthTableWrapper: {
		border: "solid 1px black",
		textAlign: "center",
		fontWeight: "bold",
		fontSize: "0.9rem",
	},
	fourthTableWrapperTableBody: {
		border: "solid 1px black",
		minHeight: "300px",
	},
	fourthTableWrapperTableBody2: {
		border: "solid 1px black",
	},
	footer: {
		textAlign: "center",
		fontSize: "0.9rem",
		fontWeight: "bold",
	},
});
