import { NextRequest, NextResponse } from 'next/server';
import getPuppeteerBrowser from '../getPuppeteerBrowser';
import { facebookCookies } from './lib/facebookCookie';
import { scrapeFacebook } from './scrapeFB';
import setDataTakeSS from './setDataTakeSS';


export async function POST(request: NextRequest) {

  const body = await request.json();
  const URL = body.url;
  const page = await getPuppeteerBrowser(URL, facebookCookies())
  const scrapedData = await scrapeFacebook(page)
  await page.goto("https://tusarimrananik.github.io/FacebookUI")
  const screenshotBuffer = await setDataTakeSS(scrapedData, page)
  page.close();


  return NextResponse.json({ screenshotBuffer }, { status: 200 });
}

