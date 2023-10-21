"use client";

import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export function FancyDateTimePicker() {
  const [date, setDate] = React.useState<Date>();
  const [flag, setFlag] = React.useState<boolean>(false);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  /**
   * allow the user to enter the second digit within 2 seconds
   * otherwise start again from entering first digit
   */
  React.useEffect(() => {
    if (flag) {
      const timer = setTimeout(() => {
        setFlag(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [flag]);

  const hours = setValidHour(String(date?.getHours()));
  const minutes = setValidMinute(String(date?.getMinutes()));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <Separator />
        <div className="flex gap-4 p-3">
          <div className="flex gap-2">
            <Input
              ref={hourRef}
              className="w-[44px] font-mono tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none"
              value={hours}
              onChange={(e) => e.preventDefault()}
              type="number"
              onKeyDown={(e) => {
                if (e.key !== "Tab") {
                  e.preventDefault();
                  let newValue: string;
                  if (isDigit(e.key)) {
                    if (!flag) {
                      newValue = "0" + e.key;
                      setFlag(true);
                    } else {
                      newValue = hours.slice(1, 2) + e.key;
                      setFlag(false);
                      // focus the minute input after the second digit is entered
                      minuteRef?.current?.focus();
                    }
                    setDate(
                      setHours(
                        date || new Date(),
                        Number(setValidHour(newValue))
                      )
                    );
                  }
                  if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                    newValue = getValidArrow({
                      value: hours,
                      min: 0,
                      max: 23,
                      step: e.key === "ArrowUp" ? 1 : -1,
                    });
                    setDate(
                      setHours(
                        date || new Date(),
                        Number(setValidHour(newValue))
                      )
                    );
                  }
                  if (e.key === "ArrowRight") {
                    minuteRef?.current?.focus();
                  }
                }
              }}
            />
            <Input
              ref={minuteRef}
              className="w-[44px] font-mono tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none"
              value={minutes}
              type="number"
              onChange={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key !== "Tab") {
                  e.preventDefault();
                  let newValue: string;
                  if (isDigit(e.key)) {
                    if (!flag) {
                      newValue = "0" + e.key;
                      setFlag(true);
                    } else {
                      newValue = minutes.slice(1, 2) + e.key;
                      setFlag(false);
                    }

                    setDate(
                      setMinutes(
                        date || new Date(),
                        Number(setValidMinute(newValue))
                      )
                    );
                  }
                  if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                    newValue = getValidArrow({
                      value: minutes,
                      min: 0,
                      max: 59,
                      step: e.key === "ArrowUp" ? 1 : -1,
                    });

                    setDate(
                      setMinutes(
                        date || new Date(),
                        Number(setValidMinute(newValue))
                      )
                    );
                  }
                  if (e.key === "ArrowLeft") {
                    hourRef?.current?.focus();
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-1 items-center justify-end">
            {date !== undefined ? (
              <Button variant="ghost" onClick={() => setDate(undefined)}>
                Clear <X className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function isDigit(value: string) {
  return /^\d$/.test(value);
}

function isValidHour(value: string) {
  // regular expression to check for valid hour format (01-23)
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

function setValidHour(value: string) {
  if (isValidHour(value)) return value;

  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    // Ensure the value stays within the valid hour range (0 to 23)
    if (numericValue > 23) {
      numericValue = 23;
    }

    // Convert the numeric value back to a string with leading zeros
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

function isValidMinute(value: string) {
  // regular expression to check for valid minute format (00-59)
  return /^[0-5][0-9]$/.test(value);
}

function setValidMinute(value: string) {
  if (isValidMinute(value)) return value;

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
