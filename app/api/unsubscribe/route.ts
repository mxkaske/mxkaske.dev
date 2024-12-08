import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  const searchParms = req.nextUrl.searchParams;
  const email = searchParms.get("email");

  if (email) {
    await redis.lrem("newsletter", 1, email);
    return new Response(`Unsubscribed "${email}".`);
  }

  return new Response("Please provide an email to unsubscribe.");
}
