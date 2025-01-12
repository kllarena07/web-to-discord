import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

  if (!S3_BUCKET_NAME || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
    return new NextResponse("Error 505: Server config.", {
      status: 505,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const formData = await request.formData();
  const entries = Array.from(formData.entries());

  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY,
    },
  });

  if (!s3Client) {
    return new NextResponse("Error initializing S3 client", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    for (const [key, value] of entries) {
      if (key === "files" && value instanceof File) {
        const file = value;
        const uploadParams = {
          Bucket: S3_BUCKET_NAME,
          Key: file.name,
          Body: Buffer.from(await file.arrayBuffer()),
        };

        await s3Client.send(new PutObjectCommand(uploadParams));
      }
    }
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return new NextResponse("Error uploading file to S3", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Form data received!", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
