import editWhatsApp from './editWhatsApp';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Validate that an image file exists and is of type image
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Invalid file type provided" },
        { status: 400 }
      );
    }

    // Process the image file
    const imageBuffer = await imageFile.arrayBuffer();


    // // Build the profile object using consistent key names
    const whatsappProfile = {
      image: Buffer.from(imageBuffer),
      WhatsAppName: formData.get('WhatsAppName')?.toString() ?? '',
      WhatsappNumber: formData.get('WhatsappNumber')?.toString() ?? '',
      WhatsAppAbout: formData.get('WhatsAppAbout')?.toString() ?? ''
    };

    const finalImage = await editWhatsApp(whatsappProfile);

    return new NextResponse(Buffer.from(finalImage), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': finalImage.length.toString()
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
