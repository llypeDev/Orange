import type { ReactElement } from 'react'

/**
 * Biblioteca de ícones do Orange: grade 24×24, traço de 1.75px, terminações
 * quadradas e cantos vivos — coerente com a linguagem geométrica do sistema.
 *
 * Para adicionar um ícone: inclua uma nova chave neste objeto (mantenha a
 * ordem alfabética) usando apenas <path>, <circle>, <rect> ou <line>.
 */
export const iconPaths = {
  accessibility: (
    <>
      <circle cx="12" cy="4.5" r="1.75" />
      <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M8.5 21l3.5-6.5 3.5 6.5" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.25v.5" />
    </>
  ),
  'alert-triangle': <path d="M12 3.5l9.5 17h-19zM12 10v4.5M12 17.25v.5" />,
  'arrow-down': <path d="M12 4.5v15M5.5 13l6.5 6.5 6.5-6.5" />,
  'arrow-left': <path d="M19.5 12h-15M11 5.5L4.5 12l6.5 6.5" />,
  'arrow-right': <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />,
  'arrow-up': <path d="M12 19.5v-15M5.5 11L12 4.5l6.5 6.5" />,
  'arrow-up-right': <path d="M6.5 17.5l11-11M8 6.5h9.5V16" />,
  'arrows-up-down': <path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4" />,
  bell: <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15zM10 20.5h4" />,
  book: <path d="M5 4.5h10.5a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17.5a3 3 0 0 1 3-3h10.5" />,
  calendar: <path d="M3.5 5.5h17v15h-17zM3.5 10h17M8 3v4.5M16 3v4.5" />,
  'chart-bar': <path d="M4 20.5h16M6.5 20.5V12M11 20.5V5M15.5 20.5v-6M20 20.5V9" />,
  check: <path d="M4.5 12.5l5 5 10-10" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.25l2.75 2.75L16.25 9.5" />
    </>
  ),
  'chevron-down': <path d="M6 9.5l6 6 6-6" />,
  'chevron-left': <path d="M14.5 6l-6 6 6 6" />,
  'chevron-right': <path d="M9.5 6l6 6-6 6" />,
  'chevron-up': <path d="M6 14.5l6-6 6 6" />,
  'chevrons-left': <path d="M11.5 6l-6 6 6 6M18.5 6l-6 6 6 6" />,
  'chevrons-right': <path d="M5.5 6l6 6-6 6M12.5 6l6 6-6 6" />,
  'chevrons-up-down': <path d="M7.5 9.5L12 5l4.5 4.5M7.5 14.5L12 19l4.5-4.5" />,
  circle: <circle cx="12" cy="12" r="9" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  code: <path d="M8.5 7l-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" />,
  command: <path d="M9 9V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z" />,
  copy: <path d="M9 9h11v11H9zM5.5 15H4V4h11v1.5" />,
  download: <path d="M12 4v11M7 10l5 5 5-5M4 15.5V20h16v-4.5" />,
  droplet: <path d="M12 3.5l5.5 7.5a6.5 6.5 0 1 1-11 0z" />,
  edit: <path d="M4 20h4.5L19.5 9 15 4.5 4 15.5zM13 6.5l4.5 4.5" />,
  'external-link': <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <path d="M3.5 3.5l17 17M10 6a9.5 9.5 0 0 1 2-.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.5 3.3M6.5 7.3A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.5-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  ),
  file: <path d="M6 3h8.5L19 7.5V21H6zM14 3v5h5" />,
  filter: <path d="M3.5 5h17l-6.5 8v6.5l-4-2V13z" />,
  folder: <path d="M3.5 5.5h6l2 2.5h9v11.5h-17z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.75 5.5 3.75 9S14.5 18.5 12 21M12 3C9.5 5.5 8.25 8.5 8.25 12S9.5 18.5 12 21" />
    </>
  ),
  grid: <path d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z" />,
  grip: (
    <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" strokeWidth="3" />
  ),
  heart: <path d="M12 20s-8-4.75-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.25 12 20 12 20z" />,
  'help-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 16.75v.5" />
    </>
  ),
  home: <path d="M3.5 11L12 3.5l8.5 7.5v9.5h-6v-6h-5v6h-6z" />,
  image: (
    <>
      <path d="M3.5 4.5h17v15h-17z" />
      <circle cx="9" cy="9.5" r="1.75" />
      <path d="M20.5 15.5l-5-5-9 9" />
    </>
  ),
  inbox: <path d="M3.5 13.5L6 4.5h12l2.5 9v6h-17zM3.5 13.5H9l1 2.5h4l1-2.5h5.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.25v.5" />
    </>
  ),
  keyboard: <path d="M2.5 6h19v12h-19zM6 9.5h.01M10 9.5h.01M14 9.5h.01M18 9.5h.01M7.5 14.5h9" />,
  layers: <path d="M12 3.5l9 4.5-9 4.5L3 8zM3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5" />,
  layout: <path d="M3.5 4h17v16h-17zM3.5 9h17M9.5 9v11" />,
  link: (
    <path d="M10 14a4 4 0 0 0 5.66 0l3.17-3.17a4 4 0 0 0-5.66-5.66L12 6.34M14 10a4 4 0 0 0-5.66 0l-3.17 3.17a4 4 0 0 0 5.66 5.66L12 17.66" />
  ),
  list: <path d="M9 6h11.5M9 12h11.5M9 18h11.5M4 6h.01M4 12h.01M4 18h.01" />,
  lock: <path d="M5 10.5h14v10H5zM8 10.5V7.5a4 4 0 0 1 8 0v3" />,
  'log-out': <path d="M9.5 20.5H4v-17h5.5M16 7.5l4.5 4.5-4.5 4.5M20.5 12H9.5" />,
  mail: <path d="M3 5.5h18v13H3zM3 6l9 7 9-7" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  minus: <path d="M5 12h14" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  'more-horizontal': <path d="M5.5 12h.01M12 12h.01M18.5 12h.01" strokeWidth="3" />,
  'more-vertical': <path d="M12 5.5v.01M12 12v.01M12 18.5v.01" strokeWidth="3" />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />,
  play: <path d="M7 4.5l12 7.5-12 7.5z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: <path d="M20 4.5v5h-5M4 19.5v-5h5M19.1 9.5A7.5 7.5 0 0 0 5.6 7.6M4.9 14.5a7.5 7.5 0 0 0 13.5 1.9" />,
  rocket: (
    <path d="M12.5 15.5l-4-4c1.5-4.5 4.5-7.5 11-8-.5 6.5-3.5 9.5-7 12zM8.5 11.5L5 11l3-3.5h4M12.5 15.5l.5 3.5 3.5-3v-4M7.5 16.5c-1.5.5-2.5 2-3 4 2-.5 3.5-1.5 4-3" />
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.75-4.75" />
    </>
  ),
  send: <path d="M21 3L10.5 13.5M21 3l-6.5 18-4-7.5-7.5-4z" />,
  sliders: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5" />,
  sparkle: <path d="M12 3l1.9 5.6L19.5 10.5 13.9 12.4 12 18l-1.9-5.6L4.5 10.5l5.6-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  square: <path d="M5 5h14v14H5z" />,
  star: <path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 17l-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 3.5h8l9 9-8 8-9-9z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  terminal: <path d="M3.5 4.5h17v15h-17zM7 9l3 3-3 3M12.5 15H17" />,
  trash: <path d="M4 6.5h16M9 6.5V3.5h6v3M6 6.5l1 14h10l1-14M10 10.5v6M14 10.5v6" />,
  type: <path d="M5 7V4.5h14V7M12 4.5v15M9 19.5h6" />,
  upload: <path d="M12 15V4M7 9l5-5 5 5M4 15.5V20h16v-4.5" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20.5c0-3.9 3.6-6 8-6s8 2.1 8 6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5M15.5 4.8a3.5 3.5 0 0 1 0 6.4M17.5 14.7c2.4.6 4 2.5 4 5.3" />
    </>
  ),
  'x-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  zap: <path d="M13 2.5L4.5 13.5H12L11 21.5l8.5-11H12z" />,
} satisfies Record<string, ReactElement>

export type IconName = keyof typeof iconPaths

export const iconNames = Object.keys(iconPaths) as IconName[]
