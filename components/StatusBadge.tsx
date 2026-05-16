import { PieceStatus } from "@/sanity/queries";

const config: Record<
  PieceStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Available",
    className: "badge-available",
  },
  sold: {
    label: "Sold",
    className: "badge-sold",
  },
  commission: {
    label: "Custom Order Only",
    className: "badge-commission",
  },
  display: {
    label: "Not for Sale",
    className: "bg-sand text-charcoal/60 border border-sand-dark",
  },
};

interface Props {
  status: PieceStatus;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: Props) {
  const { label, className: badgeClass } = config[status] ?? config.display;

  return (
    <span
      className={`inline-block font-sans text-xs tracking-widest uppercase px-3 py-1 rounded-sm ${badgeClass} ${className}`}
    >
      {label}
    </span>
  );
}
