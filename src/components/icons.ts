/**
 * A small, hand-drawn icon set on a 24×24 grid, stroked with currentColor.
 * Kept in one file so icons stay visually consistent and no icon library is
 * shipped. Render them with <Icon name="..." />.
 */
export const icons = {
  'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  close: '<path d="m6 6 12 12"/><path d="M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  minus: '<path d="M6 12h12"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  bell: '<path d="M18 16v-5a6 6 0 1 0-12 0v5l-1.5 2h15Z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  forward: '<path d="m15 5 5 5-5 5"/><path d="M20 10H9a5 5 0 0 0-5 5v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3"/><path d="m16 7 3 3"/><path d="m13.5 9.5 2 2"/>',
  trash:
    '<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="m6.5 7 1 13h9l1-13"/><path d="M10 11v5"/><path d="M14 11v5"/>',
  bug: '<path d="M9 8.5a3 3 0 0 1 6 0"/><rect x="7" y="8.5" width="10" height="12" rx="5"/><path d="M12 12v8.5"/><path d="M7 13H3.5"/><path d="M20.5 13H17"/><path d="m7.6 18-3.1 2.2"/><path d="m16.4 18 3.1 2.2"/><path d="M7.8 9.6 5 7.5"/><path d="M16.2 9.6 19 7.5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.6"/><path d="M12 17h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  doc: '<path d="M7 3h7l5 5v13H7Z"/><path d="M14 3v5h5"/><path d="M10 13h6"/><path d="M10 17h4"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  idea: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.2 1.1 2V16h5v-.2c0-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z"/>',
  briefcase:
    '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12.5h18"/>',
  chat: '<path d="M4 5h16v11H9.5L4 20Z"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  inbox:
    '<path d="M3 13.5 5.5 5h13l2.5 8.5V19H3Z"/><path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6Z"/>',
} as const;

export type IconName = keyof typeof icons;
