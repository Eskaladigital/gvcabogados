/**
 * Renderiza contenido generado por IA.
 * Soporta HTML semántico directo (preferido) y texto plano con marcadores (legacy).
 */

interface RichTextContentProps {
  content: string;
  className?: string;
}

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'p', 'strong', 'em', 'b', 'i',
  'ul', 'ol', 'li', 'blockquote', 'br',
]);

function sanitizeHtml(html: string): string {
  return html
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
      const lower = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(lower)) return '';
      const isClosing = match.startsWith('</');
      return isClosing ? `</${lower}>` : `<${lower}>`;
    })
    .replace(/\s(class|style|id|on\w+|data-\w+)="[^"]*"/gi, '');
}

function isHtmlContent(text: string): boolean {
  return /<(h[1-4]|p|ul|ol|blockquote|strong|em)\b/i.test(text);
}

function plainTextToHtml(text: string): string {
  const lines = text.split('\n');
  const parts: string[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      const joined = paragraph.join(' ').trim();
      if (joined) parts.push(`<p>${joined}</p>`);
      paragraph = [];
    }
  };

  for (const line of lines) {
    const t = line.trim();

    if (!t) { flush(); continue; }

    if (/^H1:\s*/i.test(t) || /^#\s+/.test(t)) {
      flush();
      parts.push(`<h2>${t.replace(/^H1:\s*/i, '').replace(/^#\s+/, '').trim()}</h2>`);
      continue;
    }
    if (/^H2:\s*/i.test(t) || /^##\s+/.test(t)) {
      flush();
      parts.push(`<h2>${t.replace(/^H2:\s*/i, '').replace(/^##\s+/, '').trim()}</h2>`);
      continue;
    }
    if (/^H3:\s*/i.test(t) || /^###\s+/.test(t)) {
      flush();
      parts.push(`<h3>${t.replace(/^H3:\s*/i, '').replace(/^###\s+/, '').trim()}</h3>`);
      continue;
    }
    if (
      t.length < 80 &&
      !/[.?!:]$/.test(t) &&
      /^[A-ZÁÉÍÓÚÑ]/.test(t) &&
      !/^[-*•\d]/.test(t)
    ) {
      flush();
      parts.push(`<h2>${t}</h2>`);
      continue;
    }
    if (/^[-*•]\s+/.test(t)) {
      flush();
      parts.push(`<ul><li>${t.replace(/^[-*•]\s+/, '').trim()}</li></ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(t)) {
      flush();
      parts.push(`<ol><li>${t.replace(/^\d+\.\s+/, '').trim()}</li></ol>`);
      continue;
    }

    paragraph.push(t);
  }
  flush();

  return parts.join('');
}

export default function RichTextContent({ content, className = '' }: RichTextContentProps) {
  if (!content) return null;

  const html = isHtmlContent(content) ? sanitizeHtml(content) : plainTextToHtml(content);

  return (
    <div
      className={`rich-text-content prose prose-neutral max-w-none
        prose-headings:font-serif prose-headings:text-brand-dark
        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8
        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6
        prose-p:text-base prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-4
        prose-strong:text-brand-dark prose-strong:font-semibold
        prose-em:text-neutral-500
        prose-li:text-base prose-li:text-neutral-600 prose-li:leading-relaxed
        prose-blockquote:border-l-brand-brown prose-blockquote:bg-neutral-50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
