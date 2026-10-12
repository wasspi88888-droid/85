import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withShadow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  withShadow = true,
}) => {
  // Dimensions and font sizes
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs rounded-lg',
    sm: 'w-8 h-8 text-sm rounded-xl',
    md: 'w-9 h-9 text-base rounded-xl',
    lg: 'w-12 h-12 text-xl rounded-2xl',
    xl: 'w-16 h-16 text-3xl rounded-3xl',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-white border border-gray-100/90 select-none ${sizeClasses} ${
        withShadow ? 'shadow-sm shadow-orange-500/10' : ''
      } ${className}`}
      style={{
        boxShadow: withShadow
          ? '0 2px 8px -1px rgba(255, 107, 53, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)'
          : undefined,
      }}
    >
      <span
        className="font-futuristic text-[#FF6B35] leading-none tracking-tighter"
        style={{
          textShadow: '0 0 1px rgba(255, 107, 53, 0.25)',
        }}
      >
        85
      </span>
    </div>
  );
};
