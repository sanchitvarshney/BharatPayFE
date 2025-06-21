/**
 * Utility functions for number formatting
 */

/**
 * Formats a number with commas after every 3 digits from right, showing decimals only when they exist
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  // Convert to number if it's a string
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return "0";
  }

  // Check if the number has decimal places
  const hasDecimals = numValue % 1 !== 0;

  if (hasDecimals) {
    // If it has decimals, format to 2 decimal places
    const formattedValue = numValue.toFixed(2);
    const [wholePart, decimalPart] = formattedValue.split(".");
    const formattedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formattedWholePart}.${decimalPart}`;
  } else {
    // If it's a whole number, just add commas
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

/**
 * Parses a formatted number string back to a number
 * @param value - The formatted number string (e.g. "1,234" or "1,234.56")
 * @returns The parsed number
 */
export const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;

  // Remove all commas and convert to number
  const cleanValue = value.replace(/,/g, "");
  const num = parseFloat(cleanValue);

  return isNaN(num) ? 0 : num;
};

/**
 * Formats a number as currency with commas after every 3 digits, showing decimals only when they exist
 * @param value - The number to format
 * @param currency - Currency code (default: 'INR')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  currency: string = "INR"
): string => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "0";
  }

  // Format the number with commas
  const formattedNumber = formatNumber(numValue);

  // Add currency symbol
  return currency === "INR" ? `₹${formattedNumber}` : `${formattedNumber}`;
};
