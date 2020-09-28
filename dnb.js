var rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const csvWriter = require("csv-writer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const dentalHos = [];
async function parseBody(html) {
  const $ = cheerio.load(html);
  $("#companyResults .data").each((index, data) => {
    //console.log($(data).children().eq(1).text());
    dentalHos.push({
      name: $(data).children().eq(0).text().trim(),
      location: $(data)
        .children()
        .eq(1)
        .text()
        .replace(/Country:/gi, "")
        .trim(),
      revenue: $(data)
        .children()
        .eq(2)
        .text()
        .replace("Sales Revenue ($M):", "")
        .trim(),
      dnbUrl: $(data).children().eq(0).find("a")
        ? $(data).children().eq(0).find("a")[0].attribs.href
        : "",
      location: $(".breadcrumb ol li:last-child").text().trim(),
    });
  });
  let next = $("#pagination .next a");
  console.log(next.length);
  if ($("#locationResults .data a").length) {
    $("#locationResults .data a").each((index, data) => {
      console.log(`NEXT URL  =====${data.href}`);
      $(".breadcrumb ol li:last-child").text().trim();
      scrapper(data.href);
    });
  } else {
    if (next.length) {
      next = next[0];
      let nxtUrl = $(next).attr("href");
      // console.log(JSON.stringify(dentalHos));
      console.log(`NEXT URL  =====${nxtUrl}`);
      scrapper(nxtUrl);
    }
  }
  //convertToCSV(dentalHos);
  console.log("===========+++SCRAPPER END++++++==========");
}

let convertToCSV = (content) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const csv = csvWriter.createObjectCsvWriter({
    path: `dnb-${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.csv`,
    header: [
      { id: "name", title: "Name" },
      { id: "location", title: "Location" },
      { id: "revenue", title: "Revenue" },
      { id: "dnbUrl", title: "DNB Url" },
      { id: "location", title: "Location" },
    ],
  });
  csv
    .writeRecords(content)
    .then(() => console.log("The CSV file was written successfully"));
};

//scrapper();

const puppeteer = require("puppeteer");
function scrapper(url) {
  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
      !url
        ? "https://www.dnb.com/business-directory/company-information.computer-software.us.html?page=1"
        : url,
      {
        waitUntil: "load",
        // Remove the timeout
        timeout: 0,
      }
    );
    const data = await page.evaluate(
      () => document.querySelector("*").outerHTML
    );
    await parseBody(data);
    await browser.close();
  })();
}
scrapper();
