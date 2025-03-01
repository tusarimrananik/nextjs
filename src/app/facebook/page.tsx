"use client";
import { FC, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { validateAndNormalizeFacebookUrl } from './validateAndNormalizeFacebookUrl';

const Facebook: FC = () => {
    const handleInputChange = (value: string) => {
        setFbUrl(value);
        try {
            validateAndNormalizeFacebookUrl(value);
            setValidationError('');
        } catch (error) {
            setValidationError('Please enter a valid Facebook URL');
        }
        setError(null);
    };

    const handleInputPaste = async () => {
        try {
            // Check if we have clipboard permission
            const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });

            if (permissionStatus.state === 'denied') {
                // alert('Please allow clipboard access to paste Facebook URL');
                return;
            }
            // If permission is granted or prompt, proceed with reading clipboard
            if (['granted', 'prompt'].includes(permissionStatus.state)) {
                const clipboardText = await navigator.clipboard.readText();
                // Validate and set value
                if (validateAndNormalizeFacebookUrl(clipboardText)) {
                    setFbUrl(clipboardText);
                    inputRef.current?.select();
                } else {
                    alert('Clipboard does not contain a valid Facebook URL');
                }
            }
        } catch (error) {
            // alert('Failed to access clipboard: ' + error);
        }
    }

    const handleFbHack = async (url: string): Promise<string> => {
        try {
            const response = await fetch('/api/facebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, time }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'API Response is not ok and unknown error occurred!');
            }

            const data = await response.json();
            const buffer = Uint8Array.from(atob(data.imageBuffer), (c) => c.charCodeAt(0));
            const blob = new Blob([buffer], { type: 'image/png' });
            return URL.createObjectURL(blob);
        } catch (error) {
            throw new Error(error instanceof Error ? error.stack : 'An unknown error occurred and failed to generate image url!');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setImageUrl(null);
        let normalizedUrl;
        try {
            normalizedUrl = validateAndNormalizeFacebookUrl(fbUrl);
        } catch (error) {
            setValidationError('Please enter a valid Facebook URL');
            return;
        }
        setIsDisabled(true);
        try {
            const imgUrl = await handleFbHack(normalizedUrl);
            setImageUrl(imgUrl);
            setValidationError('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to process request inside handleSubmit function!');
        } finally {
            setIsDisabled(false);
        }
    };

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'facebook-screenshot.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const generateFutureTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(generateFutureTime());
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
        }

    }, []);

    const [fbUrl, setFbUrl] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [validationError, setValidationError] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [time, setTime] = useState(generateFutureTime());
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Card className='flex flex-col gap-4 overflow-hidden rounded-none p-4 select-none'>
            <CardTitle className='text-center'>Hack Facebook Account</CardTitle>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">

                    <div className="flex">
                        <Input
                            id="facebookLink"
                            type="text"
                            placeholder="Facebook Link"
                            value={fbUrl}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onClick={handleInputPaste}
                            className={`grow ${validationError ? 'border-red-500' : ''}`}
                        />
                        <Input onChange={(e) => { setTime(e.target.value) }} className='w-auto' type="time" defaultValue={time} />
                    </div>

                    {validationError && (
                        <span className="text-red-500 text-sm">{validationError}</span>
                    )}
                </div>


                <Button
                    type="submit"
                    className='w-full mt-2'
                    disabled={isDisabled || !fbUrl || !!validationError}
                >
                    {isDisabled ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={18} />
                            Hacking process initialized. Processing...
                        </>
                    ) : (
                        'Start Hacking!'
                    )}
                </Button>
            </form>


            {error && (
                <Alert variant="destructive" className="relative">
                    <button
                        className="absolute top-2 right-2"
                        onClick={() => setError(null)}
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}
            {imageUrl && (
                <>
                    <Card className="rounded-none h-full w-[150px] m-auto">
                        <img
                            className="w-full h-full object-cover"
                            src={imageUrl}
                            alt="Facebook Screenshot"
                        />
                    </Card>
                    <Button onClick={handleDownload}>Download Image</Button>
                </>
            )}
        </Card>

    );
};

export default Facebook;