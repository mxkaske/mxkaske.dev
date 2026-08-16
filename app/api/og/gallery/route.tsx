/* eslint-disable @next/next/no-img-element -- satori renders plain <img>; next/image doesn't exist inside ImageResponse */
import { allPhotos } from "@/.content-collections/generated";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const fontCal = fetch(
  new URL("../../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

const TITLE = "gallery.mxkaske.dev";
const DESCRIPTION = "Never. Stop. Looking.";

const GRID =
  "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)";

const MUTED = "rgb(127, 142, 163)";
const RING = "rgba(255, 255, 255, 0.12)";

/**
 * The box the photo is fitted into, whatever its shape. Height is the card's
 * full inner height; width leaves the title a column it can wrap in. Fitting
 * rather than cropping means a portrait and a landscape get the same treatment
 * — same frame, same type, same composition — and neither loses an edge.
 */
const FRAME = { width: 620, height: 502 };

const RADIUS = 12;

/**
 * The hairline is an inset shadow rather than a border. A border is a second
 * rounded rect laid over the photo's own, and satori rounds the two off by a
 * pixel — visible as the outline drifting away from the corner it should trace.
 * An inset ring is painted on the image's box itself, so there's nothing to
 * misalign.
 */
function framed(
  src: string,
  size: { width: number; height: number },
  marginRight = 0,
) {
  return (
    <img
      src={src}
      width={size.width}
      height={size.height}
      alt=""
      style={{
        objectFit: "cover",
        borderRadius: RADIUS,
        boxShadow: `inset 0 0 0 1px ${RING}`,
        marginRight,
      }}
    />
  );
}

function fit({ width, height }: { width: number; height: number }) {
  const scale = Math.min(FRAME.width / width, FRAME.height / height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export async function GET(request: Request) {
  const fontCalData = await fontCal;
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const photo = slug ? allPhotos.find((p) => p.slug === slug) : undefined;

  const absolute = (src: string) => new URL(src, request.url).href;

  const frame = photo ? fit(photo) : FRAME;

  // Newest first, so the index card shows what a visitor lands on.
  const recent = [...allPhotos]
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "rgb(3, 7, 17)",
          backgroundImage: "linear-gradient(rgb(3, 7, 17), rgb(15, 22, 41))",
        }}
      >
        <div
          tw="absolute inset-0 flex h-full bg-transparent"
          style={{ backgroundImage: GRID, backgroundSize: "50px 50px" }}
        />
        {photo ? (
          <div tw="flex w-full h-full items-center p-16">
            {framed(absolute(photo.image), frame)}
            <div tw="flex flex-col flex-1 justify-center pl-12">
              <div
                tw="flex text-white text-5xl"
                style={{ fontFamily: "cal", fontWeight: 600 }}
              >
                {photo.title}
              </div>
            </div>
          </div>
        ) : (
          <div tw="flex flex-col w-full h-full p-16 justify-center">
            <div
              tw="flex text-6xl text-white"
              style={{ fontFamily: "cal", fontWeight: 600 }}
            >
              {DESCRIPTION}
            </div>
            <div tw="flex mt-4 text-3xl" style={{ color: MUTED }}>
              {TITLE}
            </div>
            <div tw="flex mt-12">
              {recent.map((p, index) => (
                <div key={p.slug} style={{ display: "flex" }}>
                  {framed(
                    absolute(p.image),
                    { width: 341, height: 240 },
                    index < recent.length - 1 ? 24 : 0,
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "cal", data: fontCalData, weight: 600 }],
      headers: {
        "cache-control":
          "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
      },
    },
  );
}
