export default function Header() {
  return <>
    <div className="flex flex-row justify-between py-4 px-10 border-b sticky top-0 z-50 bg-white">
        <div>
          Logo
        </div>
        <div>
          <button className="btn btn-neutral btn-sm">Subscribe</button>
        </div>
    </div>
  </>
}