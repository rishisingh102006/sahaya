declare module 'liquid-gl' {
  export interface LiquidGLOptions {
    target?: HTMLElement | string;
    engine?: 'webgpu' | 'webgl' | 'webgl2' | 'css' | 'auto';
    snapshot?: boolean | string;
    refraction?: number;
    bevelDepth?: number;
    bevelWidth?: number;
    frost?: number;
    shadow?: number;
    specular?: number;
    tint?: string;
    interaction?: boolean;
    tilt?: boolean;
    [key: string]: any;
  }

  export interface LiquidGLInstance {
    destroy: () => void;
    update?: (options: Partial<LiquidGLOptions>) => void;
    [key: string]: any;
  }

  export function liquidGL(options: LiquidGLOptions): LiquidGLInstance | Promise<LiquidGLInstance>;
  export default liquidGL;
}
