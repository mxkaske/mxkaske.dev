import { ImageResponse } from "next/og";
import "@/styles/globals.css"; // FIXME: check if possible to import custom var(--) or utility classes

export const runtime = "edge";

const fontCal = fetch(
  new URL("../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
  const fontCalData = await fontCal;
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "rgb(3, 7, 17)",
          backgroundImage: "linear-gradient(rgb(3, 7, 17), rgb(15, 22, 41))", // tbd: switch color position
        }}
      >
        <div
          tw="absolute inset-0 bg-transparent h-full"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div tw="flex flex-col w-full h-full text-white p-16">
          <div tw="flex-1 flex flex-col items-center justify-center max-w-2xl m-auto">
            <div tw="flex flex-col">
              <div
                style={{ fontFamily: "cal", fontWeight: 600 }} // FIXME: seems not to work
                tw="flex text-6xl tracking-tight mb-4"
              >
                {title ?? "craft.mxkaske.dev"}
              </div>
              <div tw="flex text-4xl" style={{ color: "rgb(127, 142, 163)" }}>
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "cal",
          data: fontCalData,
          weight: 600,
        },
      ],
    },
  );
}
