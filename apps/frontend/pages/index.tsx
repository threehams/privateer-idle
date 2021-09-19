import React, { useEffect, useState } from "react";
import { GameProvider } from "../components/GameProvider";

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
