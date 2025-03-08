"use client";
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FC, useState } from 'react';

const WhatsApp: FC = () => {
  const [whatsAppName, setWhatsAppName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [whatsAppAbout, setWhatsAppAbout] = useState('');
  const [whatsAppPhotoFile, setWhatsAppPhotoFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'whatsapp-profile.png'; // Updated filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };













  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('WhatsAppName', whatsAppName);
    formData.append('WhatsappNumber', whatsAppNumber);
    formData.append('WhatsAppAbout', whatsAppAbout);

    if (whatsAppPhotoFile) {
      formData.append('image', whatsAppPhotoFile); // Key now matches server expectation
    } else {
      setError("Please select an image file.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      // Process the returned image blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };














  return (
    <Card className="flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none">
      <CardTitle className="text-center">Hack WhatsApp Account</CardTitle>
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <Input
          id="WhatsAppName"
          type="text"
          placeholder="WhatsApp name"
          value={whatsAppName}
          onChange={(e) => setWhatsAppName(e.target.value)}
        />
        <Input
          id="WhatsappNumber"
          type="text"
          placeholder="WhatsApp number"
          value={whatsAppNumber}
          onChange={(e) => setWhatsAppNumber(e.target.value)}
        />
        <Input
          id="WhatsAppAbout"
          type="text"
          placeholder="WhatsApp about"
          value={whatsAppAbout}
          onChange={(e) => setWhatsAppAbout(e.target.value)}
        />

        <div className="grid grid-cols-[2fr_1fr] gap-2">

          <Input
            id="image"
            type="file"
            accept="image/*" // Restricts file input to images
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setWhatsAppPhotoFile(e.target.files[0]);
              }
            }}
          />
          <Input
            id="time"
            type="time"
          />
        </div>




        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Processing...' : 'Start Hacking!'}
        </Button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {imageUrl && (
        <>
          <Card className="rounded-none h-full w-[150px] m-auto">
            <img
              className="w-full h-full object-cover"
              src={imageUrl}
              alt="WhatsApp Profile"
            />
          </Card>
          <Button onClick={handleDownload}>Download Image</Button>
        </>
      )}
    </Card>
  );
};

export default WhatsApp;