"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "./styles.css";

const DAYS_PER_WEEK = 7;

export type DataOptions = {
  date: Date;
  label: string;
  value: number;
};

export interface GithubCalendarGridProps {
  /**
   * Data to render
   */
  data: DataOptions[];
  /**
   * Container size of the cells
   */
  size?: number;
  /**
   * Gap between the cells
   */
  gap?: number;
  /**
   * Colors for each value
   */
  colors: Record<number, string>;
  /**
   * Days of the week to show - 0 = Sunday, 1 = Monday, ..., 6 = Saturday
   * @default [1, 3, 5]
   */
  weekDays?: number[];
}

export const ActivityCalendar = ({
  size,
  gap = 2,
  colors,
  weekDays = [1, 3, 5],
  data,
}: GithubCalendarGridProps) => {
  // TODO: check if data is empty
  const startDate = data[0]?.date as Date | undefined;
  const startDay = startDate?.getDay();

  // Add empty boxes at the beginning if startDate is not a Monday
  const paddingDays = startDay === 0 ? 6 : startDay;
  const paddedDays = Array(paddingDays).fill(null).concat(data);

  // Group days into weeks (columns)
  const weeks: (DataOptions | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += DAYS_PER_WEEK) {
    weeks.push(paddedDays.slice(i, i + DAYS_PER_WEEK));
  }

  // Calculate month spans
  const monthHeaders: { name: string; span: number }[] = [];
  let currentMonth: string | null = null;
  let monthStartIndex = 0;

  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = week.find((option) => option?.date);
    if (firstDayOfWeek) {
      const monthName = new Date(firstDayOfWeek.date).toLocaleString(
        "default",
        {
          month: "short",
        }
      );
      if (monthName !== currentMonth) {
        if (currentMonth) {
          monthHeaders.push({
            name: currentMonth,
            span: weekIndex - monthStartIndex,
          });
        }
        currentMonth = monthName;
        monthStartIndex = weekIndex;
      }
    }
  });

  if (currentMonth) {
    monthHeaders.push({
      name: currentMonth,
      span: weeks.length - monthStartIndex,
    });
  }

  return (
    <div
      className="w-full space-y-3"
      style={
        {
          "--gh-grid-size": `${size}px`,
          "--gh-grid-gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <div className="overflow-x-auto w-full">
        <table className="border-spacing-[--gh-grid-gap] border-separate w-max">
          <thead>
            <tr>
              <th />
              {monthHeaders.map((header, index) => (
                <th
                  key={index}
                  colSpan={header.span}
                  className="text-left font-normal text-[length:var(--gh-grid-size)] leading-none"
                >
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Render rows for each day of the week */}
            {Array.from({ length: DAYS_PER_WEEK }).map((_, dayIndex) => {
              return (
                <tr key={dayIndex}>
                  {weekDays.includes(dayIndex) ? (
                    <td className="font-normal text-[length:var(--gh-grid-size)] leading-none p-0">
                      {new Date(2024, 0, dayIndex).toLocaleString("default", {
                        weekday: "short",
                      })}
                    </td>
                  ) : (
                    <td />
                  )}
                  {/* Render each day of the week */}
                  {weeks.map((week, weekIndex) => {
                    if (!week[dayIndex]) {
                      return (
                        <td key={weekIndex} className="size-[--gh-grid-size]" />
                      );
                    }
                    const { value, label } = week[dayIndex];

                    return (
                      <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger
                            style={{
                              backgroundColor: `var(${colors[value]})`,
                            }}
                            asChild
                            suppressHydrationWarning
                          >
                            <td className="rounded border border-border size-[--gh-grid-size]">
                              <span className="sr-only">{label}</span>
                            </td>
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent>{label}</TooltipContent>
                          </TooltipPortal>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex gap-[--gh-grid-gap] justify-end">
        <div className="font-light text-[length:var(--gh-grid-size)] leading-none text-muted-foreground/70 tracking-tighter mr-1">
          Less
        </div>
        {Object.entries(colors).map(([key, entries]) => (
          <div
            key={key}
            className="rounded border border-border size-[--gh-grid-size]"
            style={{ backgroundColor: `var(${entries})` }}
          />
        ))}
        <div className="font-light text-[length:var(--gh-grid-size)] leading-none text-muted-foreground/70 tracking-tighter ml-1">
          More
        </div>
      </div>
    </div>
  );
};
