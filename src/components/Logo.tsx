import { SVGProps } from 'react'
import { LOGO_VIEWBOX, SYMBOL_PATHS, WORDMARK_PATH } from './logoPaths'

type LogoProps = SVGProps<SVGSVGElement> & {
  /** Contorno preto fino acompanhando o traçado do nome "plasma" (padrão: ligado) */
  outlined?: boolean
}

export function Logo({ outlined = true, ...props }: LogoProps) {
  return (
    <svg
      width="250"
      height="80"
      viewBox={LOGO_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Plasma Skate Logo</title>

      <g clipPath="url(#clip0_85_3)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={WORDMARK_PATH.d}
          fill={WORDMARK_PATH.fill}
          {...(outlined ? {
            stroke: '#000',
            // `non-scaling-stroke`: a espessura fica igual em qualquer tamanho do logo.
            // `paintOrder: stroke`: o traço é pintado por baixo do branco, então só a
            // metade de fora aparece - as letras não "emagrecem" e os furos (p, a)
            // ficam limpos.
            strokeWidth: 2.5,
            strokeLinejoin: 'round' as const,
            vectorEffect: 'non-scaling-stroke',
            paintOrder: 'stroke'
          } : {})}
        />
        {SYMBOL_PATHS.map((path) => (
          <path key={path.d.slice(0, 16)} d={path.d} fill={path.fill} />
        ))}
      </g>
      <defs>
        <clipPath id="clip0_85_3">
          <rect width="400" height="107" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
