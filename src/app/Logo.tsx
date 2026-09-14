/* La marque inme : une porte entrouverte sur une lumiere. Le montant bleu
   profond, le battant qui s'ecarte, et l'arc d'or qui passe par l'ouverture.
   Dessine, jamais un emoji, et lisible jusqu'a seize pixels. */

export default function Logo({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="inme"
    >
      <rect x="0" y="0" width="48" height="48" rx="12" fill="#17315C" />

      {/* La lumiere qui passe par l'ouverture */}
      <path d="M24 10 L 38 38 L 24 32 Z" fill="#E3B341" />

      {/* Le battant, ecarte vers la gauche */}
      <path
        d="M22 9 L 10 13 L 10 39 L 22 35 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="18.6" cy="24" r="1.7" fill="#FFFFFF" />

      {/* Le montant droit */}
      <path d="M27 9 L 38 9 L 38 39 L 27 39" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
