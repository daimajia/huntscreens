import useSWR from "swr";
import Loading from "../../components/list.loading";
import MiniScreenshotCard, { MiniCardMetadata } from "../../components/screenshot.card";
import { IndieHackers, Producthunt, Taaft, YC } from "@/db/schema";
import { ApiReturnDataType, ProductTypes } from "@/app/types/product.types";
import { differenceInHours } from "date-fns";

interface PageBlockProps<T extends ProductTypes> {
  cardType: T,
  endpoint_url: string,
}

function generatedata<T extends ProductTypes>(cardType: T, item: ApiReturnDataType<T>): MiniCardMetadata<T> {
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
      producthunt_url: ph.url || "",
      new: differenceInHours(new Date(), new Date(ph.added_at || new Date())) <= 24
    } as MiniCardMetadata<T>
  } else if (cardType === "yc") {
    const company = item as YC;
    return {
      ...company,
      thumbnail: company.thumb_url,
      new: differenceInHours(new Date(), company.launched_at || new Date()) <= 24
    } as unknown as MiniCardMetadata<T>
  } else if (cardType === "taaft") {
    const taaft = item as Taaft;
    return {
      ...taaft,
      thumbnail: taaft.thumb_url,
      new: differenceInHours(new Date(), taaft.added_at || new Date()) <= 24
    } as unknown as MiniCardMetadata<T>;
  } else {
    const ih = item as IndieHackers;
    
    return {
      ...ih,
      new: differenceInHours(new Date(), ih.added_at || new Date()) <= 24
    } as unknown as MiniCardMetadata<T>
  }
}

export default function ProductBlock<T extends ProductTypes>({ cardType, endpoint_url }: PageBlockProps<T>) {
  const fetcher = (url: string) => fetch(url).then(r => r.json());
  const { data, isLoading } = useSWR<ApiReturnDataType<T>[]>(endpoint_url, fetcher);
  return <>
    {isLoading && <Loading />}
    {!isLoading && data && <>
      <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
        {data.map((item) => <MiniScreenshotCard key={item.id} cardType={cardType} product={generatedata(cardType, item)} />)}
      </div>
    </>}
  </>
}