// FIXME: proper color themes - better use css vars?
export const colors: Record<string, Record<number, string>> = {
  github: {
    0: "#ebedf0",
    1: "#9be9a8",
    2: "#40c463",
    3: "#30a14e",
    4: "#216e39",
    5: "#0d3321",
  },
  vercel: {
    0: "#e0e0e0",
    1: "#b0b0b0",
    2: "#808080",
    3: "#505050",
    4: "#303030",
    5: "#101010",
  },
  twitter: {
    0: "#f7f9f9",
    1: "#1d9bf0",
    2: "#1a8cd8",
    3: "#177bbf",
    4: "#1466a5",
    5: "#0f4870",
  },
  netflix: {
    0: "#ffebee",
    1: "#ffcdd2",
    2: "#ef9a9a",
    3: "#e57373",
    4: "#ef5350",
    5: "#e53935",
  },
};

export const getActivityLevel = (): 0 | 1 | 2 | 3 | 4 | 5 =>
  Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4 | 5;

// TODO: that should come automatically with the `data` attribute!
export const generateDateRange = (start: Date, end: Date): Date[] => {
  const range: Date[] = [];
  const current = new Date(start);
  const endAt = new Date(end);

  while (current <= endAt) {
    range.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return range;
};
