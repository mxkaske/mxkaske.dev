// FIXME: proper color themes - better use css vars?
export const colors = {
  github: {
    0: "--activity-github-0",
    1: "--activity-github-1",
    2: "--activity-github-2",
    3: "--activity-github-3",
    4: "--activity-github-4",
    5: "--activity-github-5",
  },
  vercel: {
    0: "--activity-vercel-0",
    1: "--activity-vercel-1",
    2: "--activity-vercel-2",
    3: "--activity-vercel-3",
    4: "--activity-vercel-4",
    5: "--activity-vercel-5",
  },
  twitter: {
    0: "--activity-twitter-0",
    1: "--activity-twitter-1",
    2: "--activity-twitter-2",
    3: "--activity-twitter-3",
    4: "--activity-twitter-4",
    5: "--activity-twitter-5",
  },
  netflix: {
    0: "--activity-netflix-0",
    1: "--activity-netflix-1",
    2: "--activity-netflix-2",
    3: "--activity-netflix-3",
    4: "--activity-netflix-4",
    5: "--activity-netflix-5",
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
