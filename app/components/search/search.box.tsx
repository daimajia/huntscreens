"use client"
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/search/')) {
      const searchQuery = decodeURIComponent(pathname.split('/')[2]);
      setQuery(searchQuery);
    }
    setIsLoading(false);
  }, [pathname]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full md:w-[300px]">
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <Input
        className="pl-8"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
      />
    </form>
  );
}