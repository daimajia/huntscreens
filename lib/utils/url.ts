export function removeUrlParams(url: string, params: string[] | string): string {
  const urlObject = new URL(url);
  const paramsArray = Array.isArray(params) ? params : [params];
  paramsArray.forEach(param => {
    urlObject.searchParams.delete(param);
  });
  return urlObject.toString();
}