const util = require('util');
const bodyParser = require('body-parser');
const express = require('express');
const exec = util.promisify(require('child_process').exec);
const cheerio = require('cheerio');
const formats = [
  'https://www.${domain}',
  'https://${domain}',
  'http://www.${domain}',
  'http://${domain}'
];
var app = express();
var port = process.env.PORT || 3002;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

exports.handler = async (event, context, callback) => {
  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
        'Content-Type': 'application/json',
    },
  });
  switch (event.httpMethod) {
    case 'POST':
      const resbody = await getDeailsOfDomains(event);
      done(null, resbody);
      break;
    case 'GET': 
      getDeailsOfDomains('www.google.com');
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};

async function getDeailsOfDomains(req) {
  let result = [];
  let webDetails, domain;
  let {body} = req;
  if(body) {
    let {domains} = body;
    for(let i =0; i<domains.length; i++) {
      domain = domains[i];
      webDetails = {
        domain
      };
      //console.log("#=========================#");
      console.log(domain)
      //console.log("#=========================#");
      if(domain && domain.trim()) {
        try {
          let html = await getHtmlBody(domain);
          if(html) {
            let parse = parseBody(html);
            webDetails = {...webDetails, ...parse};
          }
        } catch(error) {
          console.log(`Error on get html body for ${domain}`, error);
        }
      }
      result.push(webDetails);
    }
  }
  return result;
}

async function getHtmlBody(domain) {
  let { stdout } = await exec(`curl ${domain}`);
  if (stdout)
    return checkRedirect(stdout, domain);
  else {
    stdout = await checkDomainWithFormats(domain);
  }
  return checkRedirect(stdout, domain);
}

async function checkDomainWithFormats(domain) {
  let stdout;
  for(let i=0; i< formats.length; i++) {
    let url = formats[i].replace('${domain}', domain);
    console.log(`Checking  ${url}`);
    ({stdout} = await exec(`curl ${url}`));
    //console.log('response ', stdout)
    if(stdout) {
      break;
    }
  }
  return stdout;
}

async function checkRedirect(stdout, domain) {
  if(stdout && stdout.indexOf('redirected') > -1 || stdout.indexOf('Moved Permanently') > -1 
    || stdout.indexOf('301 Moved') > -1 || stdout.indexOf('302 Found') > -1 || stdout.indexOf('Object moved') > -1) {
    console.log('getting redirected url');
    const $ = cheerio.load(stdout);
    let url = $('a').attr('href');
    if(!url) {
      stdout = await checkDomainWithFormats(domain);
    } else {
      console.log(`new url ${url}`);
      ({stdout}  = await exec(`curl ${url}`));
    }
  }
  return stdout;
}


function parseBody(body) {
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
  let shop;
  if($("a[href]:contains(Shop)").length) {
    console.log("==========SHOP===========")
    shop = $("a[href]:contains(Shop)");
  } else if($("a[href]:contains(Store)").length) {
    console.log("==========STORE===========")
    shop = $("a[href]:contains(Store)");
  } else if($("a[href]:contains(Wishlist)").length) {
    console.log("==========WISHLIST===========")
    shop = $("a[href]:contains(Wishlist)");
  }else if($("a[href]:contains(Checkout)").length) {
    console.log("==========CHECKOUT===========")
    shop = $("a[href]:contains(Checkout)");
  }else if($("a[href]:contains(Visa)").length) {
    console.log("==========VISA===========")
    shop = $("a[href]:contains(Visa)");
  }else if($("a[href]:contains(Bag)").length) {
    console.log("==========BAG===========")
    shop = $("a[href]:contains(Bag)");
  }else if($("a[href]:contains(Cart)").length) {
    console.log("==========CART===========")
    shop = $("a[href]:contains(Cart)");
  } else if($("a[href]:contains(Subscription)").length) {
    console.log("==========Subscription===========")
    shop = $("a[href]:contains(Subscription)");
  } else if($("a[href]:contains(Buy)").length) {
    console.log("==========BUY===========")
    shop = $("a[href]:contains(Buy)");
  } else if($("a[href]:contains(Pricing)").length) {
    console.log("==========PRICING===========")
    shop = $("a[href]:contains(Pricing)");
  } else if($("a[href]:contains(Membership)").length) {
    console.log("==========MEMBERSHIP===========")
    shop = $("a[href]:contains(Membership)");
  } else if($("a[href]:contains(Online)").length) {
    console.log("==========ONLINE===========")
    shop = $("a[href]:contains(Online)");
  }else if($("a[href]:contains(Order)").length) {
    console.log("==========ORDER===========")
    shop = $("a[href]:contains(Order)");
  }
  console.log("SHOP",$(shop[0]).text());
  //shop = shop ? shop[0] : "";
  if(shop) {
    shop = $(shop[0]).attr('href');
  }
  return {
    title,
    description,
    shop
  };
}

async function test() {
  const resbody = await getDeailsOfDomains({
    body: {
      domains: ['aquavida.com',
        'aqueduck.com',
        'aquickdelivery.com',
        'ar-15lowerreceivers.com',
        'ar15tac.com',
        'arachnogear.com',
        'aradicaldifference.com',
        'aramarkuniform.com',
        'aranchhorse.com',
        'arawazausa.com',
        'arbordakota.com',
        'arborhousefriends.com',
        'arborvitaeny.com',
        'arcadiamarine.com',
        'arcbarks.com',
        'arcchurches.com',
        'arc-fl.com',
        'archaicshop.com',
        'archangelec.com',
        'archbury.net',
        ]
    }
  });
  //console.log(JSON.stringify(resbody))
  //done(null, resbody);
}
//test();
app.post('/getDomainInfo', async (req, res) => {
  const resBody = await getDeailsOfDomains(req);
  res.send({
    success:true,
    data: resBody
  });
});
app.get('/', (req,res) => {
  res.send({
    data: "Server is up"
  });
});
app.listen(port, () => {
  console.log(`Server is ready and running in ${port}`);
});