// app/action.ts
"use server";
import { promises as fs } from "fs";
import path from "path";

export async function uploadVideoAction(chunk: Blob) {
  if (!chunk) {
    throw new Error("No chunk provided");
  }
  
  const arrayBuffer = await chunk.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadsDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, "captured-video.webm");
  await fs.appendFile(filePath, buffer);

  return "Chunk saved";
}