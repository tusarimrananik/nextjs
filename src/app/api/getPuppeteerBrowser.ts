import puppeteer, { Browser, Page, Cookie, LaunchOptions } from 'puppeteer';

/**
 * Launches a Puppeteer browser instance (or reuses an existing page),
 * optionally sets cookies, viewport dimensions, and user agent, then navigates to the specified site.
 *
 * @param site - The URL to navigate to.
 * @param cookie - Optional array of Puppeteer Cookie objects.
 * @param isHeadless - Indicates if the browser should run in headless mode (default: true).
 * @param executablePath - Optional custom path to the browser executable.
 * @param userDataDir - Optional path to the user data directory.
 * @param args - Optional array of additional launch arguments.
 * @param userAgent - Optional user agent string to set for the page.
 * @returns A Promise that resolves to the Puppeteer Page instance.
 */




export default async function getPuppeteerBrowser(
    site: string,
    cookie?: Cookie[],
    isHeadless: boolean = true,
    executablePath?: string,
    userDataDir?: string,
    args?: string[],
    userAgent?: string
): Promise<Page> {
    // Build the launch options dynamically.
    const launchOptions: LaunchOptions = {
        headless: isHeadless,
    };

    if (executablePath) {
        launchOptions.executablePath = executablePath;
    }

    if (userDataDir) {
        launchOptions.userDataDir = userDataDir;
    }

    if (args) {
        launchOptions.args = args;
    }



    //CHNAGE HERE TO SWITCH BROWSER

    const browser: Browser = await puppeteer.launch(launchOptions);

    // const browser = await puppeteer.connect({
    //     browserWSEndpoint: `wss://production-sfo.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    // });




    // Reuse an existing page if available.
    const pages: Page[] = await browser.pages();
    const page: Page = pages.length > 0 ? pages[0] : await browser.newPage();

    // Set cookies using BrowserContext.setCookie instead of the deprecated page.setCookie.
    if (cookie && cookie.length > 0) {
        await setCookie(page, cookie);
    }

    // Set the viewport dimensions.
    await setPageFullDimension(page);

    // Set the user agent if provided.
    if (userAgent) {
        await page.setUserAgent(userAgent);
    }

    // Navigate to the specified site.
    await page.goto(site);

    return page;
}

/**
 * Sets cookies on the given Puppeteer page using the browser context.
 *
 * @param page - The Puppeteer Page instance.
 * @param cookies - An array of Puppeteer Cookie objects to set.
 */
export async function setCookie(page: Page, cookies: Cookie[]): Promise<void> {
    const context = page.browser().defaultBrowserContext();
    await context.setCookie(...cookies);
}

/**
 * Sets the viewport dimensions for the given Puppeteer page.
 *
 * @param page - The Puppeteer Page instance.
 */
export async function setPageFullDimension(page: Page): Promise<void> {
    const dimensions = await page.evaluate(() => ({
        width: window.screen.width,
        height: window.screen.height,
    }));
    await page.setViewport(dimensions);
}
