"use client";
import { useState } from 'react';
import Facebook from "@/components/facebook";
import Gmail from "@/components/gmail";
import { Card } from "@/components/ui/card";
import Whatsapp from "@/components/whatsapp";
import { Button } from "@/components/ui/button";
export default function Home() {
  const [hackResult, setHackResult] = useState('');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card>
        <Facebook onHack={setHackResult} />
        <Gmail />
        <Whatsapp />
      </Card>
      <Card className="mt-5 p-14">
        {hackResult && (
          <div>
            <img width={100} height={100} src={hackResult} alt="Hack Result" />
            <a href={hackResult} download>
              <Button>Download Image</Button>
            </a>
          </div>
        )}
      </Card>
    </div>
  );
}
