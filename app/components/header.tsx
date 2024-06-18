import Link from "next/link";

export default function Header() {
  return <>
    <div className="flex flex-row justify-between py-4 px-10  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100">
      <div className="bg-dark-logo">
        <Link href="./">
          <img src="logo.png" className="dark:hidden w-40"></img>
          <img src="dark-logo.png" className="w-0 dark:w-40"></img>
        </Link>
      </div>
      <div>
        <button className="btn btn-neutral btn-sm">Subscribe</button>
      </div>
    </div>
  </>
}