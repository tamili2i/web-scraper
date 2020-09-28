const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const csvWriter = require("csv-writer");

const origin = "https://www.dnb.com";
const dentalHos = [];
async function scrapper(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    !url
      ? "https://www.dnb.com/business-directory/company-information.computer-software.us.html?page=1"
      : url,
    {
      waitUntil: "domcontentloaded",
      // Remove the timeout
      timeout: 0,
    }
  );
  const data = await page.evaluate(() => document.querySelector("*").outerHTML);
  await browser.close();
  await parseBody(data);
}

async function parseBody(html) {
  const $ = cheerio.load(html);
  let locationResults = $("#locationResults .data a");
  if (locationResults.length) {
    for (let i = 0; i < locationResults.length; i++) {
      console.log(
        `Location URL NEXT URL  =====${locationResults[i].attribs.href}`
      );
      nextUrl = locationResults[i].attribs.href;
      console.log($(".breadcrumb ol li:last-child").text().trim());
      await scrapper(origin + nextUrl);
    }
  } else {
    console.log(
      "Getting data in " + $(".breadcrumb ol li:last-child").text().trim()
    );
    let next = $("#pagination .next a");
    $("#companyResults .data").each((index, data) => {
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
        city: $(".breadcrumb ol li:last-child").text().trim(),
      });
    });
    if (next.length) {
      next = next[0];
      let nxtUrl = $(next).attr("href");
      // console.log(JSON.stringify(dentalHos));
      console.log(`NEXT PAge URL  =====${nxtUrl}`);
      await scrapper(nxtUrl);
    }
  }
  //convertToCSV(dentalHos);
  console.log("===========+++SCRAPPER END++++++==========");
}

scrapper(
  "https://www.dnb.com/business-directory/company-information.computer-software.us.html"
).then(() => {
  console.log("CSV");
  convertToCSV(dentalHos);
});

let convertToCSV = (content) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const csv = csvWriter.createObjectCsvWriter({
    path: `./dnb/dnb-software-companies-location-${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.csv`,
    header: [
      { id: "name", title: "Name" },
      { id: "location", title: "Location" },
      { id: "revenue", title: "Revenue" },
      { id: "dnbUrl", title: "DNB Url" },
      { id: "city", title: "City" },
    ],
  });
  csv
    .writeRecords(content)
    .then(() => console.log("The CSV file was written successfully"));
};
