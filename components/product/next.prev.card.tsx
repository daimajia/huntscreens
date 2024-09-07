import Logo from "@/components/logo";
import { Link } from "@/i18n/routing";
import { SupportedLangs } from "@/i18n/types";
import { ProductModel, ProductTypes, urlMapper } from "@/types/product.types";
import { useLocale } from "next-intl";

type NextPrevCardProps<T extends ProductTypes> = {
  productType: T
  next?: ProductModel<T> | null,
  prev?: ProductModel<T> | null
}

export default function NextPrevCard<T extends ProductTypes>(props: NextPrevCardProps<T>) {
  const locale = useLocale() as SupportedLangs;
  return (
    <div className="flex flex-col md:flex-row justify-between gap-5">
      {props.prev && (
        <Link href={urlMapper[props.productType](props.prev.id)} className="w-full md:w-1/2">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500 mb-2">← Previous</div>
            <div className="flex flex-row gap-2">
              <div className="w-20 h-20">
                <Logo name={props.prev.name || ""} url={props.prev.thumb_url || ""} className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold mb-1 text-2xl">{props.prev.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{props.prev.translations?.[locale]?.tagline || props.prev.tagline}</p>
              </div>
            </div>
          </div>
        </Link>
      )}
      {props.next && (
        <Link href={urlMapper[props.productType](props.next.id)} className="w-full md:w-1/2">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500 mb-2 text-right">Next →</div>
            <div className="flex flex-row gap-2">
              <div className="w-20 h-20">
                <Logo name={props.next.name || ""} url={props.next.thumb_url || ""} className="w-full h-full" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold mb-1 text-2xl">{props.next.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{props.next.translations?.[locale]?.tagline || props.next.tagline}</p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}