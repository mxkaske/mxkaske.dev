"use server";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function subscribe({ email }: { email: string }) {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  if (typeof email !== "string")
    return { success: false, message: "Wrong input type." };

  const valid = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email);
  if (!valid) return { success: false, message: "Invalid email." };

  const position = await redis.lpos("newsletter", email);

  if (position !== null && position !== -1) {
    return { success: true, message: "Already subscribed." };
  }

  await redis.lpush("newsletter", email.toLowerCase());

  return { success: true };
}

export async function unsubscribe({ email }: { email: string }) {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  if (typeof email !== "string")
    return { success: false, message: "Wrong input type." };

  const valid = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email);
  if (!valid) return { success: false, message: "Invalid email." };

  await redis.lrem("newsletter", 1, email.toLowerCase());

  return { success: true };
}
