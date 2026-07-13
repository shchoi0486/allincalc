'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, localeNames, defaultLocale, type Locale } from '@/i18n/config';
import { useI18n } from '@/i18n/I18nProvider';

export default function LanguageSwitcher() {
  const { dict, setLocale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const seg = pathname.split('/')[1];
  const locale: Locale = seg === 'ko' || seg === 'en' ? (seg as Locale) : defaultLocale;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const switchTo = (next: Locale) => {
    setLocale(next);
    const segments = pathname.split('/');
    // segments[0] === '' , segments[1] === 현재 로케일
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const newPath = segments.join('/') || `/${next}`;
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
        aria-label={dict.common.selectLanguage}
      >
        <Globe className="h-6 w-6" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-md border bg-background shadow-lg z-50">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted ${
                l === locale ? 'font-semibold text-primary' : ''
              }`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
