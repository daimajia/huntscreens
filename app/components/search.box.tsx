"use client"
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { ProductTypes, urlMapper } from '../types/product.types';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Loader2 } from "lucide-react";

type SearchResult = {
  id: number;
  name: string;
  tagline: string;
  thumb_url: string;
  itemType: ProductTypes;
  uuid: string;
};

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setQuery('');
      setResults([]);
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="w-[300px] justify-start text-left font-normal"
        onClick={() => handleOpenChange(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search products...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading ? (
            <CommandGroup heading="Searching...">
              <div className="p-4 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
              </div>
            </CommandGroup>
          ) : debouncedQuery && results.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : results.length > 0 ? (
            <CommandGroup heading="Search Results">
              {results.map((result) => (
                <CommandItem key={result.uuid} value={result.name}>
                  <Link href={urlMapper[result.itemType](result.id)} className="flex items-center w-full" onClick={() => handleOpenChange(false)}>
                    <Logo name={result.name} url={result.thumb_url} className="w-10 h-10 mr-3" />
                    <div>
                      <div className="font-semibold">{result.name}</div>
                      <div className="text-sm text-gray-600">{result.tagline}</div>
                    </div>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}