var headings = ["Transaction Name", "Acquired by", "Announced Date", "Categories", "Headquarters Regions", "Founded Date", "Founders", "Operating Status","Funding Status","Last Funding Type", "Number of Employees", "Legal Name", "IPO Status", "Website", "Facebook","LinkedIn","Twitter"];
var findValueOnNextEle = (ele)=> {
    return checkAndReturnText(ele.nextSibling);
}
var getLinkInNextEle = (ele)=> {
    return ele.nextElementSibling.querySelector("a").href;
}

var getInvestorsFromTable = ele => {
    if(ele) {
        let investors = [];
        ele.forEach((row) => {
            if(row.querySelector("td"))
                investors.push(row.querySelector("td").innerText.trim());
        });
        return investors.join(",");
    } else {
        return "";
    }
}
var checkAndReturnText = ele => {
    if(ele) {
        return ele.innerText.trim();
    } else {
        return "";
    }
}
var checkInDataInsertEmpty = strName => {
    data[strName] = data[strName] ? data[strName]: "";
}

let data = {};

let getCrunchBaseCrawlFromCrome = _=> {
    data = {};
    if($("description-card .cb-link")) {
        $("description-card .cb-link").click();
    }
    if($("description-card")) {
        let description = $("description-card").innerText;
        description = description.replace(/Collapse/ig, "").trim();
        data.longDescription= description;
    } else {
       data.longDescription = "";
    }
    
    //let eleFieldGroup = "cb-text-color-medium";
    data.companyName = checkAndReturnText($(".component--image-with-text-card .text-content>:first-child"));
    data.shortDescription = checkAndReturnText($(".component--image-with-text-card div:nth-child(2)"));
    data.headquarters = checkAndReturnText($(".component--image-with-text-card div:nth-child(3)"));
    $$("fields-card span.cb-text-color-medium").forEach((ele)=> {
        let eleText = ele.innerText.trim();
        if(headings.indexOf(eleText)> -1) {
            if(["Facebook","Website","LinkedIn","Twitter"].indexOf(eleText) > -1 ) {
                data[eleText] = getLinkInNextEle(ele);
            } else {
                data[eleText] = findValueOnNextEle(ele);
            }    
        }
        
    });
    //if($$("#section-funding-rounds .bigValueItem:nth-child(2) a").length) {
        data.capitalRaised = checkAndReturnText($$("#section-funding-rounds .bigValueItem:nth-child(2) a")[0]);
    //}
    
    data.investors = getInvestorsFromTable($$("#section-investors table tbody tr"));
    //if($$("#section-funding-rounds phrase-list-card a.field-type-date")[0]) {
        data["Last Financing Event Date"] = checkAndReturnText($$("#section-funding-rounds phrase-list-card a.field-type-date")[0]);
    //}
    if($$("#section-m-a-details span.field-label").length) {
        $$("#section-m-a-details span.field-label").forEach(ele => {
            let eleText = ele.innerText.trim();
            if(headings.indexOf(eleText) > -1) {
                data[eleText] = findValueOnNextEle(ele);    
            }
            
        });    
    }
    
    //if($("#section-competitors-revenue-by-owler")) {
        data["Revenue"] = checkAndReturnText($("#section-competitors-revenue-by-owler span.field-type-money"));
        data["Competitors"] = checkAndReturnText($("#section-competitors-revenue-by-owler list-markup-block"));
    //}
    //if($$("#section-web-traffic-by-similarweb field-formatter:nth-child(3)").length) {
        data["Monthly Web Visitors"] = checkAndReturnText($$("#section-web-traffic-by-similarweb field-formatter:nth-child(3)")[0]);
    //}
    //if($("#section-mobile-app-metrics-by-apptopia big-values-card mat-card >:nth-child(2)")) {
        data["Mobile Downloads"] = checkAndReturnText($("#section-mobile-app-metrics-by-apptopia big-values-card mat-card >:nth-child(2)"))
    //}
    headings.forEach(str => {
        checkInDataInsertEmpty(str);
    });
    console.log(JSON.stringify(data));
}