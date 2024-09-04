import { Suspense } from "react";
import ProductList from "./components/product.list";
import Loading from "@/components/ui-custom/skeleton/list.loading";
import { useTranslations } from "next-intl";

export default function JustLaunchedPage() {
  const t = useTranslations('Home');
  return (
    <div className='flex flex-col gap-3 w-full'>
      <h1 className="text-3xl font-bold px-5 mb-5">{t('just-launched')}</h1>
      <Suspense fallback={<Loading />}>
        <ProductList cardType="just-launched" baseUrl="/api/just-launched/{page}" />
      </Suspense>
    </div>
  );
}
