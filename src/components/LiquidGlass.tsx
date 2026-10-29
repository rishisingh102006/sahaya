import React, { forwardRef, useEffect, useRef } from 'react';
import { useLiquidGL, LiquidGLOptions, LIQUID_GLASS_PRESETS } from '../lib/liquidGlass';

export type GlassVariant = 'default' | 'emerald' | 'amber' | 'rose' | 'dark' | 'nav' | 'subtle';

export interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  preset?: keyof typeof LIQUID_GLASS_PRESETS;
  enableRefraction?: boolean;
  interactive?: boolean;
  specular?: boolean;
  tilt?: boolean;
  frost?: number;
  tint?: string;
  glow?: boolean;
  children?: React.ReactNode;
}

const VARIANT_CLASSES: Record<GlassVariant, string> = {
  default: 
    'bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(27,67,50,0.06)] hover:shadow-[0_12px_40px_0_rgba(27,67,50,0.1)]',
  emerald: 
    'bg-gradient-to-br from-[#f0fbf5]/90 via-white/85 to-[#e8f5ec]/80 backdrop-blur-xl border border-[#52b788]/30 shadow-[0_10px_36px_-4px_rgba(45,106,79,0.12)] hover:border-[#40916c]/50',
  amber: 
    'bg-gradient-to-br from-amber-50/90 via-white/85 to-amber-100/60 backdrop-blur-xl border border-amber-300/40 shadow-[0_10px_32px_-4px_rgba(217,119,6,0.1)]',
  rose: 
    'bg-gradient-to-br from-rose-50/90 via-white/85 to-rose-100/60 backdrop-blur-xl border border-rose-300/40 shadow-[0_10px_32px_-4px_rgba(225,29,72,0.12)]',
  dark: 
    'bg-gradient-to-br from-[#1b4332]/95 via-[#133726]/95 to-[#0b2b1e]/98 text-white backdrop-blur-2xl border border-[#74c69d]/25 shadow-[0_16px_48px_-8px_rgba(11,43,30,0.4)]',
  nav: 
    'bg-white/85 backdrop-blur-2xl border-b border-[#52b788]/20 shadow-[0_4px_24px_rgba(27,67,50,0.05)]',
  subtle: 
    'bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_20px_0_rgba(0,0,0,0.03)]',
};

/**
 * LiquidGlassCard Component
 * Renders an ultra-modern glass surface powered by liquidGL WebGPU/WebGL
 * with automatic, guaranteed CSS backdrop-filter fallback.
 */
export const LiquidGlassCard = forwardRef<HTMLDivElement, LiquidGlassCardProps>(({
  variant = 'default',
  preset = 'card',
  enableRefraction = false, // selective application per instructions
  interactive = false,
  specular = true,
  tilt = false,
  frost,
  tint,
  glow = false,
  className = '',
  children,
  ...rest
}, forwardedRef) => {
  const localRef = useRef<HTMLDivElement | null>(null);

  // Apply liquidGL only when enableRefraction is requested
  const options: Partial<LiquidGLOptions> = {
    tilt,
    specular,
    interaction: interactive ? 'fluid' : 'none',
    frost: frost !== undefined ? frost : undefined,
    tint: tint || undefined,
  };

  const { ref: liquidRef } = useLiquidGL(
    enableRefraction ? options : {},
    preset
  );

  // Combine refs
  const setRefs = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (enableRefraction) {
      (liquidRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <div
      ref={setRefs}
      className={`
        liquid-glass-lens relative rounded-3xl transition-all duration-300
        ${VARIANT_CLASSES[variant]}
        ${glow ? 'ring-1 ring-white/80 ring-offset-2 ring-offset-[#ebfbee]/50' : ''}
        ${className}
      `}
      {...rest}
    >
      {/* Glossy Top Edge Highlight (simulates true liquid bevel) */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] rounded-t-3xl bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90 z-10" 
        aria-hidden="true" 
      />

      {/* Foreground Content Container (keeps text, inputs and controls 100% crisp and readable) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
});

LiquidGlassCard.displayName = 'LiquidGlassCard';

/**
 * LiquidGlassPanel Component for larger dashboard sections & modals
 */
export const LiquidGlassPanel: React.FC<LiquidGlassCardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  return (
    <LiquidGlassCard
      variant={variant}
      className={`p-6 sm:p-8 ${className}`}
      {...props}
    >
      {children}
    </LiquidGlassCard>
  );
};

/**
 * LiquidGlassBadge Component for status tags & quick pills
 */
export interface LiquidGlassBadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'default' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const LiquidGlassBadge: React.FC<LiquidGlassBadgeProps> = ({ 
  children, 
  variant = 'emerald', 
  size = 'md',
  className = '', 
  icon 
}) => {
  const badgeColors = {
    emerald: 'bg-[#f0fbf5]/90 border-[#52b788]/40 text-[#1b4332] shadow-xs',
    amber: 'bg-amber-50/90 border-amber-300/40 text-amber-900 shadow-xs',
    rose: 'bg-rose-50/90 border-rose-300/40 text-rose-900 shadow-xs',
    subtle: 'bg-stone-50/80 border-stone-200/50 text-stone-600 shadow-xs',
    default: 'bg-white/80 border-stone-200/60 text-stone-700 shadow-xs',
  }[variant];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-xs',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-bold
        backdrop-blur-md border ${badgeColors} ${sizeClasses} ${className}
      `}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};

