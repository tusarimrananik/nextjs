// app/VideoCapture.tsx
"use client";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadVideoAction } from "./action";

export default function VideoCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const mutation = useMutation({
    mutationFn: async (chunk: Blob) => {
      return await uploadVideoAction(chunk);
    }
  });





  return (
    <div>
      <h2>Recording Video...</h2>
    </div>
  );
}