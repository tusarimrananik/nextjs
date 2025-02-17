import { Page, ElementHandle } from "puppeteer";

export default async function setDataTakeSS(scrapedData: Record<string, any>, page: Page) {
    await page.evaluate(async (scrapedData) => {
        const {
            profileName,
            profilePicture,
            coverPicture,
            bio,
            friends,
            isLocked,
            hasStory,
            about,
        } = scrapedData;

        // Direct DOM element selection using literal selectors.
        const profileNameEl = document.querySelector('#mainName') as HTMLElement;
        const profilePictureEl = document.querySelector('.profilePhotoImage') as HTMLImageElement;
        const coverPictureEl = document.querySelector('.coverPhotoImage') as HTMLImageElement;
        const bioEl = document.querySelector('#bio') as HTMLElement;
        const isLockedEl = document.querySelector('#isLocked') as HTMLElement;
        const aboutEl = document.querySelector('.intro') as HTMLElement;
        const displayNameEl = document.querySelector('.nameTop') as HTMLElement;
        const statusPicEl = document.querySelector('#statusPic') as HTMLImageElement;
        const friendsCountEl = document.querySelector('#friendsNumber') as HTMLElement;
        const friendsTypeEl = document.querySelector('#friendsText') as HTMLElement;


        // Wait until an element is visible (polls every 100ms up to timeout)
        async function waitForElementVisibility(element: HTMLElement, timeout = 5000): Promise<void> {
            const pollInterval = 100;
            let elapsed = 0;
            while (elapsed < timeout) {
                if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, pollInterval));
                elapsed += pollInterval;
            }
            console.warn("Element did not become visible within timeout", element);
        }

        // Set image source and wait until it loads.
        const setImageWithLoadCheck = (element: HTMLImageElement | null, src: string): Promise<void> => {
            return new Promise((resolve, reject) => {
                if (!element) {
                    return reject(new Error('Element not found'));
                }
                element.src = src;
                element.onload = () => resolve();
                element.onerror = () => reject(new Error('Image failed to load'));
            });
        };

        // Update profile name and display name if available.
        if (profileName) {
            if (displayNameEl) {
                displayNameEl.textContent = profileName
                    .replace(/\(.*?\)/, '')
                    .trim()
                    .split(' ')
                    .slice(0, 3)
                    .join(' ');
                await waitForElementVisibility(displayNameEl);
            }
            if (profileNameEl) {
                profileNameEl.textContent = profileName.trim();
                await waitForElementVisibility(profileNameEl);
            }
        }

        // Update images concurrently.
        if (profilePicture) {
            try {
                await Promise.all([
                    setImageWithLoadCheck(profilePictureEl, profilePicture),
                    setImageWithLoadCheck(statusPicEl, profilePicture)
                ]);
            } catch (error) {
                console.error('Profile picture failed to load:', error);
            }
            if (profilePictureEl) await waitForElementVisibility(profilePictureEl);
        }

        if (coverPicture) {
            try {
                await setImageWithLoadCheck(coverPictureEl, coverPicture);
            } catch (error) {
                console.error('Cover photo failed to load:', error);
            }
            if (coverPictureEl) await waitForElementVisibility(coverPictureEl);
        }

        // Update bio or hide element if missing.
        if (bioEl) {
            if (bio) {
                bioEl.innerHTML = bio;
                await waitForElementVisibility(bioEl);
            } else {
                bioEl.classList.add('hidden');
            }
        }

        // Update friends count and type, or hide elements.
        if (friends && friendsCountEl && friendsTypeEl) {
            if (friends.count) {
                friendsCountEl.innerText = (friends.count.count || '').toString().toUpperCase();
                friendsTypeEl.innerText = friends.count.type || '';
                await Promise.all([
                    waitForElementVisibility(friendsCountEl),
                    waitForElementVisibility(friendsTypeEl)
                ]);
            } else {
                friendsCountEl.classList.add('hidden');
                friendsTypeEl.classList.add('hidden');
            }
        }

        // Toggle lock status.
        if (isLockedEl) {
            if (isLocked) {
                isLockedEl.classList.remove('hidden');
                await waitForElementVisibility(isLockedEl);
            } else {
                isLockedEl.classList.add('hidden');
            }
        }

        // Toggle story highlight on profile picture.
        if (profilePictureEl) {
            profilePictureEl.classList.toggle('hasStory', Boolean(hasStory));
        }
        
        if (about && aboutEl) {
            await waitForElementVisibility(aboutEl);
            aboutEl.insertAdjacentHTML('afterbegin', about);

            // Select all images inserted in the about element.
            const images = aboutEl.querySelectorAll('img');
            await Promise.all(Array.from(images).map(img => {
                return new Promise<void>((resolve, reject) => {
                    // If the image is already loaded, check its visibility.
                    if (img.complete && img.naturalHeight !== 0) {
                        waitForElementVisibility(img as HTMLElement)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        // Otherwise, attach event listeners to handle load and error.
                        img.addEventListener('load', () => {
                            waitForElementVisibility(img as HTMLElement)
                                .then(resolve)
                                .catch(reject);
                        });
                        img.addEventListener('error', () => {
                            reject(new Error('Image in about section failed to load'));
                        });
                    }
                });
            }));
        }

    }, scrapedData);

    const screenshotBuffer = await takeScreenshot(page);
    return screenshotBuffer;
}

async function takeScreenshot(page: Page): Promise<Buffer> {
    try {
        // Apply transformation to the root element.
        await page.evaluate(() => {
            const rootBody = document.querySelector('.rootBody') as HTMLElement | null;
            if (rootBody) {
                rootBody.style.transform = 'scale(5)';
                rootBody.style.transformOrigin = 'top left';
            } else {
                throw new Error("Element with class 'rootBody' not found in the DOM.");
            }
        });

        const element: ElementHandle<Element> | null = await page.$('.rootBody');
        if (!element) {
            throw new Error("Element with class 'rootBody' not found.");
        }
        return Buffer.from(await element.screenshot());
    } catch (error) {
        console.error('Error taking screenshot:', error);
        throw error;
    }
}
