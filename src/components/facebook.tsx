"use client";
import { FC, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface FacebookProps {
    onHack?: (result: string) => void;
}

export const HandleFbHack = async (url: string): Promise<string> => {
    const response = await fetch('/api/facebook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const ss = await response.json();
    const buffer = new Uint8Array(ss.screenshotBuffer.data);
    const blob = new Blob([buffer], { type: 'image/png' });
    const imgUrl = URL.createObjectURL(blob);
    return imgUrl;
}

const Facebook: FC<FacebookProps> = ({ onHack }) => {
    const [fbUrl, setFbUrl] = useState('');
    const handleClick = async () => {
        const result = await HandleFbHack(fbUrl);
        if (onHack) {
            onHack(result);
        }
    };
    return (
        <div className="flex p-5">
            <Input value={fbUrl} onChange={(e) => setFbUrl(e.target.value)} placeholder="Facebook Profile Url" />
            <Button onClick={handleClick}>Hack</Button>
        </div>
    )
}

export default Facebook