// Function to process data and extract individual shifts
const reBodyData = (data) => {
	const reKey = /(?<=Credit.+Port.+Code).*?(?=Available Date\/Time this|PLN Total Credit Hours)/;
	const templist = [];
	for (const x in data) {
		const re = JSON.stringify(data[x].text).match(reKey);
		templist.push({ captured: re[0], Individual: captureIndividualShifts(re[0]) });
	}
	return templist;
};

// Function to capture individual shifts
const captureIndividualShifts = (data) => {
	return parseDutys(data);
};

// Exporting functions
module.exports = { reBodyData, captureIndividualShifts };

// Function to parse duty data
const parseDutys = (rawRosterData) => {
	const data = { isRostered: [], isNotRostered: [] };

	while (rawRosterData) {
		// Matching isNotRostered duty pattern
		if (rawRosterData.match(keys.isNotRostered)) {
			const currentDuty = rawRosterData.match(keys.isNotRostered);
			rawRosterData = rawRosterData.replace(currentDuty[0], "");

			const date = currentDuty[1].split("/");
			const organisedDuty = { date: { day: date[0], month: date[1] }, role: currentDuty[2], code: currentDuty[3], full: currentDuty[0] };

			data.isNotRostered.push(organisedDuty);
		}
		// Matching isRostered main duty pattern
		else if (rawRosterData.match(keys.isRostered.main)) {
			const currentDuty = rawRosterData.match(keys.isRostered.main);
			rawRosterData = rawRosterData.replace(currentDuty[0], "");

			const date = currentDuty[1].split("/");
			const organisedDuty = { date: { day: date[0], month: date[1] }, role: currentDuty[2], code: currentDuty[3], times: { son: currentDuty[6], soff: currentDuty[7], duty: currentDuty[8] }, full: currentDuty[0] };

			data.isRostered.push(organisedDuty);
		}
		// Matching isRostered overnight duty pattern
		else if (rawRosterData.match(keys.isRostered.isOvernight)) {
			const currentDuty = rawRosterData.match(keys.isRostered.isOvernight);
			rawRosterData = rawRosterData.replace(currentDuty[0], "");

			const date = currentDuty[1].split("/");
			const organisedDuty = { date: { day: date[0], month: date[1] }, role: currentDuty[2], code: currentDuty[3], times: { son: currentDuty[5], soff: currentDuty[6], duty: currentDuty[7] }, full: currentDuty[0] };

			data.isRostered.push(organisedDuty);
		}
		// Matching isRostered HRA span duty pattern
		else if (rawRosterData.match(keys.isRostered.hra_span)) {
			const currentDuty = rawRosterData.match(keys.isRostered.hra_span);
			rawRosterData = rawRosterData.replace(currentDuty[0], "");

			const date = currentDuty[1].split("/");
			const organisedDuty = { date: { day: date[0], month: date[1] }, role: currentDuty[2], code: currentDuty[3], times: { son: currentDuty[4], soff: currentDuty[5], duty: currentDuty[6] }, full: currentDuty[0] };

			data.isRostered.push(organisedDuty);
		}
		// No matching duty pattern found
		else {
			console.log(rawRosterData);
			return { data, rawRosterData };
		}
	}
	console.log(data);
	return { data, rawRosterData };
};

// Regular expression patterns for duty matching
const keys = {
	isNotRostered: /\s*(\d+\/\d+)\s+(\w{3})\s+(LSC|NON AV)\s+(LS|PLN|ASN)/,
	isRostered: {
		main: /\s*(\d+\/\d+)\s+(\w{3})\s+([A-Z0-9]{4,6})+\s+((\w{1,5}\/*)*)\s+(\d{4})\s+(\d{4})\s+(\d{1,2}:\d{1,2})\s+(\w{3})*\s+(\w*)\s+(\w{2,6})\s+(\d{1,2}:\d{1,2})/,
		hra_span: /\s*(\d+\/\d+)\s+(\w{3})\s+(HRA SPAN)\s+((\d{4})\s+(\d{4}))\s+(\d{1,2}:\d{1,2})\s+(\w{3})*\s+(\w*)\s+(\w{2,6})\s+(\d{1,2}:\d{1,2})/,
		isOvernight: /\s*(\d+\/\d+)\s+(\w{3})\s+((\w{1,5}\/*)*)\s+(\d{4})\s+(\d{4})\s+(\d{1,2}:\d{1,2})\s+(\w{3})*\s+(\w*)\s+(\d{1,2}:\d{1,2})/,
	},
};
