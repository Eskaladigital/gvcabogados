'use client';

import { useState, useEffect } from 'react';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 bg-brand-dark rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] z-[999] transition-all hover:scale-110 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
      aria-label="Volver arriba"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-brand-brown"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
