export function toQueryString(queryParameter: { [key: string]: unknown }): string {
  const parts: string[] = [];
  for (const key in queryParameter) {
    if (!queryParameter.hasOwnProperty(key)) {
      continue;
    }

    const value = queryParameter[key];
    if (value === null || value === undefined) {
      parts.push(key + '=');
    } else if (value instanceof Date) {
      parts.push(key + '=' + encodeURIComponent(value.toISOString()));
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      parts.push(key + '=' + value);
    } else if (typeof value === 'string') {
      parts.push(key + '=' + encodeURIComponent(value));
    } else if (Array.isArray(value)) {
      const arrayQueryString = arrayToQueryString(key, value);
      if (arrayQueryString !== '') {
        parts.push(arrayQueryString);
      }
    } else {
      throw new Error('cannot create querystring for value: ' + JSON.stringify(value));
    }
  }

  return parts.join('&');
}

function arrayToQueryString(paramName: string, items: (string | number | boolean)[]): string {
  if (!items || items.length === 0) {
    return '';
  }

  return paramName + '=' + items.map(item => encodeURIComponent(item)).join('&' + paramName + '=');
}
