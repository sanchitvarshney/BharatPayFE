const numberFormatter = new Intl.NumberFormat("en-IN");

export const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const formatNumber = (value: unknown) => numberFormatter.format(toNumber(value));

export const sumBy = <T>(rows: T[], get: (row: T) => unknown) =>
  rows.reduce((sum, row) => sum + toNumber(get(row)), 0);

export const sortHourColumns = (columns: string[]) =>
  [...columns].sort(
    (a, b) => parseInt(a.split("-")[0], 10) - parseInt(b.split("-")[0], 10),
  );
