import { removeAudience } from "@/lib/resend";
import Link from "next/link";

export default async function UnsubscribePage({ params }: { params: { contactId: string } }) {
  const res = await removeAudience(params.contactId)

  return <>
    <div className="flex flex-row justify-center items-center">
      <div className=" m-10">
        {res.error ? <>
          Got an error, please contact admin.
        </> :
          <>Successfully Unsubscribed <Link href="https://huntscreens.com" className=" text-blue-500">Back to HuntScreens.com</Link></>
        }
      </div>
    </div>
  </>
}