import { NextRequest, NextResponse } from 'next/server';
import getPuppeteerBrowser from '../getPuppeteerBrowser';
import { facebookCookies } from './lib/facebookCookie';
import { scrapeFacebook } from './scrapeFB';
import setDataTakeSS from './setDataTakeSS';


export async function POST(request: NextRequest) {
  const { url, time } = await request.json();
  try {
    const page = await getPuppeteerBrowser(url, facebookCookies())
    const scrapedData = await scrapeFacebook(page)

    //Here you can use any site to set data and take screenshot from
    // await page.goto("https://tusarimrananik.github.io/FacebookUI")
    await page.goto(`${process.env.BASE_URL}/FacebookUI/index.html`)
    const screenshotBuffer = await setDataTakeSS(scrapedData, page, time)

    await page.close();
    return NextResponse.json({ imageBuffer: screenshotBuffer.toString('base64') }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred in the server and failed to generate image buffer!';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }

}

