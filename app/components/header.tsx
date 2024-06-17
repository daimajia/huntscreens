export default function Header() {
  return <>
    <div className="flex flex-row justify-between py-4 px-10  sticky top-0 z-50 border-b dark:border-none  navbar bg-base-100">
      <div>
        HuntScreens
      </div>
      <div>
        <button className="btn btn-neutral btn-sm">Subscribe</button>
      </div>
    </div>
  </>
}