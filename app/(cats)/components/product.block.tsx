import useSWR from "swr";
import Loading from "../../components/list.loading";
import MiniScreenshotCard, { MiniCardMetadata } from "../../components/screenshot.card";
import { Producthunt, YC } from "@/db/schema";
import { ProductTypes } from "@/app/types/product.types";

type ApiReturnDataType<T> = T extends "ph" ? Producthunt : YC;

interface PageBlockProps<T extends ProductTypes> {
  cardType: T,
  endpoint_url: string,
}


export default function ProductBlock<T extends ProductTypes>({ cardType, endpoint_url }: PageBlockProps<T>) {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, isLoading } = useSWR<ApiReturnDataType<T>[]>(endpoint_url, fetcher);

  function generatedata(item: ApiReturnDataType<T>): MiniCardMetadata<T> {
    if (cardType === "ph") {
      const ph = item as Producthunt;
      return {
        id: ph.id,
        name: ph.name || "",
        tagline: ph.tagline,
        website: ph.website || "",
        uuid: ph.uuid || "",
        thumbnail: ph.thumbnail?.url || "",
        votesCount: ph.votesCount || 0,
        producthunt_url: ph.url || ""
      } as MiniCardMetadata<T>
    } else {
      const company = item as YC;
      return {
        id: company.id,
        name: company.name,
        tagline: company.tagline,
        website: company.website,
        uuid: company.uuid,
        thumbnail: company.thumb_url
      } as MiniCardMetadata<T>
    }
  }

  return <>
    {isLoading && <Loading />}
    {!isLoading && data && <>
      <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
        {data.map((item) => <MiniScreenshotCard key={item.id} cardType={cardType} product={generatedata(item)} />)}
      </div>
    </>}
  </>
}