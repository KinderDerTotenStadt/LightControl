import { Library } from 'ffi-napi';
export default new Library('user32', {
  'SendMessageA': ['pointer', ['long', 'int32', 'long', 'int32']],
  'GetWindowLongA': ['int32', ['long', 'int32']],
  'SetWindowLongA': ['int32', ['long', 'int32', 'int32']]
});

export enum WMessages {
  WM_GETICON = 0x007F,
  WM_SETICON = 0x0080,
  WM_CLOSE = 0x0010,
  WM_PAINT = 0x000f
}

export enum WStyles {
  WS_BORDER = 0x00800000,
  WS_DLGFRAME = 0x00400000,
  WS_CAPTION = WS_BORDER | WS_DLGFRAME
}