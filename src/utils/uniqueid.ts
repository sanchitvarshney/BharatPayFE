// utils/generateUniqueId.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique ID using the uuid library.
 * @returns {string} A unique identifier.
 */
export function generateUniqueId(): string {
  return uuidv4();
}
