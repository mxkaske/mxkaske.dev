export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(date);
}

export function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    year: "numeric",
    month: "long",
  }).format(date);
}
