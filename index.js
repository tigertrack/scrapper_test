const puppeteer = require('puppeteer');
function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({headless:false});
            const page = await browser.newPage();
            
            await page.goto(process.argv[2]);
            await page.setViewport({
                width: 1200,
                height: 800
            });
        
            await autoScroll(page);
        
            
            let urls = await page.evaluate(() => {
                let results = [];
                let title = document.querySelector('h1.css-x7lc0h').innerHTML;
                let description = document.querySelector('div.css-1as1ohz').innerHTML.replace(/(<([^>]+)>)/gi, "");;
                results.push({
                    title: title,
                    description: description
                })
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
run().then(console.log).catch(console.error);