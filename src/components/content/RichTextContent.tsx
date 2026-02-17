/**
 * Componente para renderizar contenido de texto enriquecido generado por IA
 * Convierte marcadores de formato (H1:, H2:, ##, etc.) en HTML real
 */

interface RichTextContentProps {
  content: string;
  className?: string;
}

export default function RichTextContent({ content, className = '' }: RichTextContentProps) {
  if (!content) return null;

  // Parsear el contenido y convertirlo en bloques HTML
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ').trim();
        if (paragraphText) {
          elements.push(
            <p key={`p-${key++}`} className="text-base text-neutral-600 leading-relaxed mb-4">
              {paragraphText}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        flushParagraph();
        continue;
      }

      // H1: Título principal (H1:, # )
      if (/^H1:\s*/i.test(trimmedLine) || /^#\s+/.test(trimmedLine)) {
        flushParagraph();
        const text = trimmedLine.replace(/^H1:\s*/i, '').replace(/^#\s+/, '').trim();
        elements.push(
          <h1 key={`h1-${key++}`} className="font-serif text-3xl md:text-4xl font-bold text-brand-dark mb-6 mt-8">
            {text}
          </h1>
        );
        continue;
      }

      // H2: Subtítulo (H2:, ##, o líneas que terminan sin punto y son cortas)
      if (/^H2:\s*/i.test(trimmedLine) || /^##\s+/.test(trimmedLine)) {
        flushParagraph();
        const text = trimmedLine.replace(/^H2:\s*/i, '').replace(/^##\s+/, '').trim();
        elements.push(
          <h2 key={`h2-${key++}`} className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-4 mt-8">
            {text}
          </h2>
        );
        continue;
      }

      // H3: Subtítulo menor (H3:, ###)
      if (/^H3:\s*/i.test(trimmedLine) || /^###\s+/.test(trimmedLine)) {
        flushParagraph();
        const text = trimmedLine.replace(/^H3:\s*/i, '').replace(/^###\s+/, '').trim();
        elements.push(
          <h3 key={`h3-${key++}`} className="font-serif text-xl md:text-2xl font-semibold text-brand-dark mb-3 mt-6">
            {text}
          </h3>
        );
        continue;
      }

      // Detectar títulos sin marcadores: líneas cortas (<80 chars) que no terminan en punto
      // y que probablemente sean títulos (empiezan con mayúscula)
      if (
        trimmedLine.length < 80 &&
        !trimmedLine.match(/[.?!:]$/) &&
        /^[A-ZÁÉÍÓÚÑ]/.test(trimmedLine) &&
        !trimmedLine.match(/^[-*•\d]/)
      ) {
        // Si la siguiente línea es vacía o es texto normal, probablemente sea un título
        flushParagraph();
        elements.push(
          <h2 key={`h2-auto-${key++}`} className="font-serif text-2xl md:text-3xl font-semibold text-brand-dark mb-4 mt-8">
            {trimmedLine}
          </h2>
        );
        continue;
      }

      // Listas con viñetas (-, *, •)
      if (/^[-*•]\s+/.test(trimmedLine)) {
        flushParagraph();
        const text = trimmedLine.replace(/^[-*•]\s+/, '').trim();
        elements.push(
          <li key={`li-${key++}`} className="text-base text-neutral-600 leading-relaxed mb-2 ml-6 list-disc">
            {text}
          </li>
        );
        continue;
      }

      // Listas numeradas (1., 2., etc.)
      if (/^\d+\.\s+/.test(trimmedLine)) {
        flushParagraph();
        const text = trimmedLine.replace(/^\d+\.\s+/, '').trim();
        elements.push(
          <li key={`li-${key++}`} className="text-base text-neutral-600 leading-relaxed mb-2 ml-6 list-decimal">
            {text}
          </li>
        );
        continue;
      }

      // Acumular en el párrafo actual
      currentParagraph.push(trimmedLine);
    }

    // Flush final paragraph
    flushParagraph();

    return elements;
  };

  return (
    <div className={`rich-text-content ${className}`}>
      {parseContent(content)}
    </div>
  );
}
