import { PortableText, PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-sans text-base text-charcoal/80 leading-relaxed mb-5">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-2xl text-forest mt-10 mb-4">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-charcoal">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-charcoal/70">{children}</em>
    ),
  },
};

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
  className?: string;
}

export default function PortableTextRenderer({ value, className = "" }: Props) {
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
