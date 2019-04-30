const scrapeIt = require("scrape-it");
const fs = require("fs");
const Web3 = require("web3");

const web3 = new Web3();

const maxPages = 100000;
let sigData = {};
let pagesFinished = 0;

const scrapePage = (page) => {
  // print every 100 pages
  if (page % 100 === 0 ) {
    console.log(page);
  }

  let url = "https://www.4byte.directory/signatures/?sort=id&page=" + page;
  let opt = {
    rows: {
        listItem: "tr",
        data: {
          sig: ".bytes_signature",
          text: ".text_signature"
        }
    },
    li: {
      listItem: "li"
    }
  }
  scrapeIt(url, opt)
  .then(({ data, response }) => {
    data.rows.forEach((row) => {
      sigData[row.sig] = row.text;
    });

    if (data.li[data.li.length - 1] === 'Next »' && page < maxPages) {
      return scrapePage(page + 1);
    } else {
      finishedScraping();
    }
  });
}

const finishedScraping = () => {
  delete sigData["Bytes Signature"];
  // console.log(sigData);
  fs.writeFile("sigData.json", JSON.stringify(sigData, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

scrapePage(1);
