/* eslint-disable @next/next/no-img-element */
import { urlMapper } from '@/types/product.types';
import Logo from '@/components/logo';
import { ExternalLink } from 'lucide-react';
import { SearchResult } from '../../types/search.type';
import { useLocale } from 'next-intl';
import { SupportedLangs } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
type SearchCardProps = {
  result: SearchResult;
};

export default function SearchCard({ result }: SearchCardProps) {
  const locale = useLocale() as SupportedLangs;
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg border hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={urlMapper[result.itemType](result.id)} className="block" target="_blank">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2}/${result.uuid}.webp`}
            alt={`${result.name} screenshot`}
            className="object-cover object-top w-full h-full transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 flex-shrink-0">
            <Logo name={result.name} url={result.thumb_url} />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-bold truncate group-hover:text-blue-600 transition-colors duration-300">{result.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{result.tagline}</p>
          </div>
          <Link href={result.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
            <ExternalLink className="w-5 h-5" />
            <span className="sr-only">Visit website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
