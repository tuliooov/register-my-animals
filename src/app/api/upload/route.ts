import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: "Filename and file content are required." },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Resize image to 300x300
    const resizedBuffer = await sharp(buffer)
      .resize(300, 300, { fit: "cover" })
      .toBuffer();

    const blob = await put(filename, resizedBuffer, {
      access: "public",
      token: process.env.BLOB_ANIMAL_READ_WRITE_TOKEN, // ou token direto aqui
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 }
    );
  }
}
