"use client";

import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FC, useState } from 'react'

const Gmail: FC = () => {


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('GmailAddress', GmailAddress);
        formData.append('GmailName', GmailName);
        formData.append('time', time);

        if (gmailPhoto) {
            formData.append('gmailPhoto', gmailPhoto); // Key now matches server expectation
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




    const [GmailAddress, setGmailAddress] = useState('');
    const [GmailName, setGmailName] = useState('');
    const [time, setTime] = useState('');
    const [gmailPhoto, setgmailPhoto] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');






    return (


        <Card className='flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none'>
            <CardTitle className='text-center'>Hack Gmail Account</CardTitle>
            <form className="flex flex-col gap-1">
                <Input
                    id="GmailAddress"
                    type="text"
                    placeholder="Gmail Address"
                />
                <Input
                    id="GmailName"
                    type="text"
                    placeholder="Gmail Name"
                />

                <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <Input
                        id="gmailPhoto"
                        type="file"
                        accept="image/*"
                    />
                    <Input
                        id="gmailTime"
                        type="time"
                        accept="image/*"
                    />
                </div>

                <Button type="submit" className="w-full mt-2">
                    Start Hacking!
                </Button>
            </form>
        </Card>



    )
}

export default Gmail