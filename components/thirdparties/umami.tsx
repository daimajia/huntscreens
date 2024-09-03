import Script from "next/script";

export default function Umami() {
  const umami = process.env.UMAMI_ID;
  if (umami) {
    return <>
      <Script src="https://umami.huntscreens.com/script.js" defer async strategy="lazyOnload" data-website-id={umami} />
    </>
  } else {
    return <></>
  }
}