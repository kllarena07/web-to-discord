import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { fdToMessageReq, scheduleLambdaInvocation } from "./helpers";

export async function POST(request: Request) {
  const AWS_REGION = process.env.AWS_REGION;
  const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
  const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;

  const serverConfigCorrectly =
    !AWS_REGION ||
    !S3_BUCKET_NAME ||
    !S3_ACCESS_KEY_ID ||
    !S3_SECRET_ACCESS_KEY;

  if (serverConfigCorrectly) {
    return new NextResponse("Error 505: Server config.", {
      status: 505,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const formData = await request.formData();
  const messageReq = fdToMessageReq(formData);

  const s3Client = new S3Client({
    region: AWS_REGION,
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

  const bucketedImgURLs = [];

  try {
    for (const file of messageReq.files) {
      const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: file.name,
        Body: Buffer.from(await file.arrayBuffer()),
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${file.name}`;
      bucketedImgURLs.push(fileUrl);
    }
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return new NextResponse("Error uploading file to S3", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const scheduleMetaData = {
    message: messageReq.message,
    dateTime: messageReq.dateTime,
    attachmentURLs: bucketedImgURLs,
  };

  await scheduleLambdaInvocation(scheduleMetaData);

  return new NextResponse("Scheduled message", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
