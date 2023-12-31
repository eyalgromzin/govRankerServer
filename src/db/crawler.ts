// run on url https://www.ynet.co.il/topics/1-500/%D7%9E%D7%9E%D7%A9%D7%9C%D7%94 and get good links
//https://www.npmjs.com/package/crawlee
//https://www.npmjs.com/package/crawler

exports.runCrawler = (url, maxDepth, domain) => {
    const Crawler = require("crawler");

    const crawler = new Crawler({
        jquery: false,
        callback: (error, res, done) => {
            if (error) {
                console.error(error);
            } else {
                try {
                    const currentDepth = res.options.depth || 1;
                    
                    if (currentDepth < maxDepth) {
                        // Follow links on the page to crawl further
                        const body = res.body;
                        // const title = res
                        console.log(`crawling ${res.options.uri}, title ???`)
                        
                        const $ = res.$;
                        $("a").each((index, element) => {
                            let link = $(element).attr("href");
                            if (link && !link.includes('#') && !link.includes('mailto:')) {
                                if (link.startsWith('/')){
                                    link = domain + link
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
        domain,
    });

    
};
