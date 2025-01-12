"use client";

import * as React from "react";

import { ActivityCalendar } from "./activity-calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { colors, generateDateRange, getActivityLevel } from "./utils";
import { Checkbox } from "@/components/ui/checkbox";

const WEEK_DAY_INDEXES = [0, 1, 2, 3, 4, 5, 6];
const START_DATE = new Date(2025, 0, 2);
const END_DATE = new Date(2025, 9, 1);

export const FormSchema = z.object({
  size: z.number(),
  color: z.string(),
  date: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  gap: z.number(),
  weekDays: z.array(z.number()),
});

export function Container() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      size: 14,
      color: "github",
      date: {
        from: START_DATE,
        to: END_DATE,
      },
      gap: 2,
      weekDays: [1, 3, 5],
    },
  });

  const data = React.useMemo(() => {
    const dateRange = generateDateRange(
      form.watch("date")?.from,
      form.watch("date")?.to
    );

    return dateRange.map((date) => ({
      date,
      value: getActivityLevel(),
    }));
  }, [form.watch("date")?.from, form.watch("date")?.to]);

  return (
    <div className="w-full space-y-4 not-prose">
      <ActivityCalendar
        data={data}
        size={form.watch("size")}
        colors={colors[form.watch("color") as keyof typeof colors]}
        weekDays={form.watch("weekDays")}
        gap={form.watch("gap")}
      />
      <Form {...form}>
        <form className="grid gap-3 md:gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Date Range</FormLabel>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 justify-start font-normal w-full",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormDescription>
                  The date range to display the grid for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(colors).map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Grid theme</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gap</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Gap between cells</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>Cell size</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weekDays"
            render={() => (
              <FormItem className="md:col-span-2">
                <div className="mb-3">
                  <FormLabel className="text-base">Week Days</FormLabel>
                  <FormDescription>
                    Select the days of the week you want to display in the grid.
                  </FormDescription>
                </div>
                {WEEK_DAY_INDEXES.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="weekDays"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {new Date(2024, 0, item).toLocaleString("default", {
                              weekday: "long",
                            })}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
