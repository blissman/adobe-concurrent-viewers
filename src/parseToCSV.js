window.parseData = (data) => {
	const report = data.report;
	let returnValue = "";
	returnValue += "type," + report.type + "\n";
	returnValue += "elements," + report.elements[0].name + "\n";
	return returnValue;
};