// run on url https://www.ynet.co.il/topics/1-500/%D7%9E%D7%9E%D7%A9%D7%9C%D7%94 and get good links
//https://www.npmjs.com/package/crawlee
//https://www.npmjs.com/package/crawler

import Crawler from "crawler"
import { getAllGovernments } from "./government";
import { getAllParties } from "./party";
import { getAllPartyMembers } from "./partyMember";
import { getRecentlyAdded } from "./article";

const parseWebssiteAndAddToDB = (db, currentUrl, body, title, allGovernments, allParties, allPartyMembers) => {
    //tests 
        //get atrticle date - to know to which government to add the article

        //check 

    let s = 5
    s += 1
    //check for specific words / something 

    //add to db - if all good 

}

export const runCrawler = async (db, url, maxDepth, domain) => {
    //get all party memebers from all parties , pass them to parseWebssiteAndAddToDB() to know where to classify they article
    const allGovernments = await getAllGovernments(db)
    const allParties = await getAllParties(db)
    const allPartyMembers = await getAllPartyMembers(db)
    
    //first get last 100 articles - each time the crawler find a new article, check if the url exists in the last 100 
    const recentlyAddedArticles = await getRecentlyAdded(db, 100)

    const crawler = new Crawler({
        callback: (error, res, done) => {
            if (error) {
                console.error(error);
            } else {
                try {
                    const currentDepth = res.options.depth || 1;

                    if (currentDepth < maxDepth) {
                        // Follow links on the page to crawl further
                        const $ = res.$;
                        const body = res.body;
                        const title = $("title").text();
                        const currentUrl = res.options.uri;

                        console.log(`scraping ${currentUrl}`);

                        if(currentUrl.includes('article/')){
                            parseWebssiteAndAddToDB(db, currentUrl, body, title, allGovernments, allParties, allPartyMembers)
                        }

                        $("a").each((index, element) => {
                            let link = $(element).attr("href");
                            if (
                                link &&
                                !link.includes("#") &&
                                !link.includes("mailto:")
                            ) {
                                if (link.startsWith("/")) {
                                    link = domain + link;
                                }

                                crawler.queue({
                                    uri: link,
                                    depth: currentDepth + 1, // Increment the depth for the next page
                                });
                            }
                        });
                    }
                } catch (e) {
                    console.error("error in crawler: ", e);
                }
            }
            done();
        },
    });

    // Start crawling with an initial URL and depth of 1
    crawler.queue({
        uri: url,
        depth: 1,
    });

    // Queue a list of URLs
    // c.queue(["http://www.google.com/", "http://www.yahoo.com"]);

    // Queue URLs with custom callbacks & parameters
    // c.queue([
    //     {
    //         uri: url,
    //         jQuery: false,

    //         // The global callback won't be called
    //         callback: (error, res, done) => {
    //             if (error) {
    //                 console.log(error);
    //             } else {
    //                 console.log("Grabbed", res.body.length, "bytes");
    //             }
    //             done();
    //         },
    //     },
    // ]);

    // Queue some HTML code directly without grabbing (mostly for tests)
    // c.queue([
    //     {
    //         html: "<p>This is a <strong>test</strong></p>",
    //     },
    // ]);
};
