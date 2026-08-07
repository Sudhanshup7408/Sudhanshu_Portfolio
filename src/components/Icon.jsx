/* Every icon in the site, as one lookup. Paths inherit currentColor and the
   stroke settings from the global `svg` rule in styles.css. */
const PATHS = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.4-3.8 1.4a13 13 0 0 0-7 0C6.3 1 5.2 1.4 5.2 1.4A4.9 4.9 0 0 0 5.1 5a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22" />,
  linkedin: <><rect x="2" y="2" width="20" height="20" rx="3" /><path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4" /></>,
  sun: <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></>,
  zoom: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6M11 8v6M8 11h6" /></>,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  replay: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14 21 3" /></>,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  section: <path d="M4 6h16M4 12h16M4 18h10" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  pin: <><path d="M12 21s-7-4.4-7-10a7 7 0 1 1 14 0c0 5.6-7 10-7 10z" /><circle cx="12" cy="11" r="2.5" /></>,
  badge: <><path d="M22 11.1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" /><path d="M2 9h20M16 19l2 2 4-4" /></>,
  star: <path d="M12 2 15 8.5 22 9.5l-5 4.9 1.2 7L12 18l-6.2 3.4L7 14.4l-5-4.9 7-1z" />,
  cap: <><path d="M12 3 2 8l10 5 10-5-10-5z" /><path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" /></>,
  trophy: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" /></>,
  list: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 13h6M9 17h6" /></>,

  // skill categories
  code: <path d="M8 4 3 12l5 8M16 4l5 8-5 8M13.5 3.5l-3 17" />,
  box: <><path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" /><path d="m3 7 9 5 9-5M12 12v10" /></>,
  nodes: <><circle cx="12" cy="5" r="2.6" /><circle cx="5" cy="18" r="2.6" /><circle cx="19" cy="18" r="2.6" /><path d="M10.4 7 6.6 15.6M13.6 7l3.8 8.6M7.6 18h8.8" /></>,
  swap: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  db: <><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6-1.6A4 4 0 0 0 6.5 19z" />,
  pulse: <path d="M3 12h4l2.5-7 4 14 2.5-7h5" />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14.5v2.5" /></>,
  spark: <><path d="m12 2.5 2.2 5.3 5.3 2.2-5.3 2.2L12 17.5 9.8 12.2 4.5 10l5.3-2.2z" /><path d="M18.5 16.5 19.3 18.5 21.3 19.3 19.3 20.1 18.5 22 17.7 20.1 15.7 19.3 17.7 18.5z" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6.8V12l3.4 2" /></>,

  // bots + ai
  chat: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.9-.9L3 20.5l1.6-4.9A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />,
  window: <><rect x="2" y="4" width="20" height="15" rx="2" /><path d="M2 9h20M6 13h7" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /></>,
  bolt: <path d="M13 2 4.5 13H11l-1 9 8.5-11H12l1-9z" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,

  // problem log
  bug: <><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M8 12H3M21 12h-5M8 8 5 5M16 8l3-3M8 17l-3 3M16 17l3 3M9.5 4.5a2.5 2.5 0 0 1 5 0" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.6 2.6 0 0 1-3.7-3.7z" />,
  alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>,
}

export default function Icon({ name, className }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {path}
    </svg>
  )
}
