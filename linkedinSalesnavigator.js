let data = [];

let getlinkedInValuesFromCrome = _=> {
    data = [];
    $('.search-results__result-item').each((index, ele) => {
        data.push({
            name: $(ele).find(".result-lockup__name a").text().trim(),
            profileLink: $(ele).find(".result-lockup__name a").attr("href"),
            company: $(ele).find(".result-lockup__position-company .ember-view span:first-child").text().trim(),
            position: $(ele).find(".result-lockup__highlight-keyword span").first().text(),
            location:$(ele).find("li.result-lockup__misc-item").text()
        });
    })
    console.log(JSON.stringify(data));
}
