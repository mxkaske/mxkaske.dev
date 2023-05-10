import { default as NextImage, ImageProps } from "next/image";

// When using Next.js, I'm getting unintented Layout Shifts.
export function Image({
  src,
  ...props // DISCUSS: if props need to be passed through
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // TODO: how to change height?
    <div className="relative h-64 w-full">
      {/* TODO: put a placeholder `src` in here! */}
      <NextImage
        src={src || ""}
        alt=""
        fill={true}
        className={"m-0 object-cover"}
      />
    </div>
  );
}
