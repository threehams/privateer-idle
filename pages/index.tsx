import React, { useEffect, useState } from "react";
import { GameProvider } from "@thing/game";

export const Index = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <GameProvider />;
};

export default Index;
