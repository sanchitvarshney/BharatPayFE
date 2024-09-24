import { camelCase } from 'lodash';

function isObject(obj: any): obj is Record<string, any> {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (isObject(obj)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = camelCase(key);
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as Record<string, any>);
  }
  return obj;
}




