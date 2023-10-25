import { Worker } from 'worker_threads';

export interface WindowOptions {
  title: string;
  size: {
    width: number;
    height: number;
  };
  url: string;
  titleBar: boolean;
  debug: boolean;
}

export default class Window {
  private worker: Worker;

  constructor(options: WindowOptions) {
    this.worker = new Worker(require.resolve(`./WindowWorker`), {
      workerData: options
    });
  }
}