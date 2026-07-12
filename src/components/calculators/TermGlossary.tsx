'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export interface TermItem {
  term: string;
  desc: string;
}

export default function TermGlossary({ items }: { items: TermItem[] }) {
  const pathname = usePathname();
  const isKo = pathname?.startsWith('/ko');
  if (!items?.length) return null;
  return (
    <div className="mt-5">
      <h3 className="text-base font-semibold text-foreground mb-3">{isKo ? '용어 설명' : 'Term Glossary'}</h3>
      <dl className="space-y-3">
        {items.map((it) => (
          <div key={it.term} className="rounded-lg border border-border bg-muted/40 p-3">
            <dt className="font-semibold text-foreground">{it.term}</dt>
            <dd className="text-sm text-muted-foreground mt-1 leading-relaxed">{it.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
