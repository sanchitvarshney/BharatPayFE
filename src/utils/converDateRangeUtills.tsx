import { Dayjs } from "dayjs";

export const convertDateRange = (dateRange: [Dayjs | null, Dayjs | null]): string | null => {
  // Check if both dates are valid
  if (!dateRange[0] || !dateRange[1]) {
    return null; // Return null if either date is missing
  }

  // Helper function to format Dayjs objects
  const formatDate = (date: Dayjs): string => {
    return date.format("DD-MM-YYYY");
  };

  // Extract and format start and end dates
  const startDate = formatDate(dateRange[0]);
  const endDate = formatDate(dateRange[1]);

  // Combine them in the format "DD-MM-YYYY_to_DD-MM-YYYY"
  return `${startDate}_to_${endDate}`;
};
export const convertDateRangev2 = (dateRange: [Dayjs | null, Dayjs | null]): { from: string; to: string } | null => {
  // Check if both dates are valid
  if (!dateRange[0] || !dateRange[1]) {
    return null; // Return null if either date is missing
  }

  // Helper function to format Dayjs objects
  const formatDate = (date: Dayjs): string => {
    return date.format("DD-MM-YYYY");
  };

  // Extract and format start and end dates
  const startDate = formatDate(dateRange[0]);
  const endDate = formatDate(dateRange[1]);

  // Combine them in the format "DD-MM-YYYY_to_DD-MM-YYYY"
  return { from: startDate, to: endDate };
};
