// app/providers/LoaderProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import FullScreenLoader from "../Loader/FullScreenLoader";

interface LoaderContextType {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
//   const searchParams = useSearchParams();

  // Detect route changes
  useEffect(() => {
    // Show loader when route starts changing
    setIsLoading(true);

    // Simulate route change completion (you can adjust the delay as needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust this delay based on your app's needs

    // Cleanup timeout on unmount or route change
    return () => clearTimeout(timer);
  }, [pathname]); // Trigger on pathname or searchParams change

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <FullScreenLoader isVisible={isLoading} />
    </LoaderContext.Provider>
  );
};

export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within LoaderProvider");
  }
  return context;
};

// // app/components/providers/LoaderProvider.tsx
// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";
// import FullScreenLoader from "../Loader/FullScreenLoader";

// interface LoaderContextType {
//   showLoader: () => void;
//   hideLoader: () => void;
// }

// const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const showLoader = () => setIsLoading(true);
//   const hideLoader = () => setIsLoading(false);

//   return (
//     <LoaderContext.Provider value={{ showLoader, hideLoader }}>
//       {children}
//       <FullScreenLoader isVisible={isLoading} />
//     </LoaderContext.Provider>
//   );
// };

// export const useLoader = (): LoaderContextType => {
//   const context = useContext(LoaderContext);
//   if (!context) {
//     throw new Error("useLoader must be used within LoaderProvider");
//   }
//   return context;
// };