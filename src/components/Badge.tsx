/**
 * Badge.tsx
 *
 * A small colored label used to display status values
 * like "Arrival", "Departure", "In Stock", etc.
 *
 * It receives a color from the field options in data.ts
 * and displays the label with a matching background.
 */

interface BadgeProps {
  label: string; // Text to display
  color: string; // Hex color from data.ts options
}

function Badge({ label, color }: BadgeProps) {
  return (
    <span
      style={{
        backgroundColor: color + "20", // 20 = 12% opacity
        color: color,
        borderColor: color + "40", // 40 = 25% opacity
      }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
    >
      {label}
    </span>
  );
}

export default Badge;
