/**
 * Sahaya Liquid Glass (liquidGL) Integration Library
 * Version: 3.0.0
 * 
 * Provides safe WebGPU / WebGL2 / WebGL1 initialization with automatic
 * CSS backdrop-filter fallback, instance lifecycle management, deduplication,
 * and memory cleanup for React 19.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface LiquidGLOptions {
  engine?: 'auto' | 'webgpu' | 'webgl2' | 'webgl';
  snapshot?: string;
  target?: string | HTMLElement;
  resolution?: number;
  zIndex?: number;
  content?: string | boolean;
  refraction?: number;
  aberration?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  shadow?: boolean;
  specular?: boolean;
  reveal?: 'none' | 'fade';
  tilt?: boolean;
  tiltFactor?: number;
  tiltEase?: number;
  draggable?: boolean;
  interaction?: 'none' | 'fluid';
  interactionStrength?: number;
  interactionRadius?: number;
  interactionViscosity?: number;
  magnify?: number;
  tint?: string | null;
  helper?: boolean;
  on?: {
    init?: (instance: any) => void;
    dragstart?: (instance: any, info: any) => void;
    drag?: (instance: any, info: any) => void;
    dragend?: (instance: any, info: any) => void;
  };
}

export interface LiquidGlassPreset {
  refraction: number;
  bevelDepth: number;
  bevelWidth: number;
  frost: number;
  shadow: boolean;
  specular: boolean;
  tint?: string | null;
  tilt?: boolean;
  interaction?: 'none' | 'fluid';
  aberration?: number;
}

export const LIQUID_GLASS_PRESETS: Record<string, LiquidGlassPreset> = {
  // Ultra-clean crystal glass for floating navigation & toolbars
  nav: {
    refraction: 0.008,
    bevelDepth: 0.045,
    bevelWidth: 0.12,
    frost: 1.5,
    shadow: true,
    specular: true,
    tint: 'rgba(255, 255, 255, 0.45)',
    tilt: false,
    interaction: 'none',
    aberration: 0.01,
  },
  // Rich emerald tinted glass for hero cards and key highlights
  emerald: {
    refraction: 0.015,
    bevelDepth: 0.07,
    bevelWidth: 0.16,
    frost: 1.2,
    shadow: true,
    specular: true,
    tint: 'rgba(27, 67, 50, 0.12)',
    tilt: true,
    interaction: 'fluid',
    aberration: 0.02,
  },
  // Soft frosted glass for dashboards and metric tiles
  card: {
    refraction: 0.005,
    bevelDepth: 0.04,
    bevelWidth: 0.14,
    frost: 2.0,
    shadow: true,
    specular: true,
    tint: 'rgba(240, 251, 245, 0.55)',
    tilt: false,
    interaction: 'none',
    aberration: 0,
  },
  // High-depth interactive glass with fluid cursor ripple
  interactive: {
    refraction: 0.02,
    bevelDepth: 0.08,
    bevelWidth: 0.18,
    frost: 0.8,
    shadow: true,
    specular: true,
    tint: 'rgba(255, 255, 255, 0.35)',
    tilt: true,
    interaction: 'fluid',
    aberration: 0.025,
  },
  // Crisp dark jade glass for footers or callouts
  dark: {
    refraction: 0.012,
    bevelDepth: 0.06,
    bevelWidth: 0.14,
    frost: 1.5,
    shadow: true,
    specular: true,
    tint: 'rgba(15, 46, 33, 0.65)',
    tilt: false,
    interaction: 'none',
    aberration: 0.015,
  },
};

/**
 * Hook to apply liquidGL to a DOM element safely with full lifecycle cleanup
 */
export function useLiquidGL<T extends HTMLElement = HTMLDivElement>(
  options: Partial<LiquidGLOptions> = {},
  presetName: keyof typeof LIQUID_GLASS_PRESETS = 'card'
) {
  const elementRef = useRef<T | null>(null);
  const instanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const initLiquidGL = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const el = elementRef.current;
    if (!el) return;

    // Destroy existing instance on re-init to prevent duplicates
    if (instanceRef.current) {
      try {
        instanceRef.current.destroy?.();
      } catch (e) {
        // Ignore destruction errors
      }
      instanceRef.current = null;
    }

    try {
      const liquidGLModule = await import('liquid-gl');
      const liquidGLFn = liquidGLModule.default || (window as any).liquidGL;

      if (typeof liquidGLFn !== 'function') {
        console.warn('[liquidGL] Function not found in module, utilizing CSS fallback.');
        setHasError(true);
        return;
      }

      // Merge preset with user overrides
      const preset = LIQUID_GLASS_PRESETS[presetName] || LIQUID_GLASS_PRESETS.card;
      const mergedOptions: LiquidGLOptions = {
        engine: 'auto',
        snapshot: 'body',
        target: el,
        resolution: window.devicePixelRatio > 1.5 ? 1.5 : 2.0,
        refraction: preset.refraction,
        bevelDepth: preset.bevelDepth,
        bevelWidth: preset.bevelWidth,
        frost: preset.frost,
        shadow: preset.shadow,
        specular: preset.specular,
        tint: preset.tint,
        tilt: preset.tilt ?? false,
        interaction: preset.interaction ?? 'none',
        aberration: preset.aberration ?? 0,
        reveal: 'fade',
        ...options,
        on: {
          init: (inst) => {
            setIsReady(true);
            options.on?.init?.(inst);
          },
          ...options.on,
        },
      };

      const instance = (liquidGLFn as any)(mergedOptions);
      instanceRef.current = instance;
    } catch (err) {
      console.warn('[liquidGL] Initialization notice (using CSS glass fallback):', err);
      setHasError(true);
    }
  }, [options, presetName]);

  useEffect(() => {
    // Slight timeout ensures DOM has painted and bounding rectangles are stable
    const timer = setTimeout(() => {
      initLiquidGL();
    }, 60);

    return () => {
      clearTimeout(timer);
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy?.();
        } catch (e) {
          // Safe ignore
        }
        instanceRef.current = null;
      }
      setIsReady(false);
    };
  }, [initLiquidGL]);

  return {
    ref: elementRef,
    instance: instanceRef.current,
    isReady,
    hasError,
  };
}
