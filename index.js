const express = require('express');
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Loading done.");
});

app.listen(5000, () => {
    console.log('The server is up and running on port 5000');
});


// 9a3ed nrigl fel fonction hedhi 
async function cryptopriceScraper() {
    try {
        const url = "https://www.octaveclothing.com/men";
        const result = [];
        
        // Fetching the HTML data
        const response = await axios(url);
        const html_data = response.data;
        
        // Loading HTML data into Cheerio
        const $ = cheerio.load(html_data);

        const keys = ["Title", "Description", "Price"];
        const selectedElem = ".views-infinite-scroll-content-wrapper > .row > .col-6 > .product-7 > .product-body";

        $(selectedElem).each((parentIndex, parentElem) => {
            let keyIndex = 0;
            const data = {};
            if (parentIndex) {
                $(parentElem)
                    .children()
                    .each((childId, childElem) => {
                        const value = $(childElem).text();
                        if (value) {
                            data[keys[keyIndex]] = value;
                            keyIndex++;
                        }
                    });
                result.push(data);
            }
        });

        // Logging scraped data
        console.log("Scraped Data:", result);

        return result;
    } catch (error) {
        throw error;
    }
}


app.get("/data-scrapper", async (req, res) => {
    try {
        const data = await cryptopriceScraper();
        return res.status(200).json({
            result: data,
        });
    } catch (err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});
