const fs = require('fs');
let { convertToCSV } = require('./csvUtil');
let { get } = require('./httpService');
const { LOCATIONIQ_TOKEN } = require('./appConfig');

const inputFile = process.argv[2] ? process.argv[2] : "";
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
  fs.readFile(inputFile, 'utf8', async (err, data) => {
      console.log(data);
      const queries = data.split('\n');
      let scraperContent = [];
      let result, lat,lon, addr;
      for(let i =0; i<queries.length; i++) {
        let search = queries[i];
        if(search && search.trim()) {
          search = search.replace(/"/g, "");
          console.log("ADDRESS=>", search);
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
  });
}

 