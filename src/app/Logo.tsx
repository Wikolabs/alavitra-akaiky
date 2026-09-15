/* La marque inme : une porte entrouverte sur une lumiere.
   Elle tient en trois figures, et chacune est juste :

     l'embrasure   un rectangle franc de 19 sur 26, de (20,13) a (39,39)
     le battant    un vrai parallelogramme, cotes verticaux x=9 et x=20,
                   longs de 26 chacun, decales de 4, obliques de pente 4/11
     le reflet     un second parallelogramme de meme pente, pose a l'interieur
                   de l'embrasure et entierement contenu par elle

   La boite englobante va de 9 a 39 sur les deux axes : la marque est donc
   centree au pixel dans sa tuile, avec neuf unites de marge sur les quatre
   cotes. Aucun degrade, trois aplats, lisible jusqu'a seize pixels. */

export const MARK = {
  deep: "#17315C",
  gold: "#E3B341",
  white: "#FFFFFF",
  /* Embrasure */
  frame: { x: 20, y: 13, w: 19, h: 26 },
  /* Battant, dans l'ordre : haut gauche, haut droit, bas droit, bas gauche */
  leaf: "M9 9 L20 13 L20 39 L9 35 Z",
  /* Reflet, meme pente 4/11, inscrit dans l'embrasure */
  glint: "M23 17 L29 19.18 L29 37.18 L23 35 Z",
  hinge: "M20 13 L20 39",
  knob: { cx: 12.5, cy: 23.3, r: 1.9 },
};

export default function Logo({ size = 36, className }: { size?: number; className?: string }) {
  const { frame, knob } = MARK;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="inme"
    >
      <rect x="0" y="0" width="48" height="48" rx="12" fill={MARK.deep} />
      <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} fill={MARK.gold} />
      <path d={MARK.glint} fill={MARK.white} opacity="0.42" />
      <path d={MARK.leaf} fill={MARK.white} />
      <path d={MARK.hinge} stroke={MARK.deep} strokeWidth="1.6" />
      <circle cx={knob.cx} cy={knob.cy} r={knob.r} fill={MARK.deep} />
    </svg>
  );
}
