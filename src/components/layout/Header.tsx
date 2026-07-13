import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { calculatorCategories } from '@/data/calculators';
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { en } from '@/i18n/dictionaries/en';
import { ko } from '@/i18n/dictionaries/ko';
import { defaultLocale, type Locale } from '@/i18n/config';
import LanguageSwitcher from './LanguageSwitcher';

function getLocaleFromPath(pathname?: string): Locale {
  const seg = pathname?.split('/')[1];
  return seg === 'ko' || seg === 'en' ? (seg as Locale) : defaultLocale;
}

// Flatten calculators for search
const allCalculators = calculatorCategories.flatMap(category =>
  category.subcategories.flatMap(subcategory =>
    subcategory.calculators.map(calculator => ({
      ...calculator,
      categoryName: category.name,
      subcategoryName: subcategory.name,
    }))
  )
);

const orderedCategoryNames = [
  'finance',
  'conversion',
  'life',
  'science',
  'engineering',
  'ai-tools',
  'game',
  'others',
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const dict = locale === 'ko' ? ko : en;
  const localePrefix = `/${locale}`;

  const navigation = orderedCategoryNames.map(name => {
    const category = calculatorCategories.find(c => c.id === name);
    if (!category) return null;
    const navKey = (name === 'ai-tools' ? 'aiTools' : name) as keyof typeof dict.nav;
    return {
      name: dict.nav[navKey] ?? category.name,
      href: category.href,
    };
  }).filter(Boolean) as { name: string; href: string }[];

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allCalculators>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        const results = allCalculators.filter(calc =>
          calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest('[data-search-container]')) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleResultClick = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-40 w-full border-b">
      {/* Top row: Logo, Search, Icons */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href={localePrefix} className="flex items-center space-x-3">
          <Image src="/logo/allincalc5.png" alt="AllinCalc Logo" width={60} height={18} />
          <h1 className="text-2xl font-bold text-foreground">All-in-Calc</h1>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search */}
          <div className="relative w-full max-w-lg hidden sm:block" ref={searchRef} data-search-container>
            <label htmlFor="search" className="sr-only">
              {dict.common.searchPlaceholder}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-muted py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                placeholder={dict.common.searchPlaceholder}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>
            {isSearchFocused && (
              <div className="absolute mt-1 w-full max-h-96 overflow-y-auto rounded-md bg-background border shadow-lg z-50">
                {searchResults.length > 0 ? (
                  <ul className="py-1">
                    {searchResults.map((calc) => (
                      <li key={calc.id}>
                        <Link
                          href={`${localePrefix}${calc.href}`}
                          className="block px-4 py-2 text-sm hover:bg-muted"
                          onClick={handleResultClick}
                        >
                          <p className="font-semibold text-foreground">{calc.name}</p>
                          <p className="text-xs text-muted-foreground">{calc.categoryName} &gt; {calc.subcategoryName}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  searchQuery && <p className="p-4 text-sm text-muted-foreground">{dict.common.searchPlaceholder}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Bottom row: Navigation */}
      <div className="border-t">
        <nav className="container mx-auto flex flex-wrap items-center justify-center gap-1.5 py-2.5">
          {navigation.map((item) => {
            const isActive = pathname?.startsWith(`${localePrefix}${item.href}`);
            return (
              <Link
                key={item.name}
                href={`${localePrefix}${item.href}`}
                className={`relative shrink-0 whitespace-nowrap text-sm font-semibold tracking-tight px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile: Search bar below nav */}
      <div className="sm:hidden border-t" data-search-container>
        <div className="container mx-auto px-4 py-2.5">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <input
              id="search-mobile"
              name="search-mobile"
              className="block w-full rounded-md border-0 bg-muted py-2.5 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary text-sm leading-6"
              placeholder={dict.common.searchPlaceholder}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
          </div>
          {isSearchFocused && (
            <div className="absolute mt-1 w-[calc(100%-2rem)] max-h-96 overflow-y-auto rounded-md bg-background border shadow-lg z-50 left-4">
              {searchResults.length > 0 ? (
                <ul className="py-1">
                  {searchResults.map((calc) => (
                    <li key={calc.id}>
                      <Link
                        href={`${localePrefix}${calc.href}`}
                        className="block px-4 py-2 text-sm hover:bg-muted"
                        onClick={handleResultClick}
                      >
                        <p className="font-semibold text-foreground">{calc.name}</p>
                        <p className="text-xs text-muted-foreground">{calc.categoryName} &gt; {calc.subcategoryName}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                searchQuery && <p className="p-4 text-sm text-muted-foreground">{dict.common.searchPlaceholder}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
