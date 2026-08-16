/* eslint-disable @next/next/no-img-element -- satori renders plain <img>; next/image doesn't exist inside ImageResponse */
import { allPhotos } from "@/.content-collections/generated";
import { ImageResponse } from "next/og";

export const runtime = "edge";

const fontCal = fetch(
  new URL("../../../../public/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

const GRID =
  "linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)";

const CANVAS = { width: 1200, height: 630 };

/**
 * The photo bleeds off the top, left and bottom edges: it is always the card's
 * full height, and its width follows from its own shape. A portrait therefore
 * takes a narrow strip and leaves the title a wide column; a landscape takes
 * most of the card and leaves a slim one. The title column reads differently in
 * each case, which is the point — the photo decides the composition.
 *
 * The one exception: below COLUMN_MIN the title has nowhere left to go, so a
 * very wide photo is cropped rather than allowed to squeeze it further.
 */
const COLUMN_MIN = 370;

const PADDING = { x: 48, y: 56 };

/** Column width the photo leaves behind, honouring COLUMN_MIN. */
function layout({ width, height }: { width: number; height: number }) {
  const photo = Math.min(
    Math.round((CANVAS.height * width) / height),
    CANVAS.width - COLUMN_MIN,
  );
  return { photo, column: CANVAS.width - photo };
}

/**
 * Satori has no way to tell us how wide a rendered string came out, so the size
 * is decided up front: wrap the title at each candidate size and take the first
 * pairing that holds. CalSans SemiBold measures ~0.55em per character in mixed
 * case — rounded down, so a title errs towards a step smaller rather than
 * overflowing the column.
 *
 * The order encodes the preference: as large as possible over two lines, and
 * only a longer title is allowed to shrink further and take a third or fourth.
 */
const FITS = [
  { lines: 2, sizes: [64, 56, 48] },
  { lines: 3, sizes: [48, 40] },
  { lines: 4, sizes: [40, 32] },
];
const AVG_CHAR = 0.55;

function fitTitle(title: string, width: number) {
  for (const { lines, sizes } of FITS) {
    const size = sizes.find((size) => {
      const perLine = Math.floor(width / (size * AVG_CHAR));
      return perLine > 0 && lineCount(title, perLine) <= lines;
    });
    if (size) return size;
  }
  return 32;
}

function lineCount(text: string, perLine: number) {
  let lines = 1;
  let used = 0;
  for (const word of text.split(" ")) {
    const next = used ? used + 1 + word.length : word.length;
    if (used && next > perLine) {
      lines++;
      used = word.length;
    } else {
      used = next;
    }
  }
  return lines;
}

export async function GET(request: Request) {
  const fontCalData = await fontCal;
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const photo = slug ? allPhotos.find((p) => p.slug === slug) : undefined;

  if (!photo) return new Response("Not found", { status: 404 });

  const { photo: photoWidth, column } = layout(photo);
  const titleSize = fitTitle(photo.title, column - PADDING.x * 2);

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
        <img
          src={new URL(photo.image, request.url).href}
          width={photoWidth}
          height={CANVAS.height}
          alt=""
          style={{ objectFit: "cover" }}
        />
        <div
          tw="flex flex-col justify-end"
          style={{
            width: column,
            padding: `${PADDING.y}px ${PADDING.x}px`,
          }}
        >
          <div
            tw="flex text-white"
            style={{
              fontFamily: "cal",
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.1,
            }}
          >
            {photo.title}
          </div>
        </div>
      </div>
    ),
    {
      width: CANVAS.width,
      height: CANVAS.height,
      fonts: [{ name: "cal", data: fontCalData, weight: 600 }],
      headers: {
        "cache-control":
          "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
      },
    },
  );
}
