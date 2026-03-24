export type KeyboardEventType = {
  ARROW_DOWN: 'ArrowDown';
  ARROW_UP: 'ArrowUp';
  ENTER: 'Enter';
  KEYDOWN: 'keydown';
  SPACE: ' ';
};

export const KEYBOARD_EVENT: KeyboardEventType = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ENTER: 'Enter',
  KEYDOWN: 'keydown',
  SPACE: ' ',
} as const;
