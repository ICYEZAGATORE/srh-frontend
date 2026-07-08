import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Welcome block shown in the empty chat state: a flat illustration of a young
 * person holding a phone with a floating chat interface, plus the app name,
 * tagline and a short prompt. Pure inline SVG — instant on slow networks.
 *
 * The SVG is decorative (aria-hidden); the text below it carries the meaning.
 */
export default function WelcomeIllustration() {
  const { t } = useLanguage()

  return (
    <div className="mb-2">
      <svg
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
        className="w-full max-w-[320px] mx-auto mb-6"
      >
        {/* stars */}
        <path
          d="M12 2 14.6 8.6 21.5 9 16 13.5 17.8 20 12 16.2 6.2 20 8 13.5 2.5 9 9.4 8.6Z"
          transform="translate(150 8) scale(0.9)"
          style={{ fill: 'var(--clr-yellow)' }}
        />
        <path
          d="M12 2 14.6 8.6 21.5 9 16 13.5 17.8 20 12 16.2 6.2 20 8 13.5 2.5 9 9.4 8.6Z"
          transform="translate(248 22) scale(0.6)"
          style={{ fill: 'var(--clr-yellow)' }}
        />

        {/* floating chat interface — three stacked rounded rects with tiny lines */}
        {[60, 92, 124].map((y, i) => (
          <g key={y}>
            <rect x="40" y={y} width="74" height="24" rx="9" style={{ fill: 'var(--clr-primary-light)' }} />
            <rect x="50" y={y + 8} width="40" height="3" rx="1.5" style={{ fill: 'var(--clr-border)' }} />
            <rect x="50" y={y + 14} width="28" height="3" rx="1.5" style={{ fill: 'var(--clr-border)' }} opacity={i === 1 ? 0.7 : 1} />
          </g>
        ))}

        {/* ground shadow */}
        <ellipse cx="206" cy="190" rx="48" ry="8" style={{ fill: 'var(--clr-border)' }} />

        {/* legs */}
        <line x1="194" y1="150" x2="190" y2="182" stroke="#1A2E2D" strokeWidth="8" strokeLinecap="round" />
        <line x1="218" y1="150" x2="222" y2="182" stroke="#1A2E2D" strokeWidth="8" strokeLinecap="round" />

        {/* shirt / body */}
        <rect x="178" y="92" width="52" height="60" rx="20" style={{ fill: 'var(--clr-accent)' }} />

        {/* head */}
        <circle cx="204" cy="64" r="28" fill="#6B3A2A" />
        <path d="M193 70 Q204 79 215 70" fill="none" stroke="#3A2017" strokeWidth="2.6" strokeLinecap="round" />

        {/* arms holding the phone */}
        <line x1="182" y1="106" x2="194" y2="126" style={{ stroke: 'var(--clr-accent)' }} strokeWidth="8" strokeLinecap="round" />
        <line x1="226" y1="106" x2="214" y2="126" style={{ stroke: 'var(--clr-accent)' }} strokeWidth="8" strokeLinecap="round" />

        {/* phone */}
        <rect x="184" y="114" width="40" height="46" rx="9" style={{ fill: 'var(--clr-primary)' }} />
        <rect x="190" y="120" width="28" height="34" rx="4" fill="#FFFFFF" />
        {/* chat bubble on the screen */}
        <path
          d="M196 128h16a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-7l-4 4v-4h-1a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z"
          style={{ fill: 'var(--clr-accent)' }}
        />
      </svg>

      <h2 className="font-display font-bold text-2xl text-[var(--clr-text-primary)] text-center mt-2 mb-1">
        {t('app_name')}
      </h2>
      <p className="text-sm text-[var(--clr-text-secondary)] text-center mb-2">{t('tagline')}</p>
      <p className="text-xs text-[var(--clr-text-secondary)] text-center">
        Tap a question below or type your own.
      </p>
    </div>
  )
}
