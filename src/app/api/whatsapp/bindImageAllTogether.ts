import sharp, { Blend } from 'sharp';

export interface OverlayConfig {
    imageBuffer: Buffer;
    top?: number;
    left?: number;
    blend?: Blend;
}

/**
 * Composites multiple overlay images onto a base image.
 *
 * @param {Buffer} baseBuffer - The buffer of the base image.
 * @param {Array<OverlayConfig>} overlays - An array of overlay configurations.
 * @returns {Promise<Buffer>} - A promise that resolves to the final composited image buffer.
 */
export default async function bindImageAllTogether(baseBuffer: Buffer, overlays: OverlayConfig[]): Promise<Buffer> {
    const baseImage = sharp(baseBuffer);

    const compositeOptions = overlays.map(overlay => ({
        input: overlay.imageBuffer,
        top: overlay.top || 0,
        left: overlay.left || 0,
        blend: overlay.blend || 'over'
    }));

    return await baseImage.composite(compositeOptions).toBuffer();
}
