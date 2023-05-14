import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const ip = request.ip;
  const searchParams = request.nextUrl.searchParams;
  const hasSlug = searchParams.has("slug");
  const slug = hasSlug ? searchParams.get("slug") : null;

  if (ip) {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip)
    );

    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
      nx: true,
      ex: 24 * 60 * 60, // 1d
    });

    if (!isNew) {
      new NextResponse("Already Increased Counter", { status: 200 });
    }
  }

  await redis.incr(["pageviews", "posts", slug].join(":"));
  return new NextResponse("Increased Counter", { status: 202 });
}
