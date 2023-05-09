import { Dataset, PlaywrightCrawler } from "crawlee";

const crawler = new PlaywrightCrawler({
  launchContext: {
    launchOptions: {
      headless: false,
    },
  },

  // Stop crawling after several pages
  maxRequestsPerCrawl: 50,

  async requestHandler({ request, page, enqueueLinks, log }) {
    log.info(`Processing ${request.url}...`);

    const scrapedData: {
      title: string;
      description: string;
      href: string;
    }[] = [];

    // approve cookies
    await page
      .locator('[aria-label="Alle akzeptieren"]')
      .first()
      .click({
        timeout: 10 * 1000,
      });

    await page.waitForSelector("[role=main]", { timeout: 30 * 1000 });

    const results = await page.locator("[role=article]").all();

    console.log("asdasd ", results.length);

    for await (const result of results) {
      await result.click();

      const popup = page.locator("[role=main]").nth(1);

      scrapedData.push({
        title: await popup.locator("h1").textContent(),
        // description: await result.locator("span").innerText(),
        // href: await result.locator("a").getAttribute("href"),
        description: "",
        href: "",
      });
      console.log(scrapedData.at(-1));
    }

    // const data = await page.$$eval("#res .q", (pages) => {
    //   console.log(pages);

    //   const scrapedData: {
    //     title: string;
    //     description: string;
    //     href: string;
    //   }[] = [];

    //   pages.forEach((page) => {
    //     scrapedData.push({
    //       title: page.querySelector("h3").innerText,
    //       description: page.querySelector("span").innerText,
    //       href: page.querySelector("a").href,
    //     });
    //   });

    //   return scrapedData;
    // });

    // Store the results to the default dataset.
    // await Dataset.pushData(data);

    // const infos = await enqueueLinks({
    //   selector: "#res .q a",
    // });

    // if (infos.processedRequests.length === 0) {
    //   log.info(`${request.url} is the last page!`);
    // }
  },

  // This function is called if the page processing failed more than maxRequestRetries+1 times.
  failedRequestHandler({ request, log }) {
    log.info(`Request ${request.url} failed too many times.`);
  },
});

async function main() {
  await crawler.addRequests([
    // "https://www.google.com/search?q=coworking+space+in+kiel",
    "https://www.google.com/maps/search/co+working+space+mannheim",
  ]);

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log("Crawler finished.");
}

main();
