import { removeAudience } from "@/lib/resend";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";


export default async function UnsubscribePage({ params }: { params: { contactId: string } }) {
  const res = await removeAudience(params.contactId)
  const t = await getTranslations("Email");
  return <>
    <div className="flex flex-row justify-center items-center">
      <div className=" m-10">
        {res.error ? <>
          Got an error, please contact admin.
        </> :
          <>Successfully Unsubscribed <Link href="/" className=" text-blue-500">Back to HuntScreens.com</Link></>
        }
      </div>
    </div>
  </>
}