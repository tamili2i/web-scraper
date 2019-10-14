const fs = require('fs');
let { convertToCSV, convertCsvToJson } = require('./csvUtil');
let { get } = require('./httpService');
const { LOCATIONIQ_TOKEN } = require('./appConfig');
let header = 'field1';

const inputFile = process.argv[2] ? process.argv[2] : "";
if(process.argv[3]) {
  let headerparam = process.argv[3].split("=")
  header = headerparam.length > 1 ? headerparam[1] : header;
}
let headers = [
  {id: 'address', title: 'Address'},
  {id: 'city', title: 'City'},
  {id: 'county', title: 'County'},
  {id: 'state', title: "State"},
  {id:'country', title: 'Country'},
  {id:'country_code', title: 'Country Code'},
  {id:'postcode', title: "Postal Code"}
];

if(!inputFile) {
  console.error("Enter valid Input File");
} else {
  processCsv();
}

async function processCsv() {
  let queries = await convertCsvToJson(inputFile, header);
  let scraperContent = [], result, lat,lon, addr, search;
  for(let i =0; i<queries.length; i++) {
    search = queries[i][header];
    if(search && search.trim()) {
      search = search.replace(/"|#/g, "");
      result = await get(`https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_TOKEN}&q=${search}&format=json`);
      if(result && result.length) {
        result = result[0];
        console.log(`===================================${search}==========================`);
        ({lat,lon} = result);
        addr = await get(`https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_TOKEN}&lat=${lat}&lon=${lon}&format=json`);
        if(addr) {
          console.log(JSON.stringify(addr.address));
          scraperContent.push({...{ address: search},...addr.address});
        } else {
          scraperContent.push({ address: search});
        }
      } else {
        scraperContent.push({ address: search});  
      }
      console.log(`======================================================================`)
    }
  }
  convertToCSV(scraperContent, headers, 'locationiq');
}