import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const t = useTranslations('Categories');
  return (
    <div className="mt-8 max-w-full m-auto flex items-center gap-5 justify-between">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        asChild={currentPage !== 1}
      >
        {currentPage === 1 ? (
          t('PreviousPage')
        ) : (
          <Link href={`${baseUrl}?page=${currentPage - 1}`}>
            {t('PreviousPage')}
          </Link>
        )}
      </Button>
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        asChild={currentPage !== totalPages}
      >
        {currentPage === totalPages ? (
          t('NextPage')
        ) : (
          <Link href={`${baseUrl}?page=${currentPage + 1}`}>
            {t('NextPage')}
          </Link>
        )}
      </Button>
    </div>
  );
}