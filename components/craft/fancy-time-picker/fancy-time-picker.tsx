"use client";

import * as React from "react";
import { setHours, setMinutes, setSeconds } from "date-fns";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FancyTimePickerProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  config?: {
    hours?: boolean;
    minutes?: boolean;
    seconds?: boolean;
    is12Hour?: boolean;
  };
}

/**
 * FIXME: ref.focus are wrong when selecting different configs
 */
const defaultConfig = {
  hours: true,
  minutes: true,
  seconds: true,
  is12Hour: false,
};

export function FancyTimePicker({
  date,
  setDate,
  config = defaultConfig,
}: FancyTimePickerProps) {
  const [flag, setFlag] = React.useState<boolean>(false);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);

  /**
   * allow the user to enter the second digit within 2 seconds
   * otherwise start again with entering first digit
   */
  React.useEffect(() => {
    if (flag) {
      const timer = setTimeout(() => {
        setFlag(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [flag]);

  const _12Hours = (date?.getHours() || 12) % 13;

  /**
   * calculated hours, minutes and seconds from date
   */
  const hours = getValidHour(
    String(config.is12Hour ? _12Hours : date?.getHours())
  );
  const minutes = getValidMinuteOrSecond(String(date?.getMinutes()));
  const seconds = getValidMinuteOrSecond(String(date?.getSeconds()));

  /**
   * Overwriting the key down event for the hours input
   * "0-9": set the hours value, formatted as string '00' - '23'
   * "ArrowRight": focus 'minutes' input
   * "ArrowUp": increment hours by 1
   * "ArrowDown": decrement hours by 1
   * "Tab": focus 'minutes' input
   */
  function handleHoursKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") return;
    e.preventDefault();
    if (e.key === "ArrowRight") minuteRef?.current?.focus();
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      const newValue = getValidArrow({
        value: hours,
        min: config.is12Hour ? 1 : 0,
        max: config.is12Hour ? 12 : 23,
        step: e.key === "ArrowUp" ? 1 : -1,
      });
      console.log({ newValue });
      if (flag) setFlag(false);
      setDate(
        setHours(
          date || new Date(),
          Number(getValidHour(newValue, config.is12Hour))
        )
      );
    }
    if (e.key >= "0" && e.key <= "9") {
      const newValue = !flag ? "0" + e.key : hours.slice(1, 2) + e.key;
      if (flag) minuteRef?.current?.focus();
      setFlag((prev) => !prev);
      setDate(
        setHours(
          date || new Date(),
          Number(getValidHour(newValue, config.is12Hour))
        )
      );
    }
  }

  /**
   * Overwriting the key down event for the hours input
   * "0-9": set the hours value, formatted as string '00' - '59'
   * "ArrowLeft": focus 'seconds' input
   * "ArrowRight": focus 'seconds' input
   * "ArrowUp": increment hours by 1
   * "ArrowDown": decrement hours by 1
   * "Tab": focus 'minutes' input
   */
  function handleMinutesKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") return;
    e.preventDefault();
    if (e.key === "ArrowLeft") hourRef?.current?.focus();
    if (e.key === "ArrowRight") secondRef?.current?.focus();
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      const newValue = getValidArrow({
        value: minutes,
        min: 0,
        max: 59,
        step: e.key === "ArrowUp" ? 1 : -1,
      });
      if (flag) setFlag(false);
      setDate(
        setMinutes(date || new Date(), Number(getValidMinuteOrSecond(newValue)))
      );
    }
    if (e.key >= "0" && e.key <= "9") {
      const newValue = !flag ? "0" + e.key : minutes.slice(1, 2) + e.key;
      if (flag) secondRef?.current?.focus();
      setFlag((prev) => !prev);
      setDate(
        setMinutes(date || new Date(), Number(getValidMinuteOrSecond(newValue)))
      );
    }
  }

  /**
   * Overwriting the key down event for the hours input
   * "0-9": set the hours value, formatted as string '00' - '59'
   * "ArrowLeft": focus 'seconds' input
   * "ArrowRight": focus 'seconds' input
   * "ArrowUp": increment hours by 1
   * "ArrowDown": decrement hours by 1
   * "Tab": focus 'minutes' input
   */
  function handleSecondsKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") return;
    e.preventDefault();
    if (e.key === "ArrowLeft") minuteRef?.current?.focus();
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      const newValue = getValidArrow({
        value: seconds,
        min: 0,
        max: 59,
        step: e.key === "ArrowUp" ? 1 : -1,
      });
      if (flag) setFlag(false);
      setDate(
        setSeconds(date || new Date(), Number(getValidMinuteOrSecond(newValue)))
      );
    }
    if (e.key >= "0" && e.key <= "9") {
      const newValue = !flag ? "0" + e.key : seconds.slice(1, 2) + e.key;
      setFlag((prev) => !prev);
      setDate(
        setSeconds(date || new Date(), Number(getValidMinuteOrSecond(newValue)))
      );
    }
  }

  return (
    <div className="flex items-end gap-2">
      {config.hours ? (
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <Input
            ref={hourRef}
            id="hours"
            name="hours"
            className="w-[46px] font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
            value={hours}
            onChange={(e) => e.preventDefault()}
            type="number"
            inputMode="decimal"
            onKeyDown={handleHoursKeyDown}
          />
        </div>
      ) : null}
      {config.minutes ? (
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <Input
            ref={minuteRef}
            id="minutes"
            name="minutes"
            className="w-[46px] font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
            value={minutes}
            type="number"
            inputMode="decimal"
            onChange={(e) => e.preventDefault()}
            onKeyDown={handleMinutesKeyDown}
          />
        </div>
      ) : null}
      {config.seconds ? (
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="text-xs">
            Seconds
          </Label>
          <Input
            ref={secondRef}
            id="seconds"
            name="seconds"
            className="w-[46px] font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
            value={seconds}
            type="number"
            inputMode="decimal"
            onChange={(e) => e.preventDefault()}
            onKeyDown={handleSecondsKeyDown}
          />
        </div>
      ) : null}
      {config.is12Hour ? (
        <div className="flex h-10 items-center">
          <Select defaultValue={date && date?.getHours() > 12 ? "pm" : "am"}>
            <SelectTrigger className="w-[65px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="am">AM</SelectItem>
              <SelectItem value="pm">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}

/**
 * regular expression to check for valid hour format (01-23)
 * or (01-12) if is12Hour is true
 */
function isValidHour(value: string, is12Hour = false) {
  if (is12Hour) return /^(0[1-9]|1[0-2])$/.test(value);
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

function getValidHour(value: string, is12Hour = false) {
  if (isValidHour(value, is12Hour)) return value;

  const max = is12Hour ? 12 : 23;
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    // Ensure the value stays within the valid hour range (0 to 23)
    if (numericValue > max) {
      numericValue = max;
    }

    // Convert the numeric value back to a string with leading zeros
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;

  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    // Ensure the value stays within the valid minute range (0 to 59)
    if (numericValue > 59) {
      numericValue = 59;
    }

    // Convert the numeric value back to a string with leading zeros
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

function getValidArrow({
  value,
  min,
  max,
  step,
}: {
  value: string;
  min: number;
  max: number;
  step: number;
}) {
  // Convert the current value to an integer for arithmetic operations
  var numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    // Increment or decrement the numeric value
    numericValue += step;

    // Ensure the value stays within the valid hour range (0 to 23)
    if (numericValue < min) {
      numericValue = max;
    } else if (numericValue > max) {
      numericValue = min;
    }

    // Convert the numeric value back to a string with leading zeros
    var newValue = numericValue.toString().padStart(2, "0");

    return newValue;
  }

  return "00";
}
