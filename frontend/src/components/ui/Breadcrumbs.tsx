import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getBreadcrumbSchema } from '@/seo';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always include Home as first element if not present
  const fullItems: BreadcrumbItem[] = items[0]?.path === '/'
    ? items
    : [{ name: 'Home', path: '/' }, ...items];

  const schema = getBreadcrumbSchema(fullItems);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#8F6E38]">
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-3 w-3 text-stone-400 shrink-0" />}
              {isLast ? (
                <span className="text-[#0F0F12] font-semibold" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-[#0F0F12] transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
