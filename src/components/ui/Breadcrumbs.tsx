import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  light?: boolean; // true para usar sobre fondo oscuro
}

export default function Breadcrumbs({ items, light = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 flex-wrap text-[0.65rem]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className={light ? 'text-neutral-500' : 'text-neutral-300'}>/</span>}
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className={`font-medium uppercase tracking-wider transition-colors ${
                  light
                    ? 'text-neutral-400 hover:text-brand-brown'
                    : 'text-neutral-300/70 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={`font-semibold uppercase tracking-wider ${
                  light ? 'text-brand-brown' : 'text-brand-gold'
                }`}
              >
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
