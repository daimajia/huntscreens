export function removeUrlParams(url: string, params: string[] | string): string {
  const urlObject = new URL(url);
  const paramsArray = Array.isArray(params) ? params : [params];
  paramsArray.forEach(param => {
    urlObject.searchParams.delete(param);
  });
  return urlObject.toString();
}

export function addUtmParams(url: string, params: { [key: string]: string }): string {
  const urlObj = new URL(url);
  
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });

  return urlObj.toString();
}
