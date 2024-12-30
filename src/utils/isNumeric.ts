export function isNumeric(value: string | number): boolean {
    const regex = /^[+-]?\d+(\.\d+)?$/;
    return regex.test(value.toString());
  }