// FIXME: proper color themes - better use css vars?
export const colors = {
  github: {
    0: "var(--activity-github-0)",
    1: "var(--activity-github-1)",
    2: "var(--activity-github-2)",
    3: "var(--activity-github-3)",
    4: "var(--activity-github-4)",
    5: "var(--activity-github-5)",
  },
  vercel: {
    0: "var(--activity-vercel-0)",
    1: "var(--activity-vercel-1)",
    2: "var(--activity-vercel-2)",
    3: "var(--activity-vercel-3)",
    4: "var(--activity-vercel-4)",
    5: "var(--activity-vercel-5)",
  },
  twitter: {
    0: "var(--activity-twitter-0)",
    1: "var(--activity-twitter-1)",
    2: "var(--activity-twitter-2)",
    3: "var(--activity-twitter-3)",
    4: "var(--activity-twitter-4)",
    5: "var(--activity-twitter-5)",
  },
  netflix: {
    0: "var(--activity-netflix-0)",
    1: "var(--activity-netflix-1)",
    2: "var(--activity-netflix-2)",
    3: "var(--activity-netflix-3)",
    4: "var(--activity-netflix-4)",
    5: "var(--activity-netflix-5)",
  },
} satisfies Record<string, Record<string, string>>;

export const getActivityLevel = (): 0 | 1 | 2 | 3 | 4 | 5 => {
  const random = Math.random();
  if (random < 0.7) {
    return Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4 | 5;
  }
  return Math.ceil(Math.random() * 5) as 0 | 1 | 2 | 3 | 4 | 5;
};

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
