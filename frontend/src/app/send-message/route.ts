import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const entries = Array.from(formData.entries());
  console.log(entries);

  return new NextResponse("Form data received!", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
