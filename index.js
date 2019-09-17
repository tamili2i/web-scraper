var rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const csvWriter = require('csv-writer');

/**
 * <p>Get Title and description from domain name using request and cheerio</p> 
 * @param {String} domain 
 */
async function getTitleOfDomain(domain) {
    let result = {};
    console.log("#=========================#");
    console.log(domain)
    console.log("#=========================#");
    await rp(`http://www.${domain}`).then(body => {
        const $ = cheerio.load(body);
        let title = $('title').text().trim();
        if(!title) {
            title = $("meta[property='og:title']").attr('content');
        }
        if(!title) {
            title = $("meta[property='twitter:title']").attr('content');
        }
        let description = $("meta[name='description']").attr('content') ? $("meta[name='description']").attr('content').trim() : "";
        if(!description) {
            description = $("meta[property='og:description']").attr('content');
        }
        if(!description) {
            description = $("meta[name='twitter:description']").attr('content');
        }
        result = {
            title,
            description,
            domain
        };
    }).catch( error => {
        console.log(`error:- ${error.statusCode} - ${error.statusMessage}`); // Print the error if one occurred
        result = {
            domain
        };
    });
    return result;
}

/**
 * <p>convert object into csv file and save in local system
 * @param {Object} content 
 */
let convertToCSV = content => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const csv = csvWriter.createObjectCsvWriter({
        path: `output-${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}-${date.getHours()}.csv`,
        header: [
          {id: 'domain', title: 'Domain'},
          {id: 'title', title: 'Title'},
          {id: 'description', title: 'Description'}
        ]
    });
    csv.writeRecords(content).then(
        ()=> console.log('The CSV file was written successfully'));
}

const inputFile = process.argv[2] ? process.argv[2] : "";
if(!inputFile) {
    console.error("Enter valid Input File");
} else {
    fs.readFile(inputFile, 'utf8', async (err, data) => {
        console.log(data);
        const domains = data.split('\n');
        let scraperContent = [];
        for(let i =0; i<domains.length; i++) {
            let domain = domains[i];
            if(domain && domain.trim()) {
                scraperContent.push(await getTitleOfDomain(domain.trim()));
            }
        }
        convertToCSV(scraperContent);
    });
}

