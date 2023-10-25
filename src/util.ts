export function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  let a = s * Math.min(l, 1 - l);
  let f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function bpmtoms(bpm: number) {
  return 1000 * 60 / bpm;
}