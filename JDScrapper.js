let dentArr = [];
function scrapper() {
    dentArr= [];
    let card;
    $("ul.rsl.col-md-12.padding0>li").each(function(idx, htm) {
		card = $(this);
		card.find(".contact-info .mobilesv");
	   dentArr.push({
	       name:card.find(".store-name a").attr("title"),
	       phone: getPhoneNumber(card.find(".contact-info .mobilesv")),
    	   address: card.find('.address-info a span:nth-child(2)').text().trim()
	   })
    });
    console.log(JSON.stringify(dentArr));
}

function getPhoneNumber(spanList) {
	let phno = "";
	spanList.each( (idx, span) => {
		let clasName = span.classList[1];
		switch(clasName) {
			case 'icon-dc':
				phno += "+";
				break;
			case 'icon-fe':
				phno += "(";
				break;
			case 'icon-hg':
				phno += ")";
				break;
			case 'icon-ba':
				phno += "-";
				break;
			case 'icon-acb':
				phno += "0";
				break;
			case 'icon-yz':
				phno += "1";
				break;
			case 'icon-wx':
				phno += "2";
				break;
			case 'icon-vu':
				phno += "3";
				break;
			case 'icon-ts':
				phno += "4";
				break;
			case 'icon-rq':
				phno += "5";
				break;
			case 'icon-po':
				phno += "6";
				break;
			case 'icon-nm':
				phno += "7";
				break;
			case 'icon-lk':
				phno += "8";
				break;
			case 'icon-ji':
				phno += "9";
				break;
			default:
				break;
		}
	});
	return phno;
}