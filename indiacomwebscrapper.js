var rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const csvWriter = require("csv-writer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getHtml(domain) {
  let { stdout } = await exec(`curl ${domain}`);
  return stdout;
}
const dentalHos = [];
async function parseBody(html) {
  const $ = cheerio.load(html);
  $(".b_listing:not(.b_prevnext)").each(function (idx, ht) {
    dentalHos.push({
      name: $(this).find(".b_name").text().trim(),
      location: $(this).find(".b_address").text().trim(),
    });
  });
  let next = $(".b_listing.b_prevnext a:nth-child(2)");
  if (!next.length) {
    if ("Next" === $($(".b_listing.b_prevnext a")[0]).text().trim()) {
      console.log("Only One");
      next = $(".b_listing.b_prevnext a");
    }
  }
  if (next.length) {
    next = next[0];
    let nxtUrl = $(next).attr("href");
    console.log(JSON.stringify(dentalHos));
    console.log(`NEXT URL  =====${nxtUrl}`);
    indiacom("https://www.indiacom.com" + nxtUrl);
  } else {
    convertToCSV(dentalHos);
    console.log("===========+++SCRAPPER END++++++==========");
  }
}

async function indiacom(
  url = "https://www.indiacom.com/yellow-pages/diagnostic-centre/"
) {
  parseBody(await getHtml(url));
}
let convertToCSV = (content) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const csv = csvWriter.createObjectCsvWriter({
    path: `indacom-output-${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.csv`,
    header: [
      { id: "name", title: "Name" },
      { id: "location", title: "Location" },
    ],
  });
  csv
    .writeRecords(content)
    .then(() => console.log("The CSV file was written successfully"));
};

async function scrapper() {
  await indiacom();
  //convertToCSV(dentalHos);
  //console.log("===========+++SCRAPPER END++++++==========");
}

scrapper();
