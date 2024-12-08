"use server";
import { redirect } from "next/navigation";

const prefix = process.env.NODE_ENV === "development" ? "/craft" : "";

export async function submitEmail(data: FormData) {
  const email = data.get("email");
  if (email) {
    // connect to database and store email
    await wait(2000);
    redirect(
      `${prefix}/post/server-action-experimental-hook?form=success&email=${email}`
    );
  }
  return;
}

const wait = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};
