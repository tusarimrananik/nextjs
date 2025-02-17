import { Page } from 'puppeteer';
import { fbProfileSelectors } from './lib/selectors';

export const scrapeFacebook = async (page: Page): Promise<Record<string, any>> => {
    try {
        // Wait concurrently for all selectors (with a visible flag to ensure they’re rendered)
        const waitResults = await Promise.allSettled(
            Object.values(fbProfileSelectors).map(selector =>
                page.waitForSelector(selector, { timeout: 5000, visible: true })
            )
        );

        // Log warnings if any selector did not appear
        // Object.values(fbProfileSelectors).forEach((selector, idx) => {
        //     if (waitResults[idx].status === 'rejected') {
        //         console.warn(`Warning: Selector "${selector}" did not load:`, waitResults[idx]);
        //     }
        // });

        // Evaluate and extract data in the browser context
        const scrapedData = await page.evaluate((selectors: Record<string, string>) => {
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
                about
            };
        }, fbProfileSelectors);

        return scrapedData;
    } finally {
        // Ensure the page is closed regardless of errors
        // await page.close();
    }
};
