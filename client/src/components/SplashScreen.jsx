import React, { useEffect, useState } from "react";
import { Compass } from "lucide-react";

export default function SplashScreen({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeTarget, setFadeTarget] = useState(false);

  useEffect(() => {
    // Start fade out at 1000ms
    const fadeTimer = setTimeout(() => {
      setFadeTarget(true);
    }, 1000);

    // Completely unmount at 1500ms (after transition)
    const unmountTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!showSplash) return <>{children}</>;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Content rendered underneath so it doesn't pop in abruptly */}
      <div className="absolute inset-0 z-0">
        {children}
      </div>

      {/* Splash Screen Overlay */}
      <div
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 transition-opacity duration-500 ease-in-out ${
          fadeTarget ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Animated Gradient Orb */}
        <div className="relative flex items-center justify-center p-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 opacity-20 duration-1000"></div>
          <div className="absolute inset-2 animate-spin-slow rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-orange-500 blur-xl opacity-40"></div>
          
          <div className="relative z-10 p-6 rounded-full bg-gray-900/50 backdrop-blur-md border border-white/10 shadow-2xl">
            <Compass className="w-16 h-16 text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-orange-400 animate-pulse drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]" />
          </div>
        </div>

        {/* Text */}
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-fuchsia-200 to-orange-200 drop-shadow-md">
          PinCode <span className="text-orange-400 font-extrabold">India</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-gray-400 tracking-widest uppercase">
          Initializing Hub
        </p>
      </div>
    </div>
  );
}
