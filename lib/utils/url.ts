export function prettyURL(url: string) {
  const u = new URL(url);
  if(u.search === "?ref=producthunt"){
    u.search = "";
    return u.toString();
  }else{
    url = url.replace('&ref=producthunt', '');
    return url;
  }
}