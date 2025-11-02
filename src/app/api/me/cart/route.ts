import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

const BFF = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  const res = await fetch(`${BFF}/cart`, {
    credentials: "include",
    headers: {
      cookie: cookies().toString(),
      authorization: headers().get("authorization") ?? "",
    },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${BFF}/cart`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: cookies().toString(),
      authorization: headers().get("authorization") ?? "",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
