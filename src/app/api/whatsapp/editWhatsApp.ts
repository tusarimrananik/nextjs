import makeCircularImage from './makeCircularImage';
import { svgTextGenerator } from './svgTextGen';
import { promises as fs } from 'fs';
import bindImageAllTogether, { OverlayConfig } from './bindImageAllTogether'; // Import the correct type
import path from 'path';

interface WhatsAppProfile {
    image: Buffer;
    WhatsAppName: string;
    WhatsappNumber: string;
    WhatsAppAbout: string;
}

async function editWhatsApp(whatsApp: WhatsAppProfile): Promise<Buffer> {
    try {
        const [circularBuffer, WhatsAppNameBuffer, WhatsappNumberBuffer, WhatsAppAboutBuffer] = await Promise.all([
            makeCircularImage(whatsApp.image, 300),
            svgTextGenerator({ text: whatsApp.WhatsAppName }),
            svgTextGenerator({ text: whatsApp.WhatsappNumber }),
            svgTextGenerator({ text: whatsApp.WhatsAppAbout })
        ]);
        const baseBuffer = await fs.readFile(path.join(process.cwd(), 'src/app/api/whatsapp/assets/profile.png'));

        const overlays: OverlayConfig[] = [
            {
                imageBuffer: circularBuffer,
                top: 90,
                left: 100,
                blend: 'over' as 'over' // Type assertion for blend mode
            },
            {
                imageBuffer: WhatsAppNameBuffer,
                top: 150,
                left: 100,
                blend: 'over' as 'over'
            },
            {
                imageBuffer: WhatsappNumberBuffer,
                top: 250,
                left: 100,
                blend: 'over' as 'over'
            },
            {
                imageBuffer: WhatsAppAboutBuffer,
                top: 350,
                left: 100,
                blend: 'over' as 'over'
            }
        ];

        const finalBuffer = await bindImageAllTogether(baseBuffer, overlays);
        return finalBuffer;
    } catch (error) {
        console.error('Error compositing images:', error instanceof Error ? error.message : error);
        throw error;
    }
}

export default editWhatsApp;