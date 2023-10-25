declare module "fili" {
  export class FirFilter {
    public constructor(coeffs: Coefficients);
    public singleStep(input: number): number;
  }
  export class FirCoeffs {
    public lowpass(params: LowpassParams): Coefficients;
  }

  export interface Coefficients {
    z: Array<number>;
    a: Array<number>;
    b: Array<number>;
  }

  export interface LowpassParams {
    order: number;
    Fs: number;
    Fc: number;
  }
}