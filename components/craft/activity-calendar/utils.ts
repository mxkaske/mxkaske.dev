// FIXME: proper color themes - better use css vars?
export const colors = {
  github: {
    "--activity-0": "#ebedf0",
    "--activity-1": "#9be9a8",
    "--activity-2": "#40c463",
    "--activity-3": "#30a14e",
    "--activity-4": "#216e39",
    "--activity-5": "#0d3321",
  },
  vercel: {
    "--activity-0": "#e0e0e0",
    "--activity-1": "#b0b0b0",
    "--activity-2": "#808080",
    "--activity-3": "#505050",
    "--activity-4": "#303030",
    "--activity-5": "#101010",
  },
  twitter: {
    "--activity-0": "#f7f9f9",
    "--activity-1": "#1d9bf0",
    "--activity-2": "#1a8cd8",
    "--activity-3": "#177bbf",
    "--activity-4": "#1466a5",
    "--activity-5": "#0f4870",
  },
  netflix: {
    "--activity-0": "#ffebee",
    "--activity-1": "#ffcdd2",
    "--activity-2": "#ef9a9a",
    "--activity-3": "#e57373",
    "--activity-4": "#ef5350",
    "--activity-5": "#e53935",
  },
} satisfies Record<string, Record<string, string>>;

export const getActivityLevel = (): 0 | 1 | 2 | 3 | 4 | 5 =>
  Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4 | 5;

// TODO: that should come automatically with the `data` attribute!
export const generateDateRange = (start?: Date, end?: Date): Date[] => {
  const range: Date[] = [];
  if (!start) return [];
  const current = new Date(start);
  const endAt = new Date(end ?? current);

  while (current <= endAt) {
    range.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return range;
};
