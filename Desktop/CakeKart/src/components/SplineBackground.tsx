import { useEffect, useState } from 'react';

interface SplineBackgroundProps {
  className?: string;
}

const SplineBackground = ({ className = "" }: SplineBackgroundProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure smooth loading
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`spline-background ${className}`}>
      {isLoaded && (
        <iframe
          src="https://my.spline.design/cakescene-b3f4c9e8a2b4e42c2e0f8c8e8c8c8c8c"
          className="w-full h-full border-0"
          title="3D Cake Scene"
          loading="lazy"
          style={{ 
            background: 'transparent',
            mixBlendMode: 'multiply',
            opacity: 0.6
          }}
        />
      )}
      
      {/* Fallback animated background */}
      {!isLoaded && (
        <div className="w-full h-full bg-gradient-hero opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/15 rounded-full blur-lg animate-bounce-soft"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float"></div>
        </div>
      )}
    </div>
  );
};

export default SplineBackground;