"use client";

import { useEffect, useRef } from "react";

type StudioTextContentProps = {
  content: string;
  onOverflowChange: (overflowing: boolean) => void;
};

export default function StudioTextContent({ content, onOverflowChange }: StudioTextContentProps) {
  const contentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const measure = () => {
      const container = element.parentElement;
      if (!container) return;

      const overflowing =
        element.scrollHeight > container.clientHeight + 1 ||
        element.scrollWidth > container.clientWidth + 1;

      onOverflowChange(overflowing);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    if (element.parentElement) {
      observer.observe(element.parentElement);
    }

    document.fonts.ready.then(measure);

    return () => observer.disconnect();
  }, [content, onOverflowChange]);

  return (
    <span ref={contentRef} className="block wrap-break-word whitespace-pre-wrap">
      {content}
    </span>
  );
}
