import { Page } from 'puppeteer';
import { fbProfileSelectors } from './lib/selectors';

export const scrapeFacebook = async (page: Page): Promise<Record<string, unknown>> => {
    try {
        // Wait concurrently for all selectors (with a visible flag to ensure they’re rendered)
        const waitResults = await Promise.allSettled(
            Object.values(fbProfileSelectors).map(selector =>
                page.waitForSelector(selector, { timeout: 5000, visible: true })
            )
        );

        // Log warnings if any selector did not appear
        Object.entries(fbProfileSelectors).forEach(([key, selector], idx) => {
            if (waitResults[idx].status === 'rejected') {
                console.warn(`Selector "${key}" did not load`);
            }
        });

        // Evaluate and extract data in the browser context
        const scrapedData = await page.evaluate(async (selectors: Record<string, string>) => {
            // Helper function to get trimmed text content
            const getText = (sel: string): string => {
                const el = document.querySelector(sel);
                return el ? (el.textContent || '').trim() : '';
            };




            const profileName = getText(selectors.profileName);

            const profilePictureNodes = document.querySelectorAll(selectors.profilePicture);
            const profilePicture = profilePictureNodes.length > 1
                ? (profilePictureNodes[1] as HTMLImageElement).getAttributeNS('http://www.w3.org/1999/xlink', 'href')
                : null;

            const coverPictureEl = document.querySelector(selectors.coverPicture) as HTMLImageElement | null;
            const coverPicture = coverPictureEl ? coverPictureEl.src : null;

            const bioEl = document.querySelector(selectors.bio);
            const bio = bioEl ? bioEl.innerHTML : null;



            let friends = null;
            const friendsEl = document.querySelector(selectors.friends);
            if (friendsEl instanceof HTMLElement) {
                const textLower = friendsEl.innerText.toLowerCase();
                const hasFriends = textLower.includes('friends');
                const hasFollowers = textLower.includes('follower');
                const count = textLower.split(' ')[0];
                if (hasFriends || hasFollowers) {
                    friends = {
                        count,
                        type: hasFriends ? 'friends' : 'followers'
                    };
                }
            }




            // Friends grid scraping with scroll
            let friendsGrid: string | null = null;
            if (friendsEl) {
                const maxScrollAttempts = 5;
                const scrollIncrement = 500;
                let attempts = 0;
                let collectedItems: string[] = [];

                while (attempts < maxScrollAttempts && collectedItems.length < 6) {
                    window.scrollBy(0, scrollIncrement);
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for content load

                    const elements = Array.from(document.querySelectorAll(selectors.friendsGrid));
                    const newItems = elements
                        .slice(collectedItems.length, 6) // Get new items up to max 6
                        .map(el => el.outerHTML);

                    if (newItems.length > 0) {
                        collectedItems = [...collectedItems, ...newItems];
                    }

                    attempts++;
                    if (collectedItems.length >= 6) break;
                }

                friendsGrid = collectedItems.length > 0 ? collectedItems.join('') : null;
            }





            const isLocked = !!document.querySelector(selectors.isLocked);
            const hasStory = !!document.querySelector(selectors.hasStory);

            let about = null;
            const aboutNodes = document.querySelectorAll(selectors.about);
            if (aboutNodes.length > 1) {
                const aboutEl = aboutNodes[1] as HTMLElement;
                if (aboutEl.querySelector('img')) {
                    about = aboutEl.innerHTML;
                }
            }

            return {
                profileName,
                profilePicture,
                coverPicture,
                bio,
                friends,
                isLocked,
                hasStory,
                about,
                friendsGrid
            };
        }, fbProfileSelectors);

        return scrapedData;
    } finally {
        // Ensure the page is closed regardless of errors
        // await page.close();
    }
};
