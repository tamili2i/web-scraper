const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const csvWriter = require("csv-writer");
const { parse } = require("path");

const origin = "https://www.guru.com";
const dentalHos = [];
const urls = [];
async function scrapper(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    !url
      ? "https://www.guru.com/d/freelancers/skill/magento/l/united-states/"
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
  let locationResults = $(".module_list.cozy li");
//   if (locationResults.length) {
//       console.log("HEREEEEEEEE");
//     for (let i = 0; i < locationResults.length; i++) {
//       console.log(
//         `Location URL NEXT URL  =====${locationResults[i].attribs.href}`
//       );
//       let nextUrl = locationResults[i].attribs.href;
//       //console.log($(".breadcrumb ol li:last-child").text().trim());
//       await scrapper(origin + nextUrl);
//     }
//   } else {
    // console.log(
    //   "Getting data in " + $(".breadcrumb ol li:last-child").text().trim()
    // );
    try {
        let next = $(".pagination li.active");
        $(".module_list.cozy li").each((index, data) => {
        urls.push(origin + $(data).find('.avatarinfo .freelancerAvatar__screenName a')[0].attribs.href);
        });
        if (next && next.next().find('a')) {
        let nxtUrl = next.next().find('a')[0].attribs.href;
        //console.log(urls);
        console.log(`NEXT PAge URL  =====${nxtUrl}`);
        await scrapper(origin + nxtUrl);
        } else {
            console.log("TOTAL====" + urls.length)
            for(let i=0; i<urls.length; i++) {
                console.log(i + "====" +urls[i]);
                await scrapperDetails(urls[i])
            }
        }
    } catch(e) {
        console.log("TOTAL====" + urls.length)
        for(let i=0; i<urls.length; i++) {
            console.log(i + "====" +urls[i]);
            await scrapperDetails(urls[i])
        }
    }
    
    //console.log(urls);
  //}
  convertToCSV(dentalHos);
 console.log("===========+++SCRAPPER END++++++==========");
}

async function scrapperDetails(url) {
    const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    !url
      ? "https://www.guru.com/d/freelancers/skill/magento/l/united-states/"
      : url,
    {
      waitUntil: "domcontentloaded",
      // Remove the timeout
      timeout: 0,
    }
  );
  const data = await page.evaluate(() => document.querySelector("*").outerHTML);
  await browser.close();
  await parseDetailPage(data);
}

async function parseDetailPage(html) {
    const $ = cheerio.load(html);
    dentalHos.push({
        name: $(".profile-avatar__info .profile-avatar__info__name").text(),
        location: $(".profile-avatar__info .profile-avatar__info__location").text(),
        website: $('#visit-website') ? $('#visit-website').attr('href') : '',
        fblink: $(".profile-web__social .socialIcon--fb") ? $(".profile-web__social .socialIcon--fb").attr("href") : "",
        linkedIn: $(".profile-web__social .socialIcon--linkedIn") ? $(".profile-web__social .socialIcon--linkedIn").attr("href") : "",
    });
    //console.log(JSON.stringify(dentalHos))
}

scrapper(
  "https://www.guru.com/d/freelancers/skill/magento/l/united-states/"
).then(() => {
  console.log("CSV");
  convertToCSV(dentalHos);
}).catch( () => {
    convertToCSV(dentalHos);
});

let convertToCSV = (content) => {
  const date = new Date();
  const month = date.getMonth() + 1;
  const csv = csvWriter.createObjectCsvWriter({
    path: `./guru/guru-${date.getFullYear()}-${month}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.csv`,
    header: [
      { id: "name", title: "Name" },
      { id: "location", title: "Location" },
      { id: "website", title: "Website" },
      { id: "fblink", title: "FB" },
      { id: "linkedIn", title: "Linked In" },
    ],
  });
  csv
    .writeRecords(content)
    .then(() => console.log("The CSV file was written successfully"));
};
