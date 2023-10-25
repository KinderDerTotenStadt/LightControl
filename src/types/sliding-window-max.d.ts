declare module "sliding-window-max" {
  class SlidingWindowMax {
    public constructor(size: number, options?: { waitFullRange: boolean });
    public add(value: number): number;
  }
  export = SlidingWindowMax;
}