const csvWriter = require('csv-writer');

/**
 * <p>convert object into csv file and save in local system
 * @param {Object} content 
 */
let convertToCSV = (content, headers, fileName) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const csv = csvWriter.createObjectCsvWriter({
      path: `${fileName}-${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.csv`,
      header: headers
  });
  csv.writeRecords(content).then(
      ()=> console.log('The CSV file was written successfully'));
}

module.exports = {
  convertToCSV
}