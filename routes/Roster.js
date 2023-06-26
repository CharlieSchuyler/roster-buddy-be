const express = require("express");
const router = express.Router();

const fs = require("fs");
const pdfjsLib = require("pdfjs-dist");

// module imports
const reScripts = require("../scripts/regularExpressions");

// Set the workerSrc property before using any PDF.js functionality
pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";

let pdfPath = "./uploads/Roster_664150_23Feb23_1719.pdf";

router.get("/read", async (req, res, next) => {
	try {
		const text = await performTextSelection();
		res.send(text);
	} catch (error) {
		console.error("Error reading PDF:", error);
		res.status(500).send("Error reading PDF");
	}
});

async function performTextSelection() {
	const loadingTask = pdfjsLib.getDocument(pdfPath);
	const pdf = await loadingTask.promise;
	const data = [];
	try {
		// Load the PDF document
		const loadingTask = pdfjsLib.getDocument(pdfPath);
		const pdfDocument = await loadingTask.promise;

		// Iterate over each page of the PDF
		for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
			const page = await pdfDocument.getPage(pageNumber);

			// Extract text content from the page
			const textContent = await page.getTextContent();
			const textItems = textContent.items;

			// Concatenate the text items to form the complete page text
			const pageText = textItems.map((item) => item.str).join(" ");

			data.push({ pageNumber: pageNumber, text: pageText });
		}
		return reScripts.reBodyData(data);
	} catch (error) {
		console.error("Error reading PDF:", error);
		throw error;
	}
}

// (\d{2}\/\d{2})\s+([A-Za-z]{3})\s+((?:HRA SPAN|NON AV|LSC|(?:\d{4}(?:A\d{1,2})?))\s?)+\s+(\b(\d{1,4}[A-Za-z]?)(?:\/(\d{1,4}[A-Za-z]?))*\b|)+\s+(PLN|(\d{4})+\s+(\d{4})+\s+(\d{1,2}:\d{2})+\s+()?)

// ! revision of regex  --- HRA SPAN = no service but sign on/off time --- NON AV = no service
module.exports = router;
