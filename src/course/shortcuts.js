/*
 * Keyboard shortcuts shown with <OsKeys rows={…} />, Windows first (most students use Windows).
 * Wrap keys in [brackets] so they are drawn as keys.
 * Note: inside a terminal, a Mac uses the Control key (not Cmd) for Ctrl shortcuts like Ctrl + C.
 */
export const terminalKeys = [
  ['Open the terminal', 'Press [Win], type “Ubuntu”, press [Enter]', 'Press [Cmd] + [Space], type “Terminal”, press [Return]'],
  ['Run a command', '[Enter]', '[Return]'],
  ['Copy text from the terminal', '[Ctrl] + [Shift] + [C] (or select it and right-click)', '[Cmd] + [C]'],
  ['Paste into the terminal', '[Ctrl] + [Shift] + [V] (or right-click)', '[Cmd] + [V]'],
  ['Stop a running command', '[Ctrl] + [C]', '[Control] + [C] (Control, not Cmd!)'],
  ['Clear the screen', '[Ctrl] + [L] (or type clear)', '[Control] + [L] or [Cmd] + [K]'],
  ['Complete a file or folder name', '[Tab]', '[Tab]'],
  ['Bring back the last command', '[↑]', '[↑]'],
  ['Open the terminal inside VS Code', '[Ctrl] + [`]', '[Control] + [`]'],
]

export const editorKeys = [
  ['nano: save (“write out”)', '[Ctrl] + [O], then [Enter]', '[Control] + [O], then [Return]'],
  ['nano: exit', '[Ctrl] + [X]', '[Control] + [X]'],
  ['cat > file: finish typing', '[Ctrl] + [D] on a new line', '[Control] + [D] on a new line'],
  ['vim: start typing / stop typing', '[i] / [Esc]', '[i] / [Esc]'],
  ['vim: save and quit / quit without saving', 'type :wq / :q! then [Enter]', 'type :wq / :q! then [Return]'],
]

export const fileManagerKeys = [
  ['Show hidden files (names starting with .)', 'File Explorer → View → Show → Hidden items', 'Finder: [Cmd] + [Shift] + [.]'],
  ['Show file extensions (.png, .txt)', 'File Explorer → View → Show → File name extensions', 'Finder → Settings → Advanced → Show all filename extensions'],
  ['New folder', '[Ctrl] + [Shift] + [N] in File Explorer', '[Cmd] + [Shift] + [N] in Finder'],
  ['Open the folder you are in (from the terminal)', 'explorer.exe .', 'open .'],
]
