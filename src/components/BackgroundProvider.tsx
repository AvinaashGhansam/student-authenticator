import bgImage from "../assets/background.svg?url";
import React, { type ReactNode } from "react";

interface BackgroundProviderProps {
  children: ReactNode;
}

const BackgroundProvider: React.FC<BackgroundProviderProps> = ({
  children,
}) => {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          backgroundColor: "#162a3b", // fallback color
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div style={{ position: "relative", minHeight: "100vh", zIndex: 0 }}>
        {children}
      </div>
    </>
  );
};

export default BackgroundProvider;
