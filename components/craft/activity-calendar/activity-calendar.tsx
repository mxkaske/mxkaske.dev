"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { generateDateRange, getActivityLevel } from "./utils";

const DAYS_PER_WEEK = 7;

type DataOptions = {
  date: Date;
  value: number;
};

interface GithubCalendarGridProps<T extends DataOptions> {
  data: T[];
  startDate: Date;
  endDate: Date;
  /**
   * Container size of the grid
   */
  size?: number;
  /**
   * Gap between the cells
   */
  gap?: number;
  /**
   * Colors for each value
   */
  colors: Record<keyof T["value"], string>;
  /**
   * Days of the week to show - 0 = Sunday, 1 = Monday, ..., 6 = Saturday
   * @default [1, 3, 5]
   */
  weekDays?: number[];
}

export const ActivityCalendar = ({
  startDate = new Date("2025-01-01"),
  endDate = new Date("2025-07-31"),
  size,
  gap = 2,
  colors,
  weekDays = [1, 3, 5],
}: {
  startDate?: Date;
  endDate?: Date;
  size: number;
  gap?: number;
  colors: Record<0 | 1 | 2 | 3 | 4 | 5, string>;
  weekDays?: number[];
}) => {
  const daysRange = generateDateRange(startDate, endDate);

  // Get the day of the week for the startDate (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const startDay = startDate.getDay();

  // Add empty boxes at the beginning if startDate is not a Monday
  const paddingDays = startDay === 0 ? 6 : startDay;
  const paddedDays = Array(paddingDays).fill(null).concat(daysRange);

  // Group days into weeks (columns)
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += DAYS_PER_WEEK) {
    weeks.push(paddedDays.slice(i, i + DAYS_PER_WEEK));
  }

  // Calculate month spans
  const monthHeaders: { name: string; span: number }[] = [];
  let currentMonth: string | null = null;
  let monthStartIndex = 0;

  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = week.find((day) => day);
    if (firstDayOfWeek) {
      const monthName = new Date(firstDayOfWeek).toLocaleString("default", {
        month: "short",
      });
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
      <div className="overflow-x-scroll w-full">
        <table
          // fix overflow: w-full
          className="border-spacing-[--gh-grid-gap] border-separate"
        >
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
                    const activity = getActivityLevel();
                    if (!week[dayIndex]) {
                      return (
                        <td key={weekIndex} className="size-[--gh-grid-size]" />
                      );
                    }

                    return (
                      <TooltipProvider key={weekIndex}>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <td
                              className="rounded border size-[--gh-grid-size]"
                              style={{
                                backgroundColor: week[dayIndex]
                                  ? colors[activity]
                                  : "transparent",
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipPortal>
                            <TooltipContent>
                              {activity} activity on{" "}
                              {new Date(week[dayIndex]).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </TooltipContent>
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
        {Object.entries(colors).map(([key, value]) => (
          <div
            key={key}
            className="rounded border size-[--gh-grid-size]"
            style={{ backgroundColor: value }}
          />
        ))}
        <div className="font-light text-[length:var(--gh-grid-size)] leading-none text-muted-foreground/70 tracking-tighter ml-1">
          More
        </div>
      </div>
    </div>
  );
};
