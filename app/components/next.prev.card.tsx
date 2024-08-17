import { ProductModel, ProductTypes, thumbailGetter, urlMapper } from "../types/product.types";

type NextPrevCardProps<T extends ProductTypes> = {
  productType: T
  next?: ProductModel<T> | null,
  prev?: ProductModel<T> | null
}

export default function NextPrevCard<T extends ProductTypes>(props: NextPrevCardProps<T>) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-5">
      {props.prev && (
        <a href={urlMapper[props.productType](props.prev.id)} className="w-full md:w-1/2">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500 mb-2">← Previous</div>
            <div className="flex flex-row gap-2">
              <img alt={`${props.prev.name} thumbnail`} loading="lazy" src={thumbailGetter(props.productType, props.prev) || ""} className="w-20 rounded-full border" />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold mb-1 text-2xl">{props.prev.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{props.prev.tagline}</p>
              </div>
            </div>
          </div>
        </a>
      )}
      {props.next && (
        <a href={urlMapper[props.productType](props.next.id)} className="w-full md:w-1/2">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500 mb-2 text-right">Next →</div>
            <div className="flex flex-row gap-2">
              <img alt={`${props.next.name} thumbnail`} loading="lazy" src={thumbailGetter(props.productType, props.next) || ""} className="w-20 rounded-full border" />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold mb-1 text-2xl">{props.next.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{props.next.tagline}</p>
              </div>
            </div>
          </div>
        </a>
      )}
    </div>
  )
}