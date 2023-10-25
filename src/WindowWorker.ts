import { workerData } from 'worker_threads';
import user32, { WStyles } from 'user32';
import { Webview } from 'webview-nodejs';
import { WindowOptions } from 'Window';

let options = workerData as WindowOptions;
let view = new Webview(options.debug);
view.title(options.title);
if (!options.titleBar && process.platform == 'win32') {
  let style = user32.GetWindowLongA(view.unsafeWindowHandle.address(), -16);
  style = style & ~WStyles.WS_CAPTION;
  user32.SetWindowLongA(view.unsafeWindowHandle.address(), -16, style);
}
view.size(options.size.width, options.size.height);
view.navigate(options.url);
view.show();