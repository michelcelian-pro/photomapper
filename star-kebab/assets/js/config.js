/* Configuration TailwindCSS (CDN) — partagée par toutes les pages.
   Les couleurs "bg / ink / line / card" pointent vers des variables CSS
   afin de basculer automatiquement entre le mode jour et le mode nuit.
   Le garde-fou évite une erreur si le CDN Tailwind n'a pas pu charger. */
if (typeof tailwind !== "undefined") tailwind.config = {
  theme: {
    extend: {
      colors: {
        bg:        'var(--bg)',
        'bg-soft': 'var(--bg-soft)',
        ink:       'var(--ink)',
        'ink-soft':'var(--ink-soft)',
        line:      'var(--line)',
        card:      'var(--card)',
        // accents de marque (constants quel que soit le thème)
        paprika:   '#D64218',
        safran:    '#F0A93B',
        pistache:  '#7E8A5A',
        charbon:   '#1A1614',
        creme:     '#F5EFE6',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      // permet d'utiliser font-400 / font-500 / font-600 / font-700 / font-900
      fontWeight: {
        400: '400', 500: '500', 600: '600', 700: '700', 900: '900',
      },
      boxShadow: {
        brutal:    '6px 6px 0 0 var(--shadow)',
        'brutal-sm':'4px 4px 0 0 var(--shadow)',
        'brutal-lg':'12px 12px 0 0 var(--shadow)',
        'brutal-paprika': '6px 6px 0 0 #D64218',
      },
      letterSpacing: { tightest: '-.04em' },
    },
  },
};
