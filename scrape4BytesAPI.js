const request = require('request');
const fs = require("fs");
const Web3 = require("web3");

const web3 = new Web3();

const maxPages = 100000;
let sigData = {};
let pagesFinished = 0;
let api_url = "https://www.4byte.directory/api/v1/signatures/?format=json";

const scrapeApi = (url, page) => {

  console.log("Getting " + url);

  let options = {json: true};
  request(url, options, (error, res, body) => {
    if (error) {
        return  console.log(error)
    };

    if (!error && res.statusCode == 200) {
        // do something with JSON, using the 'body' variable
        body.results.forEach((result) => {
          sigData[result.id] = {
            "sig":  result.hex_signature,
            "text": result.text_signature
          }
        });

        console.log(Object.keys(sigData).length);

        if (body.next) {
          scrapeApi(body.next, page + 1);
        }
        else {
          finishedScraping();
        }
    };
  });
}

const finishedScraping = () => {
  delete sigData["Bytes Signature"];
  // console.log(sigData);
  fs.writeFile("sigDataApi.json", JSON.stringify(sigData, null, 2), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

scrapeApi(api_url, 1);
